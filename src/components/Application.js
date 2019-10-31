import React, { useState, useEffect } from "react";
import axios from "axios";
import DayList from "components/DayList";
import "components/Application.scss";
import "./Appointment/styles.scss";
import Appointment from "components/Appointment";
import {getAppointmentsForDay} from "../helpers/selectors";
import {getInterview} from "../helpers/selectors";

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = function (day) {
    setState ({...state, day: day})
  };

  const setDays = function(days) {
    setState(prev => ({ ...state, days }));
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
          return (
            <Appointment
              key={eachAppointment.id}
              id={eachAppointment.id}
              time={eachAppointment.time}
              interview={interview}
            />

          )
        })}
        <Appointment key="last" time="5pm" />
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
      </section>
    </main>
  );
}
