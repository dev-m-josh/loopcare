import { pgTable, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

import { facilities } from "./facilities.js";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),

    facilityId: uuid("facility_id")
        .references(() => facilities.id)
        .notNull(),

    firstName: varchar("first_name", { length: 100 }).notNull(),

    lastName: varchar("last_name", { length: 100 }).notNull(),

    email: varchar("email", { length: 255 }).notNull().unique(),

    passwordHash: varchar("password_hash", { length: 255 }).notNull(),

    role: varchar("role", { length: 50 }).notNull(),

    isActive: boolean("is_active").default(true).notNull(),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),
});
