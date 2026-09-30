


const { DatabaseSync } = require('node:sqlite')
const { runtimeDatabasePath } = require('./runtime')

const database = new DatabaseSync(process.env.DATABASE_PATH || runtimeDatabasePath)

// Keep the small async interface used by the existing Express routes while
// relying on Node's built-in SQLite driver (no native package build required).
const dbPromise = Promise.resolve({
  get(sql, ...params) {
    return database.prepare(sql).get(...params)
  },
  all(sql, ...params) {
    return database.prepare(sql).all(...params)
  },
  run(sql, ...params) {
    return database.prepare(sql).run(...params)
  },
})

module.exports = dbPromise
