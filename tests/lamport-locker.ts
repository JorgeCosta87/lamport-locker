import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { LamportLocker } from "../target/types/lamport_locker";
import { expect } from "chai";
import { BN } from "@coral-xyz/anchor";

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


  it("Deposit Sol, amount = 1.1", async () => {
    const deposit_ammount = new BN(1.1 * anchor.web3.LAMPORTS_PER_SOL);
    const vault_initial_balance = (await provider.connection.getAccountInfo(vaultPDA)).lamports;

    const tx = await program.methods.deposit(deposit_ammount)
    .accountsPartial({
      user: provider.publicKey,
      vaultState: vaultStatePDA,
      vault: vaultPDA,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();
    console.log("Your transaction signature", tx);

    const vault = await provider.connection.getAccountInfo(vaultPDA)

    expect(vault.lamports).to.equal(deposit_ammount.toNumber() + vault_initial_balance);

  });

  it("Withraw Sol, amount = 0.6", async () => {
    const withdraw_ammount = new BN(0.6 * anchor.web3.LAMPORTS_PER_SOL);
    const vault_initial_balance = (await provider.connection.getAccountInfo(vaultPDA)).lamports;

    const tx = await program.methods.withdraw(withdraw_ammount)
    .accountsPartial({
      user: provider.publicKey,
      vaultState: vaultStatePDA,
      vault: vaultPDA,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .rpc();
    console.log("Your transaction signature", tx);

    const vault = await provider.connection.getAccountInfo(vaultPDA)

    expect(vault.lamports).to.equal(vault_initial_balance - withdraw_ammount.toNumber());

  });
  
  it("Withraw, expects error: InsufficientFunds", async () => {
    const vault_initial_balance = (await provider.connection.getAccountInfo(vaultPDA)).lamports;
    try {
      await program.methods.withdraw(new BN(vault_initial_balance + 1))
      .accountsPartial({
        user: provider.publicKey,
        vaultState: vaultStatePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();
    } catch(err)
    {
      expect(err.error.errorCode.code).to.equal("InsufficientFunds");
      expect(err.error.errorMessage).to.equal("Not enough funds.");
    }
  });

  it("Withraw, expects error: MinimumBalanceRequired ", async () => {
    const vault_initial_balance = (await provider.connection.getAccountInfo(vaultPDA)).lamports;
    try {
      await program.methods.withdraw(new BN(vault_initial_balance))
      .accountsPartial({
        user: provider.publicKey,
        vaultState: vaultStatePDA,
        vault: vaultPDA,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc();
    } catch(err)
    {
      expect(err.error.errorCode.code).to.equal("MinimumBalanceRequired");
      expect(err.error.errorMessage).to.equal("Minimun balance required for rend exempt");
    }
  });

});
