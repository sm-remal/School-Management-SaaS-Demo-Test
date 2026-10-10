"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const port = config_1.default.port;
const main = async () => {
    try {
        app_1.default.listen(port, () => {
            console.log(`School Management server is running on ${port}`);
        });
    }
    catch (error) {
        console.log(`Error Starting The Server ${error}`);
        // await prisma.$disconnect();
        process.exit(1);
    }
};
main();
//# sourceMappingURL=server.js.map