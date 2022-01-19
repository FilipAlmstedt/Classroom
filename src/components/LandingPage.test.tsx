import { render, screen } from "@testing-library/react";
import { LandingPage } from "./LandingPage";

test("renders the text in hero-page", () => {
    render(<LandingPage />)

    const heroText = screen.getByText(/Learn together, it's more fun!/i);
    const heroHeader = screen.getByText(/Welcome to Classroom/i);
    
    expect(heroText).toBeInTheDocument();
    expect(heroHeader).toBeInTheDocument();
})