CREATE TYPE "public"."campaign_role" AS ENUM('PLAYER', 'MASTER', 'SUB_MASTER');--> statement-breakpoint
CREATE TYPE "public"."character_status" AS ENUM('ACTIVE', 'RESTING', 'RETIRED', 'DECEASED');--> statement-breakpoint
CREATE TYPE "public"."doc_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DELETED');--> statement-breakpoint
CREATE TYPE "public"."doc_visibility" AS ENUM('PUBLIC', 'PRIVATE');--> statement-breakpoint
CREATE TYPE "public"."session_role" AS ENUM('PLAYER', 'MASTER');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('PREPARING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'ON_HOLD');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ROLE_USER', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN');