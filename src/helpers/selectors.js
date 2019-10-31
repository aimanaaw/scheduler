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
  console.log(getInterviewObject)

  return getInterviewObject;
}


