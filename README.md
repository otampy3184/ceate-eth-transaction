# Create Ethereum Transaction from Commandline arguments

simple cli application creating ethereum signed transaction

## How to use

git clone & install package

```:
% git clone https://github.com/otampy3184/ceate-eth-transaction.git
% cd create-eth-transaction
% npm i
```

using ts-node to execute typescript file

```:
% ./node_modules/.bin/ts-node src/signTx.ts [recipent-address-here] [sending-value-here] 
```

example(signed transaction appeared below the command)

```:
% ./node_modules/.bin/ts-node src/signTx.ts 0xBE5a600FB461C78F0B262b410A7bd66545cd1C50 0.001
signedTx: 0xf8660510830186a094347cdceee806d8b45063b741f6b4fe538458ab74865af3107a4000801ca09eb01332dcf3c37ff38c081e51f107978ba5b03e7fba11ef0dd503f2ac5bb23da02e81a06a3191ba72d45bc3e6f1b20eda8e5c5e1f0bee4a6060539e52805d78c1
```
