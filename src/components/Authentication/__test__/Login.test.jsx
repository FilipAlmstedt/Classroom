import { fireEvent, render, screen } from "@testing-library/react";
import { Login } from "../Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


test("Renders the elements" ,() => {
    render(<Router><Login/></Router>);

    const header = screen.getByText(/Sign in here!/i);

    const emailLabel = screen.getByTestId("email-label");
    const emailInput = screen.getByTestId("email");

    const passwordLabel = screen.getByTestId("password-label");
    const passwordInput = screen.getByTestId("password");

    expect(header).toBeInTheDocument();

    expect(emailLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
})

test("the input tags should be empty!", async () => {
    render(<Router><Login/></Router>);
    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");

    expect(emailInput.value).toBe("");
    expect(passwordInput.value).toBe("");

})

test("accept value of inputs so the work", () => {
    render(<Router><Login/></Router>);

    const emailInput = screen.getByTestId("email");
    const passwordInput = screen.getByTestId("password");

    fireEvent.change(emailInput, {
        target: {
            value: "filip.almstedt@gmail.com"
        }
    });

    fireEvent.change(passwordInput, {
        target: {
            value: "password"
        }
    });

    expect(emailInput.value).toBe("filip.almstedt@gmail.com");
    expect(passwordInput.value).toBe("password");
})
