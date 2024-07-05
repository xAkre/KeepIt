ALTER TABLE "messages" ADD COLUMN "original_message_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN IF EXISTS "author_is_keep_it";