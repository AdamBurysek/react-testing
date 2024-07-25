import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/categories", () => {
    return HttpResponse.json([
      { id: 1, name: "Electronics" },
      { id: 2, name: "Beauty" },
      { id: 3, name: "Gardening" },
    ]);
  }),

  http.get("/products", (req) => {
    return HttpResponse.json([
      { id: 1, name: "iPhone 14" },
      { id: 2, name: "iPhone 14 Pro" },
      { id: 3, name: "iPhone 14 Pro Max" },
      { id: 4, name: "iPhone 14 Plus" },
      { id: 5, name: "iPhone 14 Pro Max" },
      { id: 6, name: "iPhone 14 Plus" },
      { id: 7, name: "iPhone 14 Pro" },
      { id: 8, name: "iPhone 14 Pro Max" },
      { id: 9, name: "iPhone 14 Plus" },
      { id: 10, name: "iPhone 14 Pro Max" },
    ]);
  }),
];
