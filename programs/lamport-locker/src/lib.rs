use anchor_lang::prelude::*;

declare_id!("Fsqxbxgpm1rP2gWoXxmm5otdJmjCBE2GG39G1TaL9u4K");

mod instructions;
mod state;
mod errors;

pub use instructions::*;

#[program]
pub mod lamport_locker {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize(&ctx.bumps)?;

        Ok(())
    }

    pub fn deposit(ctx: Context<Vault>, amount: u64) -> Result<()> {
        ctx.accounts.deposit(amount)?;

        Ok(())
    }

    pub fn withdraw(ctx: Context<Vault>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw(amount)?;

        Ok(())
    }

    pub fn close(ctx: Context<Close>) -> Result<()> {
        ctx.accounts.close()?;

        Ok(())
    }
}