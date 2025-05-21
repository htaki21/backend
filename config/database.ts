export default ({ env }) => ({
  connection: {
    client: env("DATABASE_CLIENT", "postgres"),
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "strapidb"),
      user: env("DATABASE_USERNAME", "strapiuser"),
      password: env("DATABASE_PASSWORD", "taki1234"),
      ssl: env.bool("DATABASE_SSL", false),
    },
    debug: false,
    schema: {
      disableMigrations: true,
    },
  },
});
