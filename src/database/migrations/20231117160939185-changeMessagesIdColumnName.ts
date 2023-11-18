import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .renameColumn('message_id', 'id')
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema
    .alterTable('messages')
    .renameColumn('id', 'message_id')
    .execute();
}
