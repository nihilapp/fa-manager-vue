import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  dialect: 'postgresql',
  schema: './src/server/db/table/**.ts',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
  casing: 'snake_case',
});
