import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import "components/Application.scss";
import "../../src/components/Application.scss"
import reducer, {SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA} from "../reducers/application"
const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);


function spotCounter(state, id, interview) {
  let dayId = 0;
  if (id > 0 && id <= 5) {
    dayId = 0;
  } else if (id > 5 && id <= 10) {
    dayId = 1;
  } else if (id > 10 && id <= 15) {
    dayId = 2;
  } else if (id > 15 && id <= 20) {
    dayId = 3;
  } else if (id > 20 && id <= 25) {
    dayId = 4;
  }
  const currentSpotCount = state.days[dayId].spots;
  if (interview) {
    const newSpotCount = currentSpotCount - 1;
    return state.days[dayId].spots = newSpotCount;
  };
  const newSpotCount = currentSpotCount + 1;
  return state.days[dayId].spots = newSpotCount;

}


export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    ws.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      const id = receivedData.id;
      const interview = receivedData.interview;
      const type = receivedData.type;
      switch (type) {
        case "SET_INTERVIEW":
          console.log("ID::", id);
          console.log("Interview::", interview)
          dispatch({
            type: SET_INTERVIEW,
            payload: { appointments: { ...state.appointments, [id]: { ...state.appointments[id], interview: interview } } }
          });
          spotCounter(state, id, interview);
          break;
        default:
      }
    }
    ws.onopen = (() => {
      ws.send("ping");
    });
  })

  function bookInterview(id, interview) {
    const appt = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    return axios.put(`http://localhost:8001/api/appointments/` + id, appt)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          payload: {
            appointments: {
              ...state.appointments,
              [id]: appt,
            } 
          }
        })
      })
  }

  const cancelInterview = function (interviewId) {
    return axios.delete(`http://localhost:8001/api/appointments/` + interviewId)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          payload: { appointments: { ...state.appointments, [interviewId]: { ...state.appointments[interviewId], interview: null } } }
        })
      })
  }

  const setDay = function (day) {
    dispatch({ type: SET_DAY, payload: day });
  };
  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:8001/api/days`),
      axios.get(`http://localhost:8001/api/appointments`),
      axios.get(`http://localhost:8001/api/interviewers`)
    ])
      .then((all) => {
        const daysResponse = all[0].data;
        const appointmentsResponse = all[1].data;
        const interviewersResponse = all[2].data;
        dispatch({ type: SET_APPLICATION_DATA, payload: { days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse } })
      })
  }, []);

  return { state, setDay, bookInterview, cancelInterview }

};