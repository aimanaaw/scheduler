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
  let interviewerIdArray = [];

  state.days.forEach( d => {
    if (d.name === day) {
      interviewerIdArray = [...d.interviewers]
    };
  })
  const arrayOfInterviewers = interviewerIdArray.map(eachInterviewerId => {
    return state.interviewers[eachInterviewerId];
  }); 

  return arrayOfInterviewers;
  // return interviewerIdArray;


}


