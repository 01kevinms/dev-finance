"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_controller_1 = require("../controllers/category.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const categoryRoutes = async (fastify) => {
    fastify.addHook('preHandler', auth_middleware_1.authMiddleware);
    fastify.get("/", category_controller_1.getCategories);
};
exports.default = categoryRoutes;
