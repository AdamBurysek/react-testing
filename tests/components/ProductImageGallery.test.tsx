import { render, screen } from "@testing-library/react";
import ProductImageGallery from "../../src/components/ProductImageGallery";

describe("ProductImageGallery", () => {
  it("should render nothing if array is empty", () => {
    const element = render(<ProductImageGallery imageUrls={[]} />);
    expect(element.container.innerHTML).toHaveLength(0);
  });

  it("should render list of images", () => {
    const imageUrls: string[] = ["image1", "image2"];
    render(<ProductImageGallery imageUrls={imageUrls} />);

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(imageUrls.length);
    imageUrls.forEach((url, index) => {
      expect(images[index]).toHaveAttribute("src", url);
    });
  });
});
