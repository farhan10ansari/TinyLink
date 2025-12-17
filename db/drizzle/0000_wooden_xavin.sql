CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"short_code" varchar(8) NOT NULL,
	"long_url" text NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"last_clicked" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_code_unique" UNIQUE("short_code")
);
