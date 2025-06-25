import { PrismaClient } from "@prisma/client";

if (!globalThis.prisma) {
  globalThis.prisma = new PrismaClient();
}
const prisma = globalThis.prisma;

export default prisma;
