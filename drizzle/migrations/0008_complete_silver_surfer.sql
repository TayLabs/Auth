ALTER TABLE "roles" DROP CONSTRAINT "service_name_unique_constraint";--> statement-breakpoint
ALTER TABLE "roles" DROP CONSTRAINT "roles_service_id_services_id_fk";
--> statement-breakpoint
ALTER TABLE "roles" DROP COLUMN "service_id";--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_name_unique" UNIQUE("name");