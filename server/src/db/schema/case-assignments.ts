import { pgTable, uuid, text, timestamp, index, uniqueIndex, check } from "drizzle-orm/pg-core";

import { isNull, sql } from "drizzle-orm";
import { cases } from "./cases.js";
import { users } from "./users.js";

export const caseAssignments = pgTable(
    "case_assignments",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        caseId: uuid("case_id")
            .notNull()
            .references(() => cases.id),

        userId: uuid("user_id")
            .notNull()
            .references(() => users.id),

        assignedBy: uuid("assigned_by")
            .notNull()
            .references(() => users.id),

        assignedAt: timestamp("assigned_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        endedAt: timestamp("ended_at", {
            withTimezone: true,
        }),

        notes: text("notes"),
    },
    (table) => [
        index("case_assignments_case_id_idx").on(table.caseId),
        index("case_assignments_user_id_idx").on(table.userId),
        uniqueIndex("case_assignments_one_active_per_case").on(table.caseId).where(isNull(table.endedAt)),
        check("case_assignments_valid_dates", sql`${table.endedAt} IS NULL OR ${table.endedAt} >= ${table.assignedAt}`),
    ],
);
