import app  from "./app";
import { env } from "./config/env";
import initializeFirebaseAdmin from "./config/firebase";
import{ prismaConnect } from "./config/prisma";
import { initializeGlobalCategories } from "./services/globalCategories.services";



const PORT = env.PORT;
initializeFirebaseAdmin()
const startServe = async () => {
    try {


        await prismaConnect();
        
        await initializeGlobalCategories()

         await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server is running on ${PORT}`);
    } catch (err) {
     console.error(err); }
}
startServe();

