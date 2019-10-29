import React, {Fragment} from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment (props) {
  // const appointmentTime = props
  return (
    <article className="appointment">
      <Header Time={props.time}
      />
       {props.interview ? <Show interviewer = {props.interview.interviewer} student = {props.interview.student} /> : <Empty />}
    </article>
  )
}