CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"previous_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(45),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "case_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"notes" text,
	CONSTRAINT "case_assignments_valid_dates" CHECK ("case_assignments"."ended_at" IS NULL OR "case_assignments"."ended_at" >= "case_assignments"."assigned_at")
);
--> statement-breakpoint
CREATE TABLE "case_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"screening_result_id" uuid NOT NULL,
	"status" varchar(30) DEFAULT 'open' NOT NULL,
	"priority" varchar(30) DEFAULT 'medium' NOT NULL,
	"next_action" text,
	"next_action_due_at" timestamp with time zone,
	"opened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"closed_at" timestamp with time zone,
	"closure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "cases_closed_requires_timestamp" CHECK (("cases"."status" <> 'closed' OR "cases"."closed_at" IS NOT NULL)),
	CONSTRAINT "cases_closed_requires_reason" CHECK (("cases"."status" <> 'closed' OR "cases"."closure_reason" IS NOT NULL))
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"facility_type" varchar(50),
	"address" text,
	"phone" varchar(20),
	"email" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "follow_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"assigned_to" uuid,
	"follow_up_type" varchar(50) NOT NULL,
	"scheduled_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"outcome" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "follow_ups_completion_integrity" CHECK (("follow_ups"."status" <> 'completed' OR ("follow_ups"."completed_at" IS NOT NULL AND "follow_ups"."outcome" IS NOT NULL))),
	CONSTRAINT "follow_ups_valid_dates" CHECK ("follow_ups"."completed_at" IS NULL OR "follow_ups"."scheduled_at" IS NULL OR "follow_ups"."completed_at" >= "follow_ups"."scheduled_at")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"facility_id" uuid NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "patient_facilities" (
	"patient_id" uuid NOT NULL,
	"facility_id" uuid NOT NULL,
	"registered_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" varchar(30) DEFAULT 'active' NOT NULL,
	CONSTRAINT "patient_facilities_patient_id_facility_id_pk" PRIMARY KEY("patient_id","facility_id")
);
--> statement-breakpoint
CREATE TABLE "screenings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid NOT NULL,
	"facility_id" uuid NOT NULL,
	"screened_by" uuid NOT NULL,
	"screening_type" varchar(100) NOT NULL,
	"screened_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" varchar(30) DEFAULT 'completed' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "screening_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"screening_id" uuid NOT NULL,
	"result_name" varchar(150) NOT NULL,
	"result_value" text,
	"unit" varchar(50),
	"interpretation" text,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"is_actionable" boolean DEFAULT false NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "screening_results_review_integrity" CHECK ((
            ("screening_results"."reviewed_by" IS NULL AND "screening_results"."reviewed_at" IS NULL)
            OR
            ("screening_results"."reviewed_by" IS NOT NULL AND "screening_results"."reviewed_at" IS NOT NULL)
        ))
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"case_id" uuid NOT NULL,
	"from_facility_id" uuid NOT NULL,
	"to_facility_id" uuid,
	"referred_by" uuid NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"referred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"outcome" text,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "referrals_acknowledgement_integrity" CHECK (("referrals"."acknowledged_at" IS NULL OR "referrals"."acknowledged_at" >= "referrals"."referred_at")),
	CONSTRAINT "referrals_completion_integrity" CHECK (("referrals"."status" <> 'completed' OR ("referrals"."completed_at" IS NOT NULL AND "referrals"."outcome" IS NOT NULL))),
	CONSTRAINT "referrals_valid_completion_date" CHECK ("referrals"."completed_at" IS NULL OR "referrals"."completed_at" >= "referrals"."referred_at")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"patient_id" uuid,
	"user_id" uuid,
	"case_id" uuid,
	"channel" varchar(30) NOT NULL,
	"recipient" varchar(255) NOT NULL,
	"subject" varchar(255),
	"message" text NOT NULL,
	"status" varchar(30) DEFAULT 'pending' NOT NULL,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notifications_delivery_integrity" CHECK (("notifications"."delivered_at" IS NULL OR "notifications"."sent_at" IS NOT NULL)),
	CONSTRAINT "notifications_valid_delivery_date" CHECK ("notifications"."delivered_at" IS NULL OR "notifications"."delivered_at" >= "notifications"."sent_at")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"date_of_birth" date,
	"phone" varchar(20),
	"email" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_notes" ADD CONSTRAINT "case_notes_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "case_notes" ADD CONSTRAINT "case_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cases" ADD CONSTRAINT "cases_screening_result_id_screening_results_id_fk" FOREIGN KEY ("screening_result_id") REFERENCES "public"."screening_results"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_facilities" ADD CONSTRAINT "patient_facilities_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "patient_facilities" ADD CONSTRAINT "patient_facilities_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screenings" ADD CONSTRAINT "screenings_screened_by_users_id_fk" FOREIGN KEY ("screened_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_results" ADD CONSTRAINT "screening_results_screening_id_screenings_id_fk" FOREIGN KEY ("screening_id") REFERENCES "public"."screenings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "screening_results" ADD CONSTRAINT "screening_results_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_from_facility_id_facilities_id_fk" FOREIGN KEY ("from_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_to_facility_id_facilities_id_fk" FOREIGN KEY ("to_facility_id") REFERENCES "public"."facilities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_by_users_id_fk" FOREIGN KEY ("referred_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_case_id_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."cases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "case_assignments_case_id_idx" ON "case_assignments" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "case_assignments_user_id_idx" ON "case_assignments" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "case_assignments_one_active_per_case" ON "case_assignments" USING btree ("case_id") WHERE "case_assignments"."ended_at" is null;--> statement-breakpoint
CREATE INDEX "case_notes_case_id_idx" ON "case_notes" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "case_notes_author_id_idx" ON "case_notes" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cases_screening_result_unique" ON "cases" USING btree ("screening_result_id");--> statement-breakpoint
CREATE INDEX "follow_ups_case_id_idx" ON "follow_ups" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "follow_ups_status_idx" ON "follow_ups" USING btree ("status");--> statement-breakpoint
CREATE INDEX "referrals_case_id_idx" ON "referrals" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "referrals_status_idx" ON "referrals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notifications_case_id_idx" ON "notifications" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "notifications_status_idx" ON "notifications" USING btree ("status");