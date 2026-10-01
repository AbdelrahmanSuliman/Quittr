ALTER TABLE "invitations" ADD COLUMN "token" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "partner_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "journal_entries" ALTER COLUMN "addiction_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_token_key" UNIQUE("token");