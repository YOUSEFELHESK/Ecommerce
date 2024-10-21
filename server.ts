// // import { PrismaClient } from "@prisma/client";
// // import { withOptimize } from "@prisma/extension-optimize";

// // const prisma = new PrismaClient().$extends(
// //   withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
// // );
// import { PrismaClient } from "@prisma/client";

// let db: PrismaClient;

// declare global {
//   var __db: PrismaClient | undefined;
// }

// if (!global.__db) {
//   global.__db = new PrismaClient({ log: ["query"] });
// }

// db = global.__db;

// export { db };
