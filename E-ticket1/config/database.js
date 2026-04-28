import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Load environment variables
dotenv.config();

// Database configuration object
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || "e_ticketing_db",
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "santech2019",
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true, // Enable soft deletes
    freezeTableName: true,
  },
};

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    pool: dbConfig.pool,
    define: dbConfig.define,
  },
);

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✓ Database connection established successfully.");
    return true;
  } catch (error) {
    console.error("✗ Unable to connect to the database:", error.message);
    return false;
  }
};

// Close database connection
export const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log("✓ Database connection closed successfully.");
    return true;
  } catch (error) {
    console.error("✗ Error closing database connection:", error.message);
    return false;
  }
};

export { sequelize, dbConfig };
export default sequelize;
