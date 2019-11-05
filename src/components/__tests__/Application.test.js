import React from "react";

import { render, cleanup, waitForElement, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {

  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
  
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    fireEvent.click(getByText(appointment, "Save"));
    
    // console.log(prettyDOM(appointment));
    
    expect(getByAltText(appointment, "Loading")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // console.log(prettyDOM(appointment));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    // console.log(prettyDOM(day));

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  // Cancelling an Interview

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // const appointments = getAllByTestId(container, "appointment");
    // const appointment = appointments[0];
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    expect(getByText(appointment, "Confirm")).toBeInTheDocument();
    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByAltText(appointment, "Loading")).toBeInTheDocument();


    await waitForElement(() => getByAltText(appointment, "Add"));
    // console.log(prettyDOM(appointment));

    const day = await waitForElement(() => getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"))
    );
    
    // console.log(prettyDOM(day));

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
// Initial check for number of spots remaining
    const day = await waitForElement(() => getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday"))
    );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    expect(getByAltText(appointment, "Edit")).toBeInTheDocument();
    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByText(appointment, "Save")).toBeInTheDocument();
    expect(getByText(appointment, "Cancel")).toBeInTheDocument();


    fireEvent.click(getByText(appointment, "Save"));

    // const day = await waitForElement(() => getAllByTestId(container, "day").find(day =>
    //   queryByText(day, "Monday"))
    // );
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    console.log(prettyDOM(day));
  });

})


