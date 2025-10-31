use anchor_lang::prelude::*;

declare_id!("Fsqxbxgpm1rP2gWoXxmm5otdJmjCBE2GG39G1TaL9u4K");

#[program]
pub mod lamport_locker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
