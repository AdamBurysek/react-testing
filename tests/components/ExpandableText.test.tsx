import { render, screen } from "@testing-library/react";
import ExpandableText from "../../src/components/ExpandableText";
import userEvent from "@testing-library/user-event";

describe("Expandable Text", () => {
  it("should not limit text when text is short", () => {
    const textContent = "Short string";
    render(<ExpandableText text={textContent} />);

    const text = screen.getByText(textContent);
    expect(text).toBeInTheDocument();

    const button = screen.queryByRole("button");
    expect(button).not.toBeInTheDocument();
  });

  it("should limit text when text is short", () => {
    const textContent =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, ad sint amet laudantium natus reprehenderit earum alias perferendis nesciunt? Dicta dolorem sunt in alias iusto eum illo iste fuga, voluptatibus commodi dolores velit consequuntur! Modi, magni provident veniam harum commodi iure tempore incidunt assumenda quo neque maxime in dolore corporis ullam odio, maiores illum fugiat reiciendis illo, velit dignissimos blanditiis dicta. Optio laboriosam, repudiandae, eaque dolor eum debitis temporibus at molestiae, sit perspiciatis veritatis sed doloremque? Veritatis laborum alias quis at tempora distinctio, officia iusto mollitia temporibus eius minima laboriosam dolorum ullam praesentium aut, similique nemo iure. Possimus, facilis vitae!";
    render(<ExpandableText text={textContent} />);

    const text = screen.queryByText(textContent);
    expect(text).not.toBeInTheDocument();

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/more/i);
  });

  it("should expand text when button is pressed", async () => {
    const textContent =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, ad sint amet laudantium natus reprehenderit earum alias perferendis nesciunt? Dicta dolorem sunt in alias iusto eum illo iste fuga, voluptatibus commodi dolores velit consequuntur! Modi, magni provident veniam harum commodi iure tempore incidunt assumenda quo neque maxime in dolore corporis ullam odio, maiores illum fugiat reiciendis illo, velit dignissimos blanditiis dicta. Optio laboriosam, repudiandae, eaque dolor eum debitis temporibus at molestiae, sit perspiciatis veritatis sed doloremque? Veritatis laborum alias quis at tempora distinctio, officia iusto mollitia temporibus eius minima laboriosam dolorum ullam praesentium aut, similique nemo iure. Possimus, facilis vitae!";
    render(<ExpandableText text={textContent} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(button);

    const text = screen.getByText(textContent);
    expect(text).toBeInTheDocument();
  });

  it("should collapse text when button is pressed", async () => {
    const textContent =
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, ad sint amet laudantium natus reprehenderit earum alias perferendis nesciunt? Dicta dolorem sunt in alias iusto eum illo iste fuga, voluptatibus commodi dolores velit consequuntur! Modi, magni provident veniam harum commodi iure tempore incidunt assumenda quo neque maxime in dolore corporis ullam odio, maiores illum fugiat reiciendis illo, velit dignissimos blanditiis dicta. Optio laboriosam, repudiandae, eaque dolor eum debitis temporibus at molestiae, sit perspiciatis veritatis sed doloremque? Veritatis laborum alias quis at tempora distinctio, officia iusto mollitia temporibus eius minima laboriosam dolorum ullam praesentium aut, similique nemo iure. Possimus, facilis vitae!";
    render(<ExpandableText text={textContent} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(button);

    await user.click(button);

    const text = screen.queryByText(textContent);
    expect(text).not.toBeInTheDocument();
  });
});
