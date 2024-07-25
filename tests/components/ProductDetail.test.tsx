import { render, screen } from "@testing-library/react";
import ProductDetail from "../../src/components/ProductDetail";

describe("ProductDetail", () => {
  it("should render the list of products", async () => {
    render(<ProductDetail productId={1} />);

    expect(await screen.findByText(/iphone 14/i)).toBeInTheDocument();
  });
});
