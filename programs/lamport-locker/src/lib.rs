use anchor_lang::prelude::*;

declare_id!("Fsqxbxgpm1rP2gWoXxmm5otdJmjCBE2GG39G1TaL9u4K");

mod instructions;
mod state;

pub use instructions::*;

#[program]
pub mod lamport_locker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(ctx.bumps)?;

        Ok(())
    }
}