import { pgTable, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

import { cases } from "./cases.js";
import { users } from "./users.js";

export const caseNotes = pgTable(
    "case_notes",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        caseId: uuid("case_id")
            .notNull()
            .references(() => cases.id),

        authorId: uuid("author_id")
            .notNull()
            .references(() => users.id),

        note: text("note").notNull(),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [index("case_notes_case_id_idx").on(table.caseId), index("case_notes_author_id_idx").on(table.authorId)],
);
