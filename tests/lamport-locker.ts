import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LamportLocker } from "../target/types/lamport_locker";
import { expect } from "chai";

describe("lamport-locker", () => {
  // Configure the client to use the local cluster.
  const provider = anchor. AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.lamport_locker as Program<LamportLocker>;
  
  const [vaultStatePDA, stateBump] = anchor.web3.PublicKey.findProgramAddressSync( 
    [Buffer.from("state"), provider.publicKey.toBytes()],
    program.programId
  );

  const [vaultPDA, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStatePDA.toBytes()],
    program.programId
  );

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize()
      .accountsPartial({
        user: provider.publicKey,
        vaultState: vaultStatePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();
    console.log("Your transaction signature", tx);
    await provider.connection.confirmTransaction(tx, "confirmed");

    const vaultStateAcc = await program.account.vaultState.fetch(vaultStatePDA);

    console.log("vaultStateAcc: ", vaultStateAcc);
    console.log("Expected stateBump:", stateBump); //255?
    console.log("Expected vaultBump:", vaultBump); 

    expect(vaultStateAcc.stateBump).to.equal(stateBump);
    expect(vaultStateAcc.vaultBump).to.equal(vaultBump);
  });
});
