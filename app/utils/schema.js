import { pgTable, integer, varchar, boolean, date } from "drizzle-orm/pg-core";

export const GRADES = pgTable("grades", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  grade: varchar("grade", { length: 5 }).notNull(),
});

export const STUDENTS = pgTable("students", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  name: varchar("name", { length: 32 }).notNull(),
  grade: varchar("grade", { length: 5 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 15 }).notNull(),
});

export const ATTENDANCE = pgTable("attendance", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  studentId: integer("studentId").notNull(),
  present: boolean("present").default(false),
  day: integer("day").notNull(),
  date: date("date").notNull(),
});
