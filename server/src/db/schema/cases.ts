import { pgTable, uuid, varchar, text, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { screeningResults } from "./screening-results.js";

export const cases = pgTable(
    "cases",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        screeningResultId: uuid("screening_result_id")
            .notNull()
            .references(() => screeningResults.id),

        status: varchar("status", { length: 30 }).default("open").notNull(),

        priority: varchar("priority", { length: 30 }).default("medium").notNull(),

        nextAction: text("next_action"),

        nextActionDueAt: timestamp("next_action_due_at", {
            withTimezone: true,
        }),

        openedAt: timestamp("opened_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        closedAt: timestamp("closed_at", {
            withTimezone: true,
        }),

        closureReason: text("closure_reason"),

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
    (table) => [
        uniqueIndex("cases_screening_result_unique").on(table.screeningResultId),
        check("cases_closed_requires_timestamp", sql`(${table.status} <> 'closed' OR ${table.closedAt} IS NOT NULL)`),
        check("cases_closed_requires_reason", sql`(${table.status} <> 'closed' OR ${table.closureReason} IS NOT NULL)`),
    ],
);
