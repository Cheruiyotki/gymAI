import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg; // Extract the database connection pool manager
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// 1. Explicitly execute config to parse your .env file details onto process.env
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing from your environment setup.");
}

// 2. Instantiate a real PostgreSQL connection pool manager
const pool = new Pool({ connectionString });

// 3. Bind the modern web-assembly driver adapter to the active pool
const adapter = new PrismaPg(pool);

// 4. Initialize your custom client instance
export const prisma = new PrismaClient({ adapter });