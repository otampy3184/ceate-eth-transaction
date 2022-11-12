# Create Ethereum Transaction from Commandline arguments

simple cli application creating ethereum signed transaction

## How to use

git clone & install package

```:
% git clone https://github.com/otampy3184/ceate-eth-transaction.git
% cd create-eth-transaction
% npm i
```

using ts-node to execute typescript file(offline only)

```:
% ./node_modules/.bin/ts-node src/runOffline.ts [recipent-address-here] [sending-value-here] 
```

if you want to do it in online and send transaction to Goeli test netowork, use "runOnline.ts"

```:
% ./node_modules/.bin/ts-node src/runOnline.ts [recipent-address-here] [sending-value-here] 
```

example of runOffline.ts(signed transaction appeared below the command)

```:
% ./node_modules/.bin/ts-node src/runOffline.ts 0x347cDceee806d8b45063B741F6B4fe538458aB74 0.001
signedTx: 0xf8660510830186a094347cdceee806d8b45063b741f6b4fe538458ab74865af3107a4000801ca09eb01332dcf3c37ff38c081e51f107978ba5b03e7fba11ef0dd503f2ac5bb23da02e81a06a3191ba72d45bc3e6f1b20eda8e5c5e1f0bee4a6060539e52805d78c1
```

example of runOnline.ts(hash of send transaction appered below the command)

```:
takagihrs@hiroshinoMacBook-Pro create-eth-transaction % ./node_modules/.bin/ts-node src/runOnline.ts 0x347cDceee806d8b45063B741F6B4fe538458aB74 0.001
0x44a8c17bec5fc329f77c76274cb86226ec19ecccd404a63536f3516ae85efab1
```

[check it out on etherscan](https://goerli.etherscan.io/tx/0x44a8c17bec5fc329f77c76274cb86226ec19ecccd404a63536f3516ae85efab1)

## Test results

```:
takagihrs@hiroshinoMacBook-Pro create-eth-transaction % npm test

> create-eth-transaction@1.0.0 test
> jest

 PASS  tests/ethereumTx.test.ts
  ✓ 正常系:createTx (1 ms)
  ✓ 正常系:signTx (752 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.405 s
Ran all test suites.
```
