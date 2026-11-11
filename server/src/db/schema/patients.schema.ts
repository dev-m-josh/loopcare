import { pgTable, uuid, varchar, date, timestamp } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
    id: uuid("id").defaultRandom().primaryKey(),

    firstName: varchar("first_name", { length: 100 }).notNull(),

    lastName: varchar("last_name", { length: 100 }).notNull(),

    dateOfBirth: date("date_of_birth"),

    phone: varchar("phone", { length: 20 }),

    email: varchar("email", { length: 255 }),

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
