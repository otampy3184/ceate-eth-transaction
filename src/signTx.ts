import { ethers } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";

import 'dotenv/config';
import fs from "fs";
import { argv } from "process";

const alchemy_api = process.env.JSON_RPC;
const mnemonic = fs.readFileSync(".secret").toString().trim();

// コマンドライン引数から送信先アドレスと送金額を取得しておく
const recipient: string = argv[2];
const value: string = argv[3];

const app = async(recipient: string, value: string) => {
    // AlchemyAPIからEthereumとの接続用インスタンスを作成
    const provider = new ethers.providers.JsonRpcProvider(alchemy_api);

    // Memonicから署名用のインスタンスを作成
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    /**
     * Tx作成用の諸々の値を作っていく
     */

    // Providerから現在のGasPriceを取得(オンライン専用)
    const gasPrice = await provider.getGasPrice();

    // 一意のNonceを生成するためにTransactionCountを利用する(オンライン専用) 
    const nonce = await provider.getTransactionCount(wallet.address, "latest");
    
    // オフライン実行時は以下
    // const gasPrice = ethers.utils.parseEther("21", "gwei");
    // const nonce = new DataTransfer().getTime();

    // 署名用Transactionを生成
    const tx : TransactionRequest = {
        from: wallet.address,
        to: recipient,
        value: ethers.utils.parseUnits(value, "ether"), // 送金額
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(100000), // 適当なGasリミット
        nonce: nonce
    }

    /**
     * 作成したTransactionに署名を行う
     * 署名トランザクションをEthereumネットワークに送る
     */

    // Signerインスタンスを使ってTxにサインを行う
    const signedTx = await wallet.signTransaction(tx);
    console.log("signedTx:", signedTx);

    // 署名済みのトランザクションをBroadcastする
    const sentTx = await provider.sendTransaction(signedTx);
    console.log(sentTx.hash);
}

const runApp = async () => {
    try {
        await app(recipient, value);
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

runApp();

