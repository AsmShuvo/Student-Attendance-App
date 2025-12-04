import { pgTable, integer, varchar } from "drizzle-orm/pg-core";

export const GRADES = pgTable("grades", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  grade: varchar("grade", { length: 10 }).notNull(),
});
