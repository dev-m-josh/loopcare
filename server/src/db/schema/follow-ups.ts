import { pgTable, uuid, varchar, text, timestamp, index, check } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { cases } from "./cases.js";
import { users } from "./users.js";

export const followUps = pgTable(
    "follow_ups",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        caseId: uuid("case_id")
            .notNull()
            .references(() => cases.id),

        assignedTo: uuid("assigned_to").references(() => users.id),

        followUpType: varchar("follow_up_type", {
            length: 50,
        }).notNull(),

        scheduledAt: timestamp("scheduled_at", {
            withTimezone: true,
        }),

        completedAt: timestamp("completed_at", {
            withTimezone: true,
        }),

        status: varchar("status", { length: 30 }).default("pending").notNull(),

        outcome: text("outcome"),

        notes: text("notes"),

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
    },
    (table) => [index("follow_ups_case_id_idx").on(table.caseId), index("follow_ups_status_idx").on(table.status),
        check(
            "follow_ups_completion_integrity",
            sql`(${table.status} <> 'completed' OR (${table.completedAt} IS NOT NULL AND ${table.outcome} IS NOT NULL))`
        ),

        check(
            "follow_ups_valid_dates",
            sql`${table.completedAt} IS NULL OR ${table.scheduledAt} IS NULL OR ${table.completedAt} >= ${table.scheduledAt}`
        ),
    ],
);
