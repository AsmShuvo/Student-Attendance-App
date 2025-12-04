import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./app/utils/schema.js",       
  out: "./drizzle",            
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,  
  },
});
