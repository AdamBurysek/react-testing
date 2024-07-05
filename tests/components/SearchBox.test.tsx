import { render, screen } from "@testing-library/react";
import SearchBox from "../../src/components/SearchBox";
import userEvent from "@testing-library/user-event";

describe("SearchBox", () => {
  const renderSearchbox = () => {
    const onChange = vi.fn();
    render(<SearchBox onChange={onChange} />);

    return {
      input: screen.getByPlaceholderText(/search/i),
      onChange,
    };
  };

  it("should render input field for searching", () => {
    const { input } = renderSearchbox();

    expect(input).toBeInTheDocument();
  });

  it("should call onChange when Enter is pressed", async () => {
    const { input, onChange } = renderSearchbox();

    const user = userEvent.setup();
    const searchTerm = "Milk";
    await user.type(input, searchTerm + "{enter}");

    expect(onChange).toHaveBeenCalledWith(searchTerm);
  });

  it("should npt call onChange when input is entry", async () => {
    const { input, onChange } = renderSearchbox();

    const user = userEvent.setup();

    await user.type(input, "{enter}");

    expect(onChange).not.toHaveBeenCalled();
  });
});
