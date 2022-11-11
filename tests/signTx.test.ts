import { expect, assert } from "chai";
import { ethers, BigNumber } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";

import {  app, createTx, signTx, sendTx } from "../src/signTx";

import 'dotenv/config';
import fs from "fs";

test('test', async function() {
    const alchemy_api = process.env.JSON_RPC;
    const mnemonic = fs.readFileSync(".secret").toString().trim();

    const signer = ethers.Wallet.fromMnemonic(mnemonic);

    const sender: string = signer.address;
    const recipient2: string = "0x347cDceee806d8b45063B741F6B4fe538458aB7"
    const value: ethers.BigNumber = ethers.utils.parseUnits('0.001', 18);
    const gasPrice: ethers.BigNumber = ethers.utils.parseUnits('21.0', 9); // Providerから現在のGasPriceを取得(オンライン専用)
    const gasLimit: string = ethers.utils.hexlify(100000); // エンコードした値に変換
    const nonce: number = new Date().getTime();

    const tx: TransactionRequest = {
        from: sender,
        to: recipient2,
        value: value,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        nonce: nonce
    }
    console.log(tx);

    const actual: TransactionRequest = createTx(sender, recipient2, value, gasPrice, gasLimit, nonce)

    console.log(actual)

    expect(JSON.stringify(actual)).to.equal(JSON.stringify(tx))
})