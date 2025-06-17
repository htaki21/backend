export default {
  rest: {
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
  responses: {
    privateAttributes: [],
  },
  requests: {
    defaultPopulate: ["marque", "category"],
  },
};
