import app from "./app"
import config from "./config";

const port = config.port;

const main = async () => {
    try {

        app.listen(port, () => {
            console.log(`School Management server is running on ${port}`)
        })
    } catch (error) {
        console.log(`Error Starting The Server ${error}`)
        // await prisma.$disconnect();
        process.exit(1);
    }
}

main();