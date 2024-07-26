import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { HttpResponse, http, delay } from "msw";
import { server } from "../../mocks/server";
import BrowseProducts from "../../../src/pages/BrowseProductsPage";
import AllProviders from "../../AllProviders";

describe("BrowseProductsPage", () => {
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
      screen.getByRole("progressbar", { name: /products/i })
    );
  });
});
