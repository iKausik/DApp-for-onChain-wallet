## Shared Wallet DApp (same as a Joint Bank Account):

- deployer = the deployer of the contract, the owner of the whole wallet(bank).
- account holder = anyone can create an account, account holder will also become an user after opening an account.
- user = only an account holder can add users to his account to give access of deposits and withdrwals.

### NB:

1.  an account holder can only open one account.
2.  an user can't open his own account if he/she already associated with an account added by an existing account holder.
3.  only the deployer(owner) can see the total amount of funds available under management in the wallet(bank).
4.  only the deployer(owner) can see a list(array) of all the account holders in the wallet(bank).
