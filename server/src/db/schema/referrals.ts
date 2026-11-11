import { pgTable, uuid, varchar, text, timestamp, index, check } from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";
import { cases } from "./cases.js";
import { facilities } from "./facilities.js";
import { users } from "./users.js";

export const referrals = pgTable(
    "referrals",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        caseId: uuid("case_id")
            .notNull()
            .references(() => cases.id),

        fromFacilityId: uuid("from_facility_id")
            .notNull()
            .references(() => facilities.id),

        toFacilityId: uuid("to_facility_id").references(() => facilities.id),

        referredBy: uuid("referred_by")
            .notNull()
            .references(() => users.id),

        reason: text("reason").notNull(),

        status: varchar("status", { length: 30 }).default("pending").notNull(),

        referredAt: timestamp("referred_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        acknowledgedAt: timestamp("acknowledged_at", {
            withTimezone: true,
        }),

        completedAt: timestamp("completed_at", {
            withTimezone: true,
        }),

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
    (table) => [
        index("referrals_case_id_idx").on(table.caseId),
        index("referrals_status_idx").on(table.status),
        check(
            "referrals_acknowledgement_integrity",
            sql`(${table.acknowledgedAt} IS NULL OR ${table.acknowledgedAt} >= ${table.referredAt})`,
        ),

        check(
            "referrals_completion_integrity",
            sql`(${table.status} <> 'completed' OR (${table.completedAt} IS NOT NULL AND ${table.outcome} IS NOT NULL))`,
        ),

        check(
            "referrals_valid_completion_date",
            sql`${table.completedAt} IS NULL OR ${table.completedAt} >= ${table.referredAt}`,
        ),
    ],
);
