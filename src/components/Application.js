import React, {useState} from "react";
import DayList from "components/DayList";
import "components/Application.scss";
import "./Appointment/styles.scss";
import Appointment from "components/Appointment"

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
];

const days = [
  {
    id: 1,
    name: "Monday",
    spots: 2,
  },
  {
    id: 2,
    name: "Tuesday",
    spots: 5,
  },
  {
    id: 3,
    name: "Wednesday",
    spots: 0,
  },
];

export default function Application(props) {
  const [day, setDay] = useState("Monday");
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
            days={days}
            day={day}
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
        {appointments.map(eachAppointment => {
          return (
            <Appointment
            key={eachAppointment.id}
            {...eachAppointment}
            />

          )
        })}
        <Appointment key="last" time="5pm" />
        {/* Replace this with the schedule elements durint the "The Scheduler" activity. */}
      </section>
    </main>
  );
}
