import { render, screen } from "@testing-library/react";
import ToastDemo from "../../src/components/ToastDemo";
import userEvent from "@testing-library/user-event";
import { Toaster } from "react-hot-toast";

describe("ToastDemo", () => {
  const renderComponent = () => {
    render(
      <>
        <ToastDemo />
        <Toaster />
      </>
    );

    return {
      button: screen.getByRole("button"),
    };
  };

  it("should render button", () => {
    const { button } = renderComponent();

    expect(button).toBeInTheDocument();
  });

  it("should render toast", async () => {
    const { button } = renderComponent();

    const user = userEvent.setup();
    await user.click(button);
    const toast = await screen.findByText(/success/i);

    expect(toast).toBeInTheDocument();
  });
});
