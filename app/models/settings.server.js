import prisma from "../db.server";

export async function getSetting(key) {
    return prisma.setting.findUnique({ where: { key } });
}

export async function upsertSetting(key, value) {
    return prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });
} 