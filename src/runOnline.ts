import { ethers, BigNumber } from "ethers";
import { createTx, signTx, sendTx } from "./ethereumTx";
import { argv } from "process";
import 'dotenv/config';
import fs from "fs";

// memonicから署名用のインスタンスを生成
const mnemonic = fs.readFileSync(".secret1").toString().trim();
const signer = ethers.Wallet.fromMnemonic(mnemonic);

// alchemyのapi_keyからGoerli接続用のインスタンスを生成
const alchemy_api = process.env.JSON_RPC;
const provider = new ethers.providers.JsonRpcProvider(alchemy_api);

// コマンドラインから送信先アドレスと送金額を取得
const recipient: string = argv[2];
const amount: string = argv[3];

/**
 * 引数からTransactionを生成し、署名を行なってからGoerliテストネットワーク上にTransactionを送る
 * @param recipient
 * @param value 
 */
export const runOnline = async (recipient: string, value: string) => {
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
        const gasPrice: BigNumber = await provider.getGasPrice(); // Providerから現在のGasPriceを取得(オンライン専用)
        const gasLimit = ethers.utils.hexlify(100000); // エンコードした値に変換
        const nonce = await provider.getTransactionCount(signer.address, "latest"); // 一意のNonceを生成するためにTransactionCountを利用する(オンライン専用) 
    
        /**
         * Tx作成 ==> Tx署名 ==> Tx送信
         */
        const unsignedTx = createTx(sender, recipient, value, gasPrice, gasLimit, nonce);
        const signedTx = await signTx(unsignedTx);
        const sentTx = await sendTx(signedTx);
        console.log(sentTx.hash);

        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runOnline(recipient, amount);