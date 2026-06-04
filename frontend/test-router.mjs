import { createMemoryRouter, matchRoutes } from "react-router-dom";
const routes = [
  {
    path: "/en/*",
    children: [
      { path: "" },
      { path: "login" },
      { path: "blog" },
      { path: "blog/:slug" }
    ]
  },
  {
    path: "/*",
    children: [
      { path: "" },
      { path: "login" },
      { path: "blog" },
      { path: "blog/:slug" }
    ]
  }
];
const matches = matchRoutes(routes, "/en/blog");
console.log(matches ? matches.map(m => m.route.path) : "NO MATCH");
