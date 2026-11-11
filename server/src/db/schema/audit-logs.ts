import { pgTable, uuid, varchar, text, jsonb, timestamp, index } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const auditLogs = pgTable(
    "audit_logs",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        userId: uuid("user_id").references(() => users.id),

        action: varchar("action", { length: 100 }).notNull(),

        entityType: varchar("entity_type", { length: 100 }).notNull(),

        entityId: uuid("entity_id").notNull(),

        previousValues: jsonb("previous_values"),

        newValues: jsonb("new_values"),

        ipAddress: varchar("ip_address", { length: 45 }),

        createdAt: timestamp("created_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),
    },
    (table) => [
        index("audit_logs_user_id_idx").on(table.userId),
        index("audit_logs_entity_idx").on(table.entityType, table.entityId),
        index("audit_logs_created_at_idx").on(table.createdAt),
    ],
);
