import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Category, Product } from "../../../src/entities";
import BrowseProducts from "../../../src/pages/BrowseProductsPage";
import AllProviders from "../../AllProviders";
import { db } from "../../mocks/db";
import { simulateDelay, simulateError } from "../../utils";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      const category = db.category.create({ name: "category" + item });
      categories.push(category);
      [1, 2].forEach(() => {
        products.push(db.product.create({ categoryId: category.id }));
      });
    });
  });

  afterAll(() => {
    const categoryIds = categories.map((c) => c.id);
    db.category.deleteMany({ where: { id: { in: categoryIds } } });

    const productIds = products.map((p) => p.id);
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  const rednderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProviders });

    return {
      getProductsSkeleton: () =>
        screen.queryByRole("progressbar", { name: /products/i }),
      getCategoriesSkeleton: () =>
        screen.queryByRole("progressbar", { name: /categories/i }),
    };
  };

  it("should render loading message when loading categories", async () => {
    simulateDelay("/categories");
    const { getCategoriesSkeleton } = rednderComponent();

    expect(getCategoriesSkeleton()).toBeInTheDocument();
  });

  it("should remove the loading message when categories are loaded", async () => {
    const { getCategoriesSkeleton } = rednderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);
  });

  it("should render loading message when loading products", async () => {
    simulateDelay("/products");
    const { getProductsSkeleton } = rednderComponent();

    expect(getProductsSkeleton()).toBeInTheDocument();
  });

  it("should remove the loading message when products are loaded", async () => {
    const { getProductsSkeleton } = rednderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);
  });

  it("should not render error message when categories are not fetched", async () => {
    simulateError("/categories");
    const { getCategoriesSkeleton } = rednderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("shourld render error message when products are not fetched", async () => {
    simulateError("/products");
    rednderComponent();

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render categories", async () => {
    rednderComponent();

    const combobox = await screen.findByRole("combobox");
    expect(combobox).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(combobox);

    expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
    categories.forEach((category) => {
      expect(
        screen.getByRole("option", { name: category.name })
      ).toBeInTheDocument();
    });
  });

  it("should render products", async () => {
    const { getProductsSkeleton } = rednderComponent();

    await waitForElementToBeRemoved(getProductsSkeleton);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should filter products by category", async () => {
    const { getCategoriesSkeleton } = rednderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.click(combobox);

    const selectedCategory = categories[0];
    const option = screen.getByRole("option", { name: selectedCategory.name });
    await user.click(option);

    const products = db.product.findMany({
      where: { categoryId: { equals: selectedCategory.id } },
    });
    const rows = await screen.findAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it("should render all products when all categories are selected", async () => {
    const { getCategoriesSkeleton } = rednderComponent();

    await waitForElementToBeRemoved(getCategoriesSkeleton);

    const combobox = await screen.findByRole("combobox");

    const user = userEvent.setup();
    await user.click(combobox);

    const option = screen.getByRole("option", { name: /all/i });
    await user.click(option);

    const products = db.product.getAll();
    const rows = await screen.findAllByRole("row");
    const dataRows = rows.slice(1);
    expect(dataRows).toHaveLength(products.length);

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
