import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { HttpResponse, http, delay } from "msw";
import { server } from "../../mocks/server";
import BrowseProducts from "../../../src/pages/BrowseProductsPage";
import AllProviders from "../../AllProviders";
import userEvent from "@testing-library/user-event";
import { db } from "../../mocks/db";
import { Category, Product } from "../../../src/entities";
import { wait } from "@testing-library/user-event/dist/cjs/utils/index.js";

describe("BrowseProductsPage", () => {
  const categories: Category[] = [];
  const products: Product[] = [];

  beforeAll(() => {
    [1, 2].forEach((item) => {
      categories.push(db.category.create({ name: "Category" + item }));
      products.push(db.product.create());
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
  };

  it("should render loading message when loading categories", async () => {
    server.use(
      http.get("/categories", async () => {
        await delay(100);
        return HttpResponse.json([]);
      })
    );
    rednderComponent();

    expect(
      await screen.findByRole("progressbar", { name: /categories/i })
    ).toBeInTheDocument();
  });

  it("should remove the loading message when categories are loaded", async () => {
    rednderComponent();

    await waitForElementToBeRemoved(() =>
      screen.getByRole("progressbar", { name: /categories/i })
    );
  });

  it("should render loading message when loading products", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(100);
        return HttpResponse.json([]);
      })
    );
    rednderComponent();

    expect(
      await screen.findByRole("progressbar", { name: /products/i })
    ).toBeInTheDocument();
  });

  it("should remove the loading message when products are loaded", async () => {
    rednderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );
  });

  it("should not render error message when categories are not fetched", async () => {
    server.use(
      http.get("/categories", () => {
        return HttpResponse.error();
      })
    );
    rednderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /categories/i })
    );

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("shourld render error message when products are not fetched", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
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
    rednderComponent();

    await waitForElementToBeRemoved(() =>
      screen.queryByRole("progressbar", { name: /products/i })
    );

    products.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
