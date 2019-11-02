import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import "../../src/components/Application.scss"
// import "./Appointment/styles.scss";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });


  const bookInterview = function (id, interview) {
    const appt = {...state.appointments[id], interview: interview  }; return axios.put(`http://localhost:8001/api/appointments/` + id, appt)
    .then(() => {
      setState((prev) => ({...prev, appointments: {...prev.appointments, [id]: {...prev.appointments[id], interview:interview}}}));
    })
  };

  const cancelInterview = function(interviewId) {
    // const deleteAppointment = {...state.appointments[interviewId], interview: null};
    return axios.delete(`http://localhost:8001/api/appointments/` + interviewId)
    .then(() => {
      setState((prev) => ({...prev, appointments: {...prev.appointments, [interviewId]: {...prev.appointments[interviewId], interview:null}}}));
    })
  }

  const setDay = function (day) {
    setState ((prevState) => ({...prevState, day: day}));
  };

  const setDays = function(days) {
    setState(prev => ({ ...prev, days }));
  }
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
      setState(prev => {
        return ({...prev, days: daysResponse, appointments: appointmentsResponse, interviewers: interviewersResponse});
      })
    })
  }, []);

  return {state, setDay, bookInterview, cancelInterview}

};