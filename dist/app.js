"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("../node_modules/fastify/fastify"));
const env_1 = require("./config/env");
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)({
    logger: {
        level: env_1.env.NODE_ENV === 'prod' ? 'info' : 'error',
    },
});
app.register(cors_1.default, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
});
app.register(index_1.default, { prefix: "/api" });
exports.default = app;
