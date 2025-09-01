import admin from "firebase-admin";
import { env } from "./env";

const initializeFirebaseAdmin = (): void => {
  if (admin.apps.length > 0) return; // ✅ apps, não app

  const { FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_PROJECT_ID } = env;

  if (!FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY || !FIREBASE_PROJECT_ID) {
    throw new Error("Falha ao iniciar Firebase: faltam credenciais");
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: FIREBASE_PROJECT_ID,
        clientEmail: FIREBASE_CLIENT_EMAIL,
        privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // ✅ tratar quebras
      }),
    });
    console.log("Firebase Admin inicializado com sucesso ✅");
  } catch (err) {
    console.error("Falha ao conectar Firebase:", err);
    throw err; // melhor lançar do que encerrar processo direto
  }
};

export default initializeFirebaseAdmin;
