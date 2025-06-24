/**
 * product controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::product.product",
  ({ strapi }) => ({
    async find(ctx) {
      // Add populate parameter if not present
      if (!ctx.query.populate) {
        ctx.query.populate = {
          marque: true,
          category: true,
          images: true,
        };
      } else if (ctx.query.populate === "*") {
        // If populate is '*', it will already include all relations
      } else if (typeof ctx.query.populate === "object") {
        // Ensure marque is included in populate
        const populate = ctx.query.populate as Record<string, unknown>;
        if (!("marque" in populate)) {
          populate.marque = true;
        }
      }

      // Call the default find method
      const result = await super.find(ctx);
      return result;
    },

    async findOne(ctx) {
      // Add populate parameter if not present
      if (!ctx.query.populate) {
        ctx.query.populate = {
          marque: true,
          category: true,
          images: true,
        };
      } else if (ctx.query.populate === "*") {
        // If populate is '*', it will already include all relations
      } else if (typeof ctx.query.populate === "object") {
        // Ensure marque is included in populate
        const populate = ctx.query.populate as Record<string, unknown>;
        if (!("marque" in populate)) {
          populate.marque = true;
        }
      }

      // Call the default findOne method
      const result = await super.findOne(ctx);
      return result;
    },
  })
);
