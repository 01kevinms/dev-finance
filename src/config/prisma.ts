import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const prismaConnect = async()=>{
    
    try {
        await prisma.$connect();
        console.log("Prisma connected successfully");
    } catch (err) {
        console.error("Error connecting to Prisma:");
    }
};


export default prisma;