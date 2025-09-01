import {FastifyReply, FastifyRequest} from "fastify";
import  admin  from "firebase-admin";

// avisando que vou adicionar mais um modulo
declare module 'fastify'{
    interface FastifyRequest{
        userId?: string;
    }
}

export const authMiddleware = async (
    request: FastifyRequest,
    reply: FastifyReply
):Promise <void>=>{
const authHeadler = request.headers.authorization;

if (!authHeadler || !authHeadler.startsWith('Bearer ')) {
    reply.code(401).send({error:'token de auth nao fornecido'})
return
}
// troca o bearer por nada= fica token puro
const token = authHeadler.replace('Bearer ', '').trim();
try {
    const decodedToken = await admin.auth().verifyIdToken(token)

// modulo para adicionar
request.userId = decodedToken.uid
} catch (err) {
    request.log.error('error ao verificar token')
    reply.code(401).send({error:' token invalido ou expirado'})
}
}