import prisma from "../db.server";

export async function getSetting(key) {
    return prisma.setting.findUnique({ where: { key } });
}

export async function upsertSetting(key, value) {
    console.log(`=== UPSERT SETTING ===`);
    console.log(`Key: ${key}, Value: ${value}`);
    const result = await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
    });
    console.log(`Result:`, result);
    console.log(`=== END UPSERT SETTING ===`);
    return result;
} 