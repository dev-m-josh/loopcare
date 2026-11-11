import { pgTable, uuid, varchar, timestamp, primaryKey } from "drizzle-orm/pg-core";

import { patients } from "./patients.js";
import { facilities } from "./facilities.js";

export const patientFacilities = pgTable(
    "patient_facilities",
    {
        patientId: uuid("patient_id")
            .notNull()
            .references(() => patients.id),

        facilityId: uuid("facility_id")
            .notNull()
            .references(() => facilities.id),

        registeredAt: timestamp("registered_at", {
            withTimezone: true,
        })
            .defaultNow()
            .notNull(),

        status: varchar("status", { length: 30 }).default("active").notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.patientId, table.facilityId],
        }),
    ],
);
