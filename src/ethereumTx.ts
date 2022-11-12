import { BigNumber, BigNumberish, ethers } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";

import 'dotenv/config';
import fs from "fs";

const alchemy_api = process.env.JSON_RPC;
const mnemonic = fs.readFileSync(".secret1").toString().trim();


// AlchemyAPIからEthereumとの接続用インスタンスを作成
const provider = new ethers.providers.JsonRpcProvider(alchemy_api);

// Memonicから署名用のインスタンスを作成
const signer = ethers.Wallet.fromMnemonic(mnemonic);

export const app = async (recipient: string, amount: string) => {
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

    // オフライン実行時は以下
    // const gasPrice: BigNumberish = ethers.utils.parseEther("21", "gwei");
    // const nonce: BigNumberish = new DataTransfer().getTime();

    /**
     * Tx作成 ==> Tx署名 ==> Tx送信
     */
    const unsignedTx = createTx(sender, recipient, value, gasPrice, gasLimit, nonce);
    const signedTx = await signTx(unsignedTx);
    //const sentTx = await sendTx(signedTx);

    //console.log(sentTx.hash);
}

// 未署名のTxを作成する
export const createTx = (from: string, to: string, value: ethers.BigNumber, gasPrice: ethers.BigNumber, gasLimit: string, nonce: number): TransactionRequest => {
    const unsignedTx: TransactionRequest = {
        from: from,
        to: to,
        value: value,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        nonce: nonce
    }
    console.log("unsignedTx: ", unsignedTx);
    return unsignedTx;
}

// Signerインスタンスを使ってTxにサインを行う
export const signTx = async (unsignedTx: TransactionRequest): Promise<string> => {
    const signer = ethers.Wallet.fromMnemonic(mnemonic);
    const signedTx = await signer.signTransaction(unsignedTx);
    console.log("signedTx: ", signedTx)
    return signedTx;
}

// Providerインスタンスを使って署名済みTxをBroadcastする
export const sendTx = async (signedTx: string): Promise<TransactionResponse> => {
    const provider = new ethers.providers.JsonRpcProvider(alchemy_api);
    const sentTx = await provider.sendTransaction(signedTx);
    return sentTx;
}

