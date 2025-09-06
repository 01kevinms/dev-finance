"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const authMiddleware = async (request, reply) => {
    const authHeadler = request.headers.authorization;
    if (!authHeadler || !authHeadler.startsWith('Bearer ')) {
        reply.code(401).send({ error: 'token de auth nao fornecido' });
        return;
    }
    // troca o bearer por nada= fica token puro
    const token = authHeadler.replace('Bearer ', '').trim();
    try {
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        // modulo para adicionar
        request.userId = decodedToken.uid;
    }
    catch (err) {
        request.log.error('error ao verificar token');
        reply.code(401).send({ error: ' token invalido ou expirado' });
    }
};
exports.authMiddleware = authMiddleware;
