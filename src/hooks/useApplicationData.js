import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import "components/Application.scss";
import "../../src/components/Application.scss"
import reducer, {SET_DAY, SET_INTERVIEW, SET_APPLICATION_DATA} from "../reducers/application"
// const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);




export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

const bookInterview = function (id, interview) {
    const appt = {...state.appointments[id], interview: interview  }; return axios.put(`http://localhost:8001/api/appointments/` + id, appt)
    .then(() => {
    //   dispatch((prev) => ({...prev, appointments: {...prev.appointments, [id]: {...prev.appointments[id], interview:interview}}}));
    dispatch({
      type: SET_INTERVIEW,
      payload: {appointments: {...state.appointments, [id]: {...state.appointments[id], interview:interview}}}
    })
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
      dispatch({type:SET_APPLICATION_DATA, payload:{days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse}})
    })
  })
}

  const cancelInterview = function(interviewId) {
    // const deleteAppointment = {...state.appointments[interviewId], interview: null};
    return axios.delete(`http://localhost:8001/api/appointments/` + interviewId)
    .then(() => {
      // dispatch((prev) => ({...prev, appointments: {...prev.appointments, [interviewId]: {...prev.appointments[interviewId], interview:null}}}));
      dispatch({
        type: SET_INTERVIEW,
        payload: { appointments: {...state.appointments, [interviewId]: {...state.appointments[interviewId], interview:null}}}
      })
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
        dispatch({type:SET_APPLICATION_DATA, payload:{days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse}})
      })
      })

      }

  const setDay = function (day) {
    dispatch ({type: SET_DAY, value: day});
  };
  // useEffect(() => {
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
        dispatch({type:SET_APPLICATION_DATA, payload:{days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse}})
    })
  }, []);

return {state, setDay, bookInterview, cancelInterview}
  
};