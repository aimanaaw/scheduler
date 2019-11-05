import React, { Fragment } from "react";
import "./styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Error from "./Error";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "../../hooks/useVisualMode";
import {getInterviewersForDay} from "../../helpers/selectors";

// The different modes to be used in the transaction function
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const STATUS = "STATUS";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const CONFIRM = "CONFIRM";


export default function Appointment(props) {

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function editFunction (selectedId) {
    transition(EDIT);
  }

  function save(name, interviewer) {
    transition(STATUS);
    const interview = {
      student: name,
      interviewer
    };
    
    return props.bookInterview(props.id, interview)
  }

  function confirmDelete() {
    transition(CONFIRM);
  }

  function cancelInterview() {
    transition(STATUS);
    props.cancelInterview(props.id).then(() => transition(EMPTY))
  }

  function onSave(enteredName, selectedInterviewer) {
    save(enteredName, selectedInterviewer).then(() => transition(SHOW)).catch(error => transition(ERROR_SAVE));
  };

  function onCancel() {
    back();
  };
  return (
    <article className="appointment" data-testid="appointment">
      
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => {transition(CREATE)}} />}
      {mode === ERROR_SAVE && <Error />}
      {mode === CREATE && <Form interviewers={getInterviewersForDay(props.state, props.day)} onCancel={onCancel} onSave={onSave} />}
      {mode === STATUS && <Status />}
      {mode === CONFIRM && (
        <Confirm
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onConfirm={cancelInterview}
          onCancel={onCancel}
        />
      )}
      {mode === SHOW && props.interview && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={confirmDelete}
          onEdit={editFunction}
        />
      )}
      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={getInterviewersForDay(props.state, props.day)} onCancel={onCancel}
          onSave={onSave}
          editCheck={true}
        />
      )}


    </article>
  )
}