import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "components/DayList";
import "components/Application.scss";
import "./Appointment/styles.scss";
import Appointment from "components/Appointment";
import {getAppointmentsForDay} from "../helpers/selectors";
import {getInterview} from "../helpers/selectors";
import {getInterviewersForDay} from "../helpers/selectors";
import { stat } from "fs";
export default function Application(props) {

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
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />

        <hr className="sidebar__separator sidebar--centered" />

        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>

      <section className="schedule">
        {getAppointmentsForDay(state, state.day).map(eachAppointment => {
          const interview = getInterview(state, eachAppointment.interview);
          const interviewer = getInterviewersForDay(state, state.day)
          return (
            <Appointment
              key={eachAppointment.id}
              id={eachAppointment.id}
              time={eachAppointment.time}
              interview={interview}
              bookInterview={bookInterview}
              day={state.day}
              state={state}
              interviewer={interviewer}
              cancelInterview={cancelInterview}
            />

          )
        })}
        <Appointment key="last" time="5pm" />
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
      </section>
    </main>
  );
}
