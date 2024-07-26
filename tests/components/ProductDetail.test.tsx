import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { HttpResponse, delay, http } from "msw";
import ProductDetail from "../../src/components/ProductDetail";
import AllProviders from "../AllProviders";
import { db } from "../mocks/db";
import { server } from "../mocks/server";

describe("ProductDetail", () => {
  let productId: number;

  beforeAll(() => {
    const product = db.product.create();
    productId = product.id;
  });

  afterAll(() => {
    db.product.delete({ where: { id: { equals: productId } } });
  });

  it("should render product details", async () => {
    const product = db.product.findFirst({
      where: { id: { equals: productId } },
    });

    render(<ProductDetail productId={productId} />, { wrapper: AllProviders });

    expect(
      await screen.findByText(new RegExp(product!.name))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(new RegExp(product!.price.toString()))
    ).toBeInTheDocument();
  });

  it("should render message if product not found", async () => {
    server.use(http.get("/products/1", () => HttpResponse.json(null)));

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it("should render an error message if the request fails", async () => {
    server.use(
      http.get("/products/1", () => {
        return HttpResponse.error();
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });

  it("should render a loading message if the request is pending", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay(100);
        return HttpResponse.json({});
      })
    );

    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });

  it("should remove the loading message when the request is complete", async () => {
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });

  it("should remove the loading message when the request is failed", async () => {
    server.use(
      http.get("/products/1", async () => {
        await delay(100);
        return HttpResponse.error();
      })
    );
    render(<ProductDetail productId={1} />, { wrapper: AllProviders });

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
  });
});
