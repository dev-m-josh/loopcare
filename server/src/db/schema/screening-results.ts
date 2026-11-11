import { pgTable, uuid, varchar, text, boolean, timestamp, check } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { screenings } from "./screenings.js";
import { users } from "./users.js";

export const screeningResults = pgTable(
    "screening_results",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        screeningId: uuid("screening_id")
            .notNull()
            .references(() => screenings.id),

        resultName: varchar("result_name", { length: 150 }).notNull(),

        resultValue: text("result_value"),

        unit: varchar("unit", { length: 50 }),

        interpretation: text("interpretation"),

        status: varchar("status", { length: 30 }).default("pending").notNull(),

        isActionable: boolean("is_actionable").default(false).notNull(),

        reviewedBy: uuid("reviewed_by").references(() => users.id),

        reviewedAt: timestamp("reviewed_at", {
            withTimezone: true,
        }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        check(
            "screening_results_review_integrity",
            sql`(
            (${table.reviewedBy} IS NULL AND ${table.reviewedAt} IS NULL)
            OR
            (${table.reviewedBy} IS NOT NULL AND ${table.reviewedAt} IS NOT NULL)
        )`,
        ),
    ],
);
