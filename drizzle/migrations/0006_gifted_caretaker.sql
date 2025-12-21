ALTER TABLE "permissions" DROP CONSTRAINT "service_resource_action_unique_constraint";--> statement-breakpoint
ALTER TABLE "services" ALTER COLUMN "name" SET DATA TYPE varchar(128);--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "is_external" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "service_key_unique_constraint" UNIQUE("service_id","key");