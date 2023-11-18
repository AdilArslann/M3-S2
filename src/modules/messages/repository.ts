import type {
  ExpressionOrFactory,
  Insertable,
  Selectable,
  SqlBool,
  Updateable,
} from 'kysely';
import { keys } from './schema';
import type { Messages, Database, DB } from '@/database';
import BadRequest from '@/utils/errors/BadRequest';

const TABLE = 'messages';
type TableName = typeof TABLE;
type Row = Messages;
type RowWithoutId = Omit<Row, 'id'>;
type RowRelationshipsIds = Pick<Row, 'userId' | 'sprintId' | 'templateId'>;
type RowInsert = Insertable<RowWithoutId>;
type RowUpdate = Updateable<RowWithoutId>;
type RowSelect = Selectable<Row>;

export default (db: Database) => ({
  findAll(): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).execute();
  },
  find(
    expression: ExpressionOrFactory<DB, TableName, SqlBool>
  ): Promise<RowSelect[]> {
    return db.selectFrom(TABLE).select(keys).where(expression).execute();
  },
  findById(id: number): Promise<RowSelect | undefined> {
    return db
      .selectFrom(TABLE)
      .select(keys)
      .where('id', '=', id)
      .executeTakeFirst();
  },
  async create(record: RowInsert): Promise<RowSelect | undefined> {
    await assertRelationshipsExist(db, record);

    return db
      .insertInto(TABLE)
      .values(record)
      .returning(keys)
      .executeTakeFirst();
  },
  async update(id: number, partial: RowUpdate): Promise<RowSelect | undefined> {
    if (Object.keys(partial).length === 0) {
      return this.findById(id);
    }

    await assertRelationshipsExist(db, partial);

    return db
      .updateTable(TABLE)
      .set(partial)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },
  remove(id: number) {
    return db
      .deleteFrom(TABLE)
      .where('id', '=', id)
      .returning(keys)
      .executeTakeFirst();
  },
});

async function assertRelationshipsExist(
  db: Database,
  record: Partial<RowRelationshipsIds>
) {
  const { userId, sprintId, templateId } = record;
  if (userId) {
    const user = await db
      .selectFrom('users')
      .select('id')
      .where('id', '=', userId)
      .executeTakeFirst();
    if (!user) {
      throw new BadRequest(`user with ${userId} does not exist`);
    }
  }
  if (sprintId) {
    const sprint = await db
      .selectFrom('sprints')
      .select('id')
      .where('id', '=', sprintId)
      .executeTakeFirst();
    if (!sprint) {
      throw new BadRequest(`sprint with ${sprintId} does not exist`);
    }
  }
  if (templateId) {
    const template = await db
      .selectFrom('templates')
      .select('id')
      .where('id', '=', templateId)
      .executeTakeFirst();
    if (!template) {
      throw new BadRequest(`template with ${templateId} does not exist`);
    }
  }
}
