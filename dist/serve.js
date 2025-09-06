"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const firebase_1 = __importDefault(require("./config/firebase"));
const prisma_1 = require("./config/prisma");
const globalCategories_services_1 = require("./services/globalCategories.services");
const PORT = env_1.env.PORT;
(0, firebase_1.default)();
const startServe = async () => {
    try {
        await (0, prisma_1.prismaConnect)();
        await (0, globalCategories_services_1.initializeGlobalCategories)();
        await app_1.default.listen({ port: PORT }).then(() => {
            console.log(`Server is running on ${PORT}`);
        });
    }
    catch (err) {
        console.error(err);
    }
};
startServe();
