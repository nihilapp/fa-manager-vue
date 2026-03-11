import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: './src/server/db/schema.prisma',
  datasource: {
    url: process.env.DB_URL,
  },
});
