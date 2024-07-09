import { render, screen } from "@testing-library/react";
import OrderStatusSelector from "../../src/components/OrderStatusSelector";
import { Theme } from "@radix-ui/themes";
import userEvent from "@testing-library/user-event";

describe("OrderStatusSelector", () => {
  const renderComponent = () => {
    render(
      <Theme>
        <OrderStatusSelector onChange={vi.fn()} />
      </Theme>
    );
    return {
      button: screen.getByRole("combobox"),
    };
  };

  it("should render New as the default value", () => {
    const { button } = renderComponent();

    expect(button).toHaveTextContent(/new/i);
  });

  it("should render correct statuses", async () => {
    const { button } = renderComponent();

    const user = userEvent.setup();
    await user.click(button);

    const options = await screen.findAllByRole("option");
    expect(options).length(3);
    const labels = options.map((options) => options.textContent);
    expect(labels).toEqual(["New", "Processed", "Fulfilled"]);
  });
});
