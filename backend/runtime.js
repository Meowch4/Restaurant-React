const fs = require('fs')
const path = require('path')

const runtimePath = path.join(__dirname, 'runtime')
const runtimeDatabasePath = path.join(runtimePath, 'restaurant.sqlite3')
const runtimeUploadPath = path.join(runtimePath, 'upload')
const seedDatabasePath = path.join(__dirname, 'db', 'restaurant.sqlite3')
const seedUploadPath = path.join(__dirname, 'upload')

function prepareDemoRuntime() {
  fs.rmSync(runtimeUploadPath, { recursive: true, force: true })
  fs.mkdirSync(runtimeUploadPath, { recursive: true })

  // Every process starts from the committed demo database. Visitors may freely
  // change data during a session, and a restart restores the showcase.
  if (!process.env.DATABASE_PATH) {
    fs.copyFileSync(seedDatabasePath, runtimeDatabasePath)
  }
}

module.exports = {
  prepareDemoRuntime,
  runtimeDatabasePath,
  runtimeUploadPath,
  seedUploadPath,
}
