import { expect } from "chai";
import { runApp } from "../src/signTx";

describe("VerifySignature", () => {
    it("check signed transaction", async () => {
        const recipient = "0x347cDceee806d8b45063B741F6B4fe538458aB74";
        const value = "0.001";

        expect(
            await runApp(recipient, value)
        ).to.not.equal(Error);
    })
})