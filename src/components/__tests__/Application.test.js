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

  // it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
  //   const { container, debug } = render(<Application />);
  //   await waitForElement(() => getByText(container, "Archie Cohen"));
  //   // const appointments = getAllByTestId(container, "appointment");
  //   const appointment = getAllByTestId(container, "appointment")[0];
  //   // console.log(prettyDOM(appointment));
  //   // console.log("TESTING", debug(Application));
  //   // console.log("TESTING CONTAINER", prettyDOM(container));
  // });

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
    debug();
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    // const appointments = getAllByTestId(container, "appointment");
    // const appointment = appointments[0];
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(getByAltText(appointment, "Delete"));
  
    // fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    //   target: { value: "Lydia Miller-Jones" }
    // });
    // fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
  
    // fireEvent.click(getByText(appointment, "Save"));
    
    // // console.log(prettyDOM(appointment));
    
    // expect(getByAltText(appointment, "Loading")).toBeInTheDocument();

    // await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // // console.log(prettyDOM(appointment));

    // expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    // const day = getAllByTestId(container, "day").find(day =>
    //   queryByText(day, "Monday")
    // );
    
    // // console.log(prettyDOM(day));

    // expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    debug();
  });

})


