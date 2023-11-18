import { writeFile, readFile } from 'fs/promises';

async function createMigrationFile(fileName: string) {
  if (!fileName) {
    /* eslint-disable no-console */
    console.error('Please provide a file name');
    process.exit(1);
  }

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');
  const filename = `${timestamp}-${fileName}.ts`;
  const template = await readFile(
    'src/database/migrationTemplate.txt',
    'utf-8'
  );

  try {
    await writeFile(`src/database/migrations/${filename}`, template);
    console.log(`Successfully created migration file: ${filename}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const [fileName] = process.argv.slice(2);
createMigrationFile(fileName);
