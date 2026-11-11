import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

import { patients } from "./patients.js";
import { facilities } from "./facilities.js";
import { users } from "./users.js";

export const screenings = pgTable("screenings", {
    id: uuid("id").defaultRandom().primaryKey(),

    patientId: uuid("patient_id")
        .notNull()
        .references(() => patients.id),

    facilityId: uuid("facility_id")
        .notNull()
        .references(() => facilities.id),

    screenedBy: uuid("screened_by")
        .notNull()
        .references(() => users.id),

    screeningType: varchar("screening_type", { length: 100 }).notNull(),

    screenedAt: timestamp("screened_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),

    status: varchar("status", { length: 30 }).default("completed").notNull(),

    notes: text("notes"),

    createdAt: timestamp("created_at", {
        withTimezone: true,
    })
        .defaultNow()
        .notNull(),
});
