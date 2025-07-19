UPDATE "_prisma_migrations" 
SET finished_at = NOW(), 
    applied_steps_count = 1,
    logs = NULL
WHERE migration_name = '20250718152531_init'; 