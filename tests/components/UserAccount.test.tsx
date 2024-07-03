import { render, screen } from "@testing-library/react";
import UserAccount from "../../src/components/UserAccount";
import { User } from "../../src/entities";

describe("UserAccount", () => {
  it("should render name when name is provided", () => {
    const user: User = {
      id: 123,
      name: "Adam",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);

    const name = screen.getByText(user.name);
    expect(name).toBeInTheDocument();
  });

  it("should not render edit button when user is not admin", () => {
    const user: User = {
      id: 123,
      name: "Adam",
      isAdmin: false,
    };
    render(<UserAccount user={user} />);

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should render edit button when user is admin", () => {
    const user: User = {
      id: 123,
      name: "Adam",
      isAdmin: true,
    };
    render(<UserAccount user={user} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/edit/i);
  });
});
