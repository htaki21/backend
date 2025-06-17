/**
 * product router
 */

import { factories } from "@strapi/strapi";

const defaultRouter = factories.createCoreRouter("api::product.product");

// Create custom routes
const customRoutes = [
  {
    method: "GET",
    path: "/products",
    handler: "api::product.product.find",
    config: {
      middlewares: [],
      policies: [],
    },
  },
];

export default {
  ...defaultRouter,
  routes: Array.isArray(defaultRouter.routes)
    ? [...defaultRouter.routes, ...customRoutes]
    : [...defaultRouter.routes(), ...customRoutes],
};
