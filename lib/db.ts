// Use the generated Prisma client (custom generator output) instead of the package entrypoint.
// The schema's generator outputs to `generated/prisma`, so import that client directly.
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
    // Provide the Postgres adapter so PrismaClient can connect to a Postgres DB.
    // The adapter accepts a `pg.PoolConfig` or `pg.Pool` instance. We pass a simple
    // config using the DATABASE_URL environment variable.
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

    return new PrismaClient({
        adapter,
        transactionOptions: {
            maxWait: 15000,
            timeout: 60000,
        },
    });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;