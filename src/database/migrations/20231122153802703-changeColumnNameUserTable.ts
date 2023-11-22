import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
  .alterTable('users')
  .renameColumn('user_id', 'discord_id')
  .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema
  .alterTable('users')
  .renameColumn('discord_id', 'user_id')
  .execute();
}
