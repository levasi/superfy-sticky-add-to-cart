import prisma from "../db.server.js";

export async function getSetting(key) {
    return prisma.setting.findUnique({ where: { key } });
}

export async function upsertSetting(key, value) {
    const result = await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });
    return result;
} 