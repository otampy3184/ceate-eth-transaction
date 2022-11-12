import { ethers, BigNumber, BigNumberish } from "ethers";
import { createTx, signTx } from "./ethereumTx";
import { argv } from "process";
import fs from "fs";
import 'dotenv/config';

// memonicから署名用のインスタンスを生成
const mnemonic = fs.readFileSync(".secret1").toString().trim();
const signer = ethers.Wallet.fromMnemonic(mnemonic);

// コマンドラインから送信先アドレスと送金額を取得
const recipient: string = argv[2];
const amount: string = argv[3];

/**
 * 引数からTransactionを生成し署名を行う
 * @param recipient 
 * @param amount 
 */
const runOffline = async(recipient: string, amount: string) => {
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

        /**
         * Tx作成 ==> Tx署名
         */
        const unsignedTx = createTx(sender, recipient, value, gasPrice, gasLimit, nonce);
        const signedTx = await signTx(unsignedTx);
        console.log("signedTx: ", signedTx)

        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1)
    }
}

runOffline(recipient, amount);