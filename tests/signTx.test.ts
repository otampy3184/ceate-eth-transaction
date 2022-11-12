import { expect } from "chai";
import { ethers } from "ethers";
import { TransactionRequest, TransactionResponse } from "@ethersproject/abstract-provider";

import {  app, createTx, signTx, sendTx } from "../src/ethereumTx";

import 'dotenv/config';
import fs from "fs";

const alchemy_api = process.env.JSON_RPC;
const mnemonic1 = fs.readFileSync(".secret1").toString().trim();
const memonic2 = fs.readFileSync(".secret2").toString().trim();
const signer = ethers.Wallet.fromMnemonic(mnemonic1);
const receiver = ethers.Wallet.fromMnemonic(memonic2);
const provider = new ethers.providers.JsonRpcProvider(alchemy_api);

test('正常系:createTx', async() =>  {
    const sender: string = signer.address;
    const recipient: string = receiver.address;
    const value: ethers.BigNumber = ethers.utils.parseUnits('0.001', 18);
    const gasPrice: ethers.BigNumber = ethers.utils.parseUnits('21.0', 9); // Providerから現在のGasPriceを取得(オンライン専用)
    const gasLimit: string = ethers.utils.hexlify(100000); // エンコードした値に変換
    const nonce: number = new Date().getTime();

    const tx: TransactionRequest = {
        from: sender,
        to: recipient,
        value: value,
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        nonce: nonce
    }

    const actual: TransactionRequest = createTx(sender, recipient, value, gasPrice, gasLimit, nonce)

    expect(JSON.stringify(actual)).to.equal(JSON.stringify(tx))
})

test('正常系:signTx', async() => {
    const sender: string = signer.address;
    const recipient: string = receiver.address;
    const value: ethers.BigNumber = ethers.utils.parseUnits('0.001', 18);
    const gasPrice: ethers.BigNumber = ethers.utils.parseUnits('21.0', 9); // Providerから現在のGasPriceを取得(オンライン専用)
    const gasLimit: ethers.BigNumberish = ethers.utils.hexlify(100000); // エンコードした値に変換
    const nonce: number = new Date().getTime();

    const tx: TransactionRequest = createTx(sender, recipient, value, gasPrice, gasLimit, nonce)

    const signedTx = await signer.signTransaction(tx);

    const actual = await signTx(tx);

    expect(actual).to.equal(signedTx);
})

test('正常系:sendTx', async() => {
    const sender: string = signer.address;
    const recipient: string = receiver.address;
    const value: ethers.BigNumber = ethers.utils.parseUnits('0.001', 18);
    const gasPrice: ethers.BigNumber = ethers.utils.parseUnits('21.0', 9); // Providerから現在のGasPriceを取得(オンライン専用)
    const gasLimit: ethers.BigNumberish = ethers.utils.hexlify(100000); // エンコードした値に変換
    const nonce: number = new Date().getTime();

    const tx: TransactionRequest = createTx(sender, recipient, value, gasPrice, gasLimit, nonce)

    const signedTx = await signTx(tx);

    const actual = await sendTx(signedTx);

    const sentTx = await provider.sendTransaction(signedTx);

    expect(actual.hash).to.equal(sentTx.hash);
})
