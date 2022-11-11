import { ethers } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import 'dotenv/config';
import fs from "fs";

const alchemy_api = process.env.JSON_RPC;
const mnemonic = fs.readFileSync(".secret").toString().trim();

const app = async() => {
    // AlchemyAPIからEthereumとの接続用インスタンスを作成
    const provider = new ethers.providers.JsonRpcProvider(alchemy_api);

    // Memonicから署名用のインスタンスを作成
    const wallet = ethers.Wallet.fromMnemonic(mnemonic);

    /**
     * Tx作成用の諸々の値を作っていく
     */

    // サンプルの受け取り用アドレス
    const recipient = "0x347cDceee806d8b45063B741F6B4fe538458aB74";

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
        value: ethers.utils.parseUnits("0.001", "ether"), // 送金額
        gasPrice: gasPrice,
        gasLimit: ethers.utils.hexlify(100000), // 適当なGasリミット
        nonce: nonce
    }

    // Signerインスタンスを使ってTxにサインを行う
    const signedTx = await wallet.signTransaction(tx);
    console.log("signedTx:", signedTx);

    // 署名済みのトランザクションをBroadcastする
    const sentTx = await provider.sendTransaction(signedTx);
    console.log(sentTx.hash);
}

const runApp = async () => {
    try {
        await app();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

runApp();

