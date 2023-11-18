import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('sprints').execute();
  await db.schema.dropTable('completed_sprints').execute();
  await db.schema.dropTable('templates').execute();
  await db.schema.dropTable('messages').execute();
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
    .createTable('templates')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('content', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('messages')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (column) =>
      column.references('users.id').notNull()
    )
    .addColumn('sprint_id', 'integer', (column) =>
      column.references('sprints.id').notNull()
    )
    .addColumn('template_id', 'integer', (column) =>
      column.references('templates.id').notNull()
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('users').execute();
  await db.schema.dropTable('sprints').execute();
  await db.schema.dropTable('completed_sprints').execute();
  await db.schema.dropTable('templates').execute();
  await db.schema.dropTable('messages').execute();
}
