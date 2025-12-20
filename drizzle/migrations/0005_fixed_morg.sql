ALTER TABLE "permissions" DROP CONSTRAINT "service_resource_action_unique_constraint";--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "key" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN "resource";--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN "action";--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "service_resource_action_unique_constraint" UNIQUE("service_id","key");