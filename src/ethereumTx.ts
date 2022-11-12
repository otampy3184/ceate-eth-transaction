import { ethers, BigNumber } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";
import fs from "fs";
import 'dotenv/config';

// alchemyのapi_keyからGoerli接続用のインスタンスを生成
const alchemy_api = process.env.JSON_RPC;
const mnemonic = fs.readFileSync(".secret1").toString().trim();

/**
 * 未署名のTxを作成する
 * @param from - is for sender address
 * @param to - is for recipient address
 * @param value - is for sending ether value
 * @param gasPrice - is for base gasPrice
 * @param gasLimit - is for max gas limit of transaction 
 * @param nonce - is for unique number
 * @returns {TransactionReques} - is unsigned transaction
 */
export const createTx = (from: string, to: string, value: BigNumber, gasPrice: BigNumber, gasLimit: string, nonce: number): TransactionRequest => {
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

/**
 * Signerインスタンスを使ってTxにサインを行う
 * @param unsignedTx - is what we're signing for
 * @returns {Promise<string>} - is result of signing
 */
export const signTx = async (unsignedTx: TransactionRequest): Promise<string> => {
    const signer = ethers.Wallet.fromMnemonic(mnemonic);
    const signedTx = await signer.signTransaction(unsignedTx);
    return signedTx;
}

/**
 * Providerインスタンスを使って署名済みTxをBroadcastする
 * @param signedTx - is what we're sending to 
 * @returns {Promise<TransactionResponse>} - is result of sending transaction
 */
export const sendTx = async (signedTx: string): Promise<TransactionResponse> => {
    const provider = new ethers.providers.JsonRpcProvider(alchemy_api);
    const sentTx = await provider.sendTransaction(signedTx);
    return sentTx;
}
