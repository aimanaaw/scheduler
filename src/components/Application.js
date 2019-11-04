import React, { useState, useEffect } from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import "./Appointment/styles.scss";
import Appointment from "components/Appointment";
import {getAppointmentsForDay} from "../helpers/selectors";
import {getInterview} from "../helpers/selectors";
import {getInterviewersForDay} from "../helpers/selectors";
import useApplicationData from "../hooks/useApplicationData";

export default function Application(props) {

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();

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
