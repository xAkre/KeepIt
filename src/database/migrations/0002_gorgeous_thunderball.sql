ALTER TABLE "message_attachments" ALTER COLUMN "user_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "message_attachments" ALTER COLUMN "attachment_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "message_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "server_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "channel_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "author_id" SET DATA TYPE bigint;