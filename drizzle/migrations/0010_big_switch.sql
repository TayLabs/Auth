ALTER TABLE "totp_tokens" DROP CONSTRAINT "totp_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "totp_tokens" ADD CONSTRAINT "totp_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;