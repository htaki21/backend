export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": ["'self'", "data:", "blob:", "https://dev3.razzali.com"],
          "media-src": ["'self'", "data:", "blob:", "https://dev3.razzali.com"],
          upgradeInsecureRequests: null,
        },
      },
      cors: {
        enabled: true,
        origin: ["https://dev3.razzali.com", "http://localhost:3000"],
        headers: ["*"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      },
    },
  },
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
