export function getAppointmentsForDay(state, day) {
  const dayObject = state.days.find(eachDay => {
    return day === eachDay.name;
  });
  if (!dayObject) {
    return [];
  };
  const appointmentsArrayOfObjects = dayObject.appointments.map(eachId => {
    return state.appointments[eachId];
  });
  return appointmentsArrayOfObjects;
}

export function getInterview(state, interview) {
  if(!interview || !interview.interviewer) {
    return null;
  };
  const getInterviewObject = {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  }

  return getInterviewObject;
}

export function getInterviewersForDay(state, day) {
  const  appointments = getAppointmentsForDay(state, day);

  // console.log(appointments);
  const interviewerIdArray = [];
  appointments.map( eachAppointment => {
    // console.log("TESTING ------ >", eachAppointment)
    // console.log("LOGING---> ", eachAppointment.interview)
    if (eachAppointment.interview) {
      interviewerIdArray.push(eachAppointment.interview.interviewer);
    }
  })
  // console.log("CHECKING", interviewerIdArray);

  const arrayOfInterviewers = interviewerIdArray.map(eachInterviewerId => {
    return state.interviewers[eachInterviewerId];
  })
  // console.log("HELLOOOO", arrayOfInterviewers);

  return arrayOfInterviewers;
  // return interviewerIdArray;


}


