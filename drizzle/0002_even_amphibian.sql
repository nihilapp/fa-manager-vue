CREATE TYPE "public"."transaction_type" AS ENUM('REWARD', 'INCOME', 'EXPENSE', 'EXCHANGE', 'INIT');--> statement-breakpoint
CREATE TABLE "currency_transactions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "currency_transactions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"character_id" bigint NOT NULL,
	"transaction_type" "transaction_type" DEFAULT 'INIT' NOT NULL,
	"description" varchar(2000) NOT NULL,
	"delta_pp" integer DEFAULT 0 NOT NULL,
	"delta_gp" integer DEFAULT 0 NOT NULL,
	"delta_ep" integer DEFAULT 0 NOT NULL,
	"delta_sp" integer DEFAULT 0 NOT NULL,
	"delta_cp" integer DEFAULT 0 NOT NULL,
	"use_yn" char(1) DEFAULT 'Y',
	"delete_yn" char(1) DEFAULT 'N',
	"creator_id" bigint,
	"create_date" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updater_id" bigint,
	"update_date" timestamp (6) with time zone DEFAULT now(),
	"deleter_id" bigint,
	"delete_date" timestamp (6) with time zone
);
--> statement-breakpoint
ALTER TABLE "log_histories" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "discord_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "currency_transactions" ADD CONSTRAINT "currency_transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "currency_transactions" ADD CONSTRAINT "currency_transactions_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_session_players_session_user" ON "session_players" USING btree ("session_id","user_id");--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "start_currency_cp";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "start_currency_sp";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "start_currency_ep";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "start_currency_gp";--> statement-breakpoint
ALTER TABLE "characters" DROP COLUMN "start_currency_pp";