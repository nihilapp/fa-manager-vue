CREATE TABLE "campaign_members" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "campaign_members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"campaign_id" bigint NOT NULL,
	"role" "campaign_role" DEFAULT 'PLAYER' NOT NULL,
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
CREATE TABLE "campaigns" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "campaigns_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(1000),
	"status" "status" DEFAULT 'PREPARING' NOT NULL,
	"start_date" timestamp (6) with time zone NOT NULL,
	"end_date" timestamp (6) with time zone,
	"use_yn" char(1) DEFAULT 'Y',
	"delete_yn" char(1) DEFAULT 'N',
	"creator_id" bigint,
	"create_date" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updater_id" bigint,
	"update_date" timestamp (6) with time zone DEFAULT now(),
	"deleter_id" bigint,
	"delete_date" timestamp (6) with time zone,
	CONSTRAINT "campaigns_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "character_classes" (
	"character_id" bigint NOT NULL,
	"class_name" varchar(50) NOT NULL,
	"level" integer NOT NULL,
	CONSTRAINT "character_classes_character_id_class_name_pk" PRIMARY KEY("character_id","class_name")
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "characters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"campaign_id" bigint,
	"name" varchar(50) NOT NULL,
	"status" character_status DEFAULT 'ACTIVE' NOT NULL,
	"race" varchar(30) NOT NULL,
	"start_level" integer DEFAULT 0 NOT NULL,
	"start_exp" integer DEFAULT 0 NOT NULL,
	"str" integer,
	"dex" integer,
	"con" integer,
	"int" integer,
	"wis" integer,
	"cha" integer,
	"ac" integer,
	"hp" integer,
	"speed" text,
	"vision" text,
	"skills" text,
	"advantage" text,
	"disadvantage" text,
	"resistance" text,
	"immunity" text,
	"start_currency_cp" integer,
	"start_currency_sp" integer,
	"start_currency_ep" integer,
	"start_currency_gp" integer,
	"start_currency_pp" integer,
	"main_hand" varchar(100),
	"off_hand" varchar(100),
	"armor" varchar(100),
	"head" varchar(100),
	"gauntlet" varchar(100),
	"boots" varchar(100),
	"belt" varchar(100),
	"cloak" varchar(100),
	"accessory1" varchar(100),
	"accessory2" varchar(100),
	"accessory3" varchar(100),
	"accessory4" varchar(100),
	"req_str_dex8" varchar(100),
	"req_str_dex10" varchar(100),
	"req_str_dex12" varchar(100),
	"req_str_dex14" varchar(100),
	"req_str16" varchar(100),
	"req_str18" varchar(100),
	"req_str20" varchar(100),
	"req_con8" varchar(100),
	"req_con10" varchar(100),
	"req_con12" varchar(100),
	"req_con14" varchar(100),
	"req_con16" varchar(100),
	"req_con18" varchar(100),
	"req_con20" varchar(100),
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
CREATE TABLE "docs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "docs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" varchar(500),
	"category" varchar(50) NOT NULL,
	"status" "doc_status" DEFAULT 'DRAFT' NOT NULL,
	"visibility" "doc_visibility" DEFAULT 'PUBLIC' NOT NULL,
	"content" text,
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
CREATE TABLE "log_histories" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "log_histories_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint,
	"table_name" varchar(50) NOT NULL,
	"target_id" bigint NOT NULL,
	"action_type" varchar(20) NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"description" varchar(1000),
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
CREATE TABLE "session_logs" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "session_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"session_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text,
	"file_url" varchar(255),
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
CREATE TABLE "session_players" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "session_players_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"session_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"character_id" bigint NOT NULL,
	"role" "session_role" DEFAULT 'PLAYER' NOT NULL,
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
CREATE TABLE "sessions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"campaign_id" bigint NOT NULL,
	"no" integer NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" varchar(2000),
	"max_player" integer,
	"reward_exp" integer,
	"reward_gold" integer,
	"status" "status" DEFAULT 'PREPARING',
	"play_date" timestamp (6) with time zone,
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
CREATE TABLE "users" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"discord_id" varchar(100),
	"name" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"role" "user_role" DEFAULT 'ROLE_USER' NOT NULL,
	"use_yn" char(1) DEFAULT 'Y',
	"delete_yn" char(1) DEFAULT 'N',
	"creator_id" bigint,
	"create_date" timestamp (6) with time zone DEFAULT now() NOT NULL,
	"updater_id" bigint,
	"update_date" timestamp (6) with time zone DEFAULT now(),
	"deleter_id" bigint,
	"delete_date" timestamp (6) with time zone,
	CONSTRAINT "users_discord_id_unique" UNIQUE("discord_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_members" ADD CONSTRAINT "campaign_members_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_classes" ADD CONSTRAINT "character_classes_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "docs" ADD CONSTRAINT "docs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "log_histories" ADD CONSTRAINT "log_histories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_logs" ADD CONSTRAINT "session_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_players" ADD CONSTRAINT "session_players_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_campaign_members_user_campaign" ON "campaign_members" USING btree ("user_id","campaign_id");--> statement-breakpoint
CREATE INDEX "idx_campaigns_status" ON "campaigns" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_characters_name" ON "characters" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_characters_user_id" ON "characters" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_characters_status" ON "characters" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_docs_title" ON "docs" USING btree ("title");--> statement-breakpoint
CREATE INDEX "idx_docs_category" ON "docs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_sessions_no" ON "sessions" USING btree ("no");--> statement-breakpoint
CREATE INDEX "idx_sessions_name" ON "sessions" USING btree ("name");--> statement-breakpoint
CREATE INDEX "idx_users_name" ON "users" USING btree ("name");