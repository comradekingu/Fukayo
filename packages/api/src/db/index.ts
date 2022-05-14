import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * In memory database which can be saved to disk
 */
export class Database<T> {
  data: T;
  private file:string;
  constructor(filePath: string, defaultData: T) {
    // check if path exists
    const path = dirname(resolve(filePath));
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    // check if file exists
    const pathToFile = resolve(filePath);
    if (!existsSync(pathToFile)) {
      writeFileSync(pathToFile, JSON.stringify(defaultData));
      this.data = defaultData;
    } else {
      this.data = JSON.parse(readFileSync(pathToFile, 'utf8'));
    }
    this.file = pathToFile;

  }

  read() {
    this.data = JSON.parse(readFileSync(this.file, 'utf8'));
  }
  write() {
    writeFileSync(this.file, JSON.stringify(this.data));
  }
}

/**
 * File system only database
 */
export class DatabaseIO<T> {
  private file:string;
  constructor(filePath: string, defaultData: T) {
    // check if path exists
    const path = dirname(resolve(filePath));
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    // check if file exists
    const pathToFile = resolve(filePath);
    if (!existsSync(pathToFile)) {
      writeFileSync(pathToFile, JSON.stringify({ data: defaultData}));

    }
    this.file = pathToFile;
  }
  read():T {
    return JSON.parse(readFileSync(this.file, 'utf8'));
  }
  write(data: T) {
    writeFileSync(this.file, JSON.stringify({ data }));
  }
}
