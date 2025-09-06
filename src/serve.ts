import app from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import { prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.services";
import { FastifyListenOptions } from "fastify";

// Garantir que PORT seja número
const PORT = Number(env.PORT) || 3333;

// Inicializar Firebase
initializeFirebaseAdmin();

const startServe = async () => {
  try {
    // Conectar Prisma
    await prismaConnect();
    console.log("Prisma conectado com sucesso ✅");

    // Inicializar categorias globais
    await initializeGlobalCategories();
    console.log("Categorias globais inicializadas ✅");

    // Configuração do Fastify para Render
    const listenOptions: FastifyListenOptions = {
      port: PORT,
      host: "0.0.0.0", // obrigatório para Render
    };

    await app.listen(listenOptions);
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  }
};

// Start
startServe();
