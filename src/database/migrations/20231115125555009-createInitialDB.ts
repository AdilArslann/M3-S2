import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('users')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('username', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('sprints')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('sprint_code', 'text', (column) => column.notNull())
    .addColumn('title', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('completed_sprints')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (column) =>
      column.references('users.id').notNull()
    )
    .addColumn('sprint_id', 'integer', (column) =>
      column.references('sprints.id').notNull()
    )
    .execute();

  await db.schema
    .createTable('templates')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('content', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('messages')
    .addColumn('message_id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('completed_sprint_id', 'integer', (column) =>
      column.references('completed_sprints.id').notNull()
    )
    .addColumn('template_id', 'integer', (column) =>
      column.references('templates.id').notNull()
    )
    .addColumn('gif_url', 'text', (column) => column.notNull())
    .addColumn('sent_at', 'datetime', (column) => column.notNull())
    .addColumn('status', 'text', (column) => column.notNull())
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('sprints').execute();
  await db.schema.dropTable('completed_sprints').execute();
  await db.schema.dropTable('templates').execute();
  await db.schema.dropTable('messages').execute();
}
