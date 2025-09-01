

import fastify from "../node_modules/fastify/fastify";
import type { FastifyInstance } from "../node_modules/fastify/fastify";
import { env } from "./config/env";
import routes from "./routes/index";
import cors from '@fastify/cors'

const app: FastifyInstance = fastify({
    logger:{
        level: env.NODE_ENV==='prod' ? 'info' : 'error',
    },
});

app.register(cors,{
    origin:true,
    methods:['GET','POST','PUT', 'DELETE','PATCH', 'OPTIONS']
})
app.register(routes,{prefix: "/api"});

export default app;