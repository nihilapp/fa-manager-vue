import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import 'dotenv/config';

import * as campaigns from '@server/db/table/campaigns.table';
import * as characters from '@server/db/table/characters.table';
import * as docs from '@server/db/table/docs.table';
import * as logHistories from '@server/db/table/logHistories.table';
import * as relations from '@server/db/table/relations';
import * as sessions from '@server/db/table/sessions.table';
import * as users from '@server/db/table/users.table';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = {
  ...users,
  ...campaigns,
  ...sessions,
  ...characters,
  ...docs,
  ...logHistories,
  ...relations,
};

export const db = drizzle(pool, { schema, casing: 'snake_case', });
