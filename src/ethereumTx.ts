import { ethers } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";

import 'dotenv/config';
import fs from "fs";

const alchemy_api = process.env.JSON_RPC;
const mnemonic = fs.readFileSync(".secret1").toString().trim();

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
    return unsignedTx;
}

// Signerインスタンスを使ってTxにサインを行う
export const signTx = async (unsignedTx: TransactionRequest): Promise<string> => {
    const signer = ethers.Wallet.fromMnemonic(mnemonic);
    const signedTx = await signer.signTransaction(unsignedTx);
    return signedTx;
}

// Providerインスタンスを使って署名済みTxをBroadcastする
export const sendTx = async (signedTx: string): Promise<TransactionResponse> => {
    const provider = new ethers.providers.JsonRpcProvider(alchemy_api);
    const sentTx = await provider.sendTransaction(signedTx);
    return sentTx;
}

