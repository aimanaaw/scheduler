import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import "components/Application.scss";
import "../../src/components/Application.scss"
// import "./Appointment/styles.scss";
const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.payload }
    case SET_APPLICATION_DATA:
      return { ...state, ...action.payload }
    case SET_INTERVIEW:
      return { ...state, ...action.payload }
    default: throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
}

function spotCountIncrease(state, id) {
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
  console.log("THE ID & DayId", id, dayId);
  const currentSpotCount = state.days[dayId].spots;
  console.log("currentSpotCount", currentSpotCount);
  const newSpotCount = currentSpotCount - 1;
  console.log("newSpotCount", newSpotCount);
  console.log("THE STATE IS ", state)

  return state.days[dayId].spots = newSpotCount;
}

// days: action.payload.days,appointments: action.payload.appointments, interviewers: action.payload.interviewers

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
      console.log("THE payload is", receivedData);
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
          spotCountIncrease(state, id);
          break;
        default:
          console.log("TESTING DEFAULT");
      }
    }
    ws.onopen = (() => {
      ws.send("ping");
    });
  })



  // const [state, setState] = useState({
  //   day: "Monday",
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });


  function bookInterview(id, interview) {
    console.log("BOOK INTERBIEW ID:", id, interview)
    const appt = { ...state.appointments[id], interview: interview }; return axios.put(`http://localhost:8001/api/appointments/` + id, appt)
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          payload: { appointments: { ...state.appointments, [id]: { ...state.appointments[id], interview: interview } } }
        })
      })
  }

  const cancelInterview = function (interviewId) {
    // const deleteAppointment = {...state.appointments[interviewId], interview: null};
    return axios.delete(`http://localhost:8001/api/appointments/` + interviewId)
      .then(() => {
        // dispatch((prev) => ({...prev, appointments: {...prev.appointments, [interviewId]: {...prev.appointments[interviewId], interview:null}}}));
        dispatch({
          type: SET_INTERVIEW,
          payload: { appointments: { ...state.appointments, [interviewId]: { ...state.appointments[interviewId], interview: null } } }
        })
        // Promise.all([
        //   axios.get(`http://localhost:8001/api/days`),
        //   axios.get(`http://localhost:8001/api/appointments`),
        //   axios.get(`http://localhost:8001/api/interviewers`)
        // ])
        //   .then((all) => {
        //     const daysResponse = all[0].data;
        //     const appointmentsResponse = all[1].data;
        //     const interviewersResponse = all[2].data;
        //     // console.log("Interviewers Response!!!!",interviewersResponse);
        //     // setState(prev => {
        //     //   return ({...prev, days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse});
        //     // })
        //     dispatch({ type: SET_APPLICATION_DATA, payload: { days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse } })
        //   })
      })
  }

  const setDay = function (day) {
    dispatch({ type: SET_DAY, payload: day });
  };
  // const setDay = function (day) {
  //   setState ((prevState) => ({...prevState, day: day}));
  // };

  // const setDays = function(days) {
  //   dispatch(prev => ({ ...prev, days }));
  // }
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
        // console.log("Interviewers Response!!!!",interviewersResponse);
        // setState(prev => {
        //   return ({...prev, days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse});
        // })
        dispatch({ type: SET_APPLICATION_DATA, payload: { days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse } })
      })
  }, []);

  return { state, setDay, bookInterview, cancelInterview }

};