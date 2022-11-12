import { ethers, BigNumber, BigNumberish } from "ethers";

import { createTx, signTx } from "./ethereumTx";
import { argv } from "process";

import 'dotenv/config';
import fs from "fs";

const mnemonic = fs.readFileSync(".secret1").toString().trim();

const signer = ethers.Wallet.fromMnemonic(mnemonic);

// コマンドライン引数から送信先アドレスと送金額を取得
const recipient: string = argv[2];
const amount: string = argv[3];

const runOffline = async(recipient, amount) => {
    try {
         /**
         * 署名Transaction生成するためのパラメータを用意
         * sender => 送信先アドレス
         * value => 送金額
         * gasPrice => 現在のGasPrice
         * gasLimit => 既定のGasLimit
         * nonce => 一意の数
         */
        const sender = signer.address;
        const value: BigNumber = ethers.utils.parseUnits(amount, "ether");
        const gasPrice: BigNumberish = ethers.utils.parseUnits("21", "gwei");
        const gasLimit = ethers.utils.hexlify(100000); // エンコードした値に変換
        const nonce: BigNumberish = new Date().getTime();

        const unsignedTx = createTx(sender, recipient, value, gasPrice, gasLimit, nonce);
        const signedTx = await signTx(unsignedTx);
        console.log("signedTx: ", signedTx)
    } catch (error){
        console.log(error);
    }
}

runOffline(recipient, amount);