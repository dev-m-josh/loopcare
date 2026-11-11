import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const facilities = pgTable("facilities", {
    id: uuid("id").defaultRandom().primaryKey(),

    name: varchar("name", { length: 150 }).notNull(),

    facilityType: varchar("facility_type", { length: 50 }),

    address: text("address"),

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
