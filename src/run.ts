import { app } from "./ethereumTx";
import { argv } from "process";

// コマンドライン引数から送信先アドレスと送金額を取得しておく
const recipient: string = argv[2];
const amount: string = argv[3];

export const runApp = async (recipient: string, value: string) => {
    try {
        await app(recipient, value);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runApp(recipient, amount);