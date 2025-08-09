-- Add sticky bar status setting
INSERT INTO "Setting" ("id", "key", "value") 
VALUES (gen_random_uuid(), 'sticky_bar_status', 'live')
ON CONFLICT ("key") DO UPDATE SET "value" = 'live';
