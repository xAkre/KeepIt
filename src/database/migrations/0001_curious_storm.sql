ALTER TABLE "messages" RENAME COLUMN "id" TO "message_id";--> statement-breakpoint
ALTER TABLE "messages" RENAME COLUMN "author" TO "author_id";--> statement-breakpoint
ALTER TABLE "message_attachments" DROP CONSTRAINT "message_attachments_user_id_messages_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "message_id" SET DATA TYPE integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "message_attachments" ADD CONSTRAINT "message_attachments_user_id_messages_message_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."messages"("message_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
