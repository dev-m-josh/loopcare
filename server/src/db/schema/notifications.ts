import { pgTable, uuid, varchar, text, timestamp, index, check } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { users } from "./users.js";
import { patients } from "./patients.js";
import { cases } from "./cases.js";

export const notifications = pgTable(
    "notifications",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        patientId: uuid("patient_id").references(() => patients.id),

        userId: uuid("user_id").references(() => users.id),

        caseId: uuid("case_id")
            .notNull()
            .references(() => cases.id),

        channel: varchar("channel", { length: 30 }).notNull(),

        recipient: varchar("recipient", { length: 255 }).notNull(),

        subject: varchar("subject", { length: 255 }),

        message: text("message").notNull(),

        status: varchar("status", { length: 30 }).default("pending").notNull(),

        sentAt: timestamp("sent_at", {
            withTimezone: true,
        }),

        deliveredAt: timestamp("delivered_at", {
            withTimezone: true,
        }),

        failureReason: text("failure_reason"),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("notifications_case_id_idx").on(table.caseId),
        index("notifications_status_idx").on(table.status),
        check("notifications_delivery_integrity", sql`(${table.deliveredAt} IS NULL OR ${table.sentAt} IS NOT NULL)`),

        check(
            "notifications_valid_delivery_date",
            sql`${table.deliveredAt} IS NULL OR ${table.deliveredAt} >= ${table.sentAt}`,
        ),
    ],
);
