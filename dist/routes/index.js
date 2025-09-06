"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_routes_1 = __importDefault(require("./category.routes"));
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
async function routes(fastify) {
    fastify.get("/health", async () => {
        return {
            status: "ok",
            message: "Server is healthy"
        };
    });
    fastify.register(category_routes_1.default, { prefix: "/categories" });
    fastify.register(transaction_routes_1.default, { prefix: "/transactions" });
}
exports.default = routes;
