import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import ProductList from "../../src/components/ProductList";
import { server } from "../mocks/server";
import { http, HttpResponse, delay } from "msw";
import { db } from "../mocks/db";

describe("ProductList", () => {
  const productIds: number[] = [];
  beforeAll(() => {
    [1, 2, 3].forEach(() => {
      const product = db.product.create();
      productIds.push(product.id);
    });
  });

  afterAll(() => {
    db.product.deleteMany({ where: { id: { in: productIds } } });
  });

  it("renders render the list of products", async () => {
    render(<ProductList />);

    const items = await screen.findAllByRole("listitem");
    expect(items.length).toBeGreaterThan(0);
  });

  it("should render no products avabile if no products are available", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />);

    const message = await screen.findByText(/no products/i);
    expect(message).toBeInTheDocument();
  });

  it("should render an error message if the request fails", async () => {
    server.use(
      http.get("/products", () => {
        return HttpResponse.error();
      })
    );
    render(<ProductList />);

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading message if the request is pending", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(100);
        return HttpResponse.json([]);
      })
    );
    render(<ProductList />);

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading message when the request is complete", async () => {
    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });

  it("should remove the loading message when the request is failed", async () => {
    server.use(
      http.get("/products", async () => {
        await delay(100);
        return HttpResponse.error();
      })
    );
    render(<ProductList />);

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });
});
