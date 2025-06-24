const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

/**
 * Database backup script for safety before migration
 */

async function createDatabaseBackup() {
  console.log("🛡️  Creating database backup before migration...");

  try {
    // Get database config from environment variables (since config is TypeScript)
    const dbConfig = {
      connection: {
        client: process.env.DATABASE_CLIENT || "postgres",
        connection: {
          host: process.env.DATABASE_HOST || "localhost",
          port: parseInt(process.env.DATABASE_PORT) || 5432,
          database: process.env.DATABASE_NAME || "strapidb",
          user: process.env.DATABASE_USERNAME || "strapiuser",
          password: process.env.DATABASE_PASSWORD || "taki1234",
          ssl: process.env.DATABASE_SSL === "true",
        },
      },
    };

    const connection = dbConfig.connection;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupDir = path.join(process.cwd(), "backups");

    // Create backups directory
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
      console.log("📁 Created backups directory");
    }

    const backupFile = path.join(backupDir, `database-backup-${timestamp}.sql`);

    // PostgreSQL backup command
    if (connection.client === "postgres" || connection.client === "pg") {
      const { host, port, database, user, password } = connection.connection;

      console.log(`📊 Backing up PostgreSQL database: ${database}`);

      // Set PGPASSWORD environment variable for pg_dump
      const env = { ...process.env, PGPASSWORD: password };

      const pgDumpCommand = `pg_dump -h ${host} -p ${port || 5432} -U ${user} -d ${database} -f "${backupFile}" --verbose`;

      return new Promise((resolve, reject) => {
        exec(pgDumpCommand, { env }, (error, stdout, stderr) => {
          if (error) {
            console.error("❌ Backup failed:", error.message);
            reject(error);
            return;
          }

          console.log("✅ Database backup completed successfully!");
          console.log(`📂 Backup saved to: ${backupFile}`);

          // Check file size to ensure backup worked
          const stats = fs.statSync(backupFile);
          console.log(
            `📏 Backup size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`
          );

          if (stats.size < 1000) {
            console.warn(
              "⚠️  Warning: Backup file is very small, please verify it contains data"
            );
          }

          resolve(backupFile);
        });
      });
    }
    // SQLite backup
    else if (connection.client === "sqlite3") {
      const dbFile = connection.connection.filename;
      const backupSqliteFile = path.join(
        backupDir,
        `database-backup-${timestamp}.sqlite`
      );

      console.log(`📊 Backing up SQLite database: ${dbFile}`);

      fs.copyFileSync(dbFile, backupSqliteFile);
      console.log("✅ SQLite backup completed successfully!");
      console.log(`📂 Backup saved to: ${backupSqliteFile}`);

      return backupSqliteFile;
    } else {
      throw new Error(`Unsupported database client: ${connection.client}`);
    }
  } catch (error) {
    console.error("💥 Backup creation failed:", error);
    throw error;
  }
}

async function restoreDatabase(backupFile) {
  console.log(`🔄 Restoring database from: ${backupFile}`);

  try {
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    // Get database config from environment variables (since config is TypeScript)
    const dbConfig = {
      connection: {
        client: process.env.DATABASE_CLIENT || "postgres",
        connection: {
          host: process.env.DATABASE_HOST || "localhost",
          port: parseInt(process.env.DATABASE_PORT) || 5432,
          database: process.env.DATABASE_NAME || "strapidb",
          user: process.env.DATABASE_USERNAME || "strapiuser",
          password: process.env.DATABASE_PASSWORD || "taki1234",
          ssl: process.env.DATABASE_SSL === "true",
        },
      },
    };

    const connection = dbConfig.connection;

    if (connection.client === "postgres" || connection.client === "pg") {
      const { host, port, database, user, password } = connection.connection;

      console.log(`📊 Restoring PostgreSQL database: ${database}`);

      const env = { ...process.env, PGPASSWORD: password };
      const psqlCommand = `psql -h ${host} -p ${port || 5432} -U ${user} -d ${database} -f "${backupFile}"`;

      return new Promise((resolve, reject) => {
        exec(psqlCommand, { env }, (error, stdout, stderr) => {
          if (error) {
            console.error("❌ Restore failed:", error.message);
            reject(error);
            return;
          }

          console.log("✅ Database restore completed successfully!");
          resolve(true);
        });
      });
    } else if (connection.client === "sqlite3") {
      const dbFile = connection.connection.filename;

      console.log(`📊 Restoring SQLite database: ${dbFile}`);

      // Backup current file first
      const currentBackup = `${dbFile}.pre-restore-${Date.now()}`;
      fs.copyFileSync(dbFile, currentBackup);

      // Restore from backup
      fs.copyFileSync(backupFile, dbFile);

      console.log("✅ SQLite restore completed successfully!");
      console.log(`📂 Previous database backed up to: ${currentBackup}`);

      return true;
    }
  } catch (error) {
    console.error("💥 Database restore failed:", error);
    throw error;
  }
}

// Command line usage
if (require.main === module) {
  const action = process.argv[2];
  const backupFile = process.argv[3];

  if (action === "backup") {
    createDatabaseBackup()
      .then((file) => {
        console.log(`\n🎉 Backup completed: ${file}`);
        process.exit(0);
      })
      .catch((error) => {
        console.error("Backup failed:", error);
        process.exit(1);
      });
  } else if (action === "restore" && backupFile) {
    restoreDatabase(backupFile)
      .then(() => {
        console.log("\n🎉 Restore completed");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Restore failed:", error);
        process.exit(1);
      });
  } else {
    console.log("Usage:");
    console.log("  node scripts/backup-database.js backup");
    console.log("  node scripts/backup-database.js restore <backup-file>");
  }
}

module.exports = {
  createDatabaseBackup,
  restoreDatabase,
};
