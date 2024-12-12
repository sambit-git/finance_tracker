// Pyamment Controller
// NOT REQUIRED (AccountController handles): display all payments -> Transaction, Account, paymentAmount, paymentBalance, red or green for creditDebit, color code for status, app logo, paymentMethod
// update payment -> paymentAmount, recalculate balance, paymentmethod, app, credit/debit -> update account balance and recalculate balance, status
// create payment <- will be done in Transaction
// delete payment -> Don't allow

// Transaction Controller
// create transaction -> Transaction with transactionItem and payment (update account balance)
// update transaction -> Transaction details, add item or remove item, update payment or add payment
// delete transaction ->
// retrieve transaction -> Transaction, Transaction items, payment

// Account Controller
// DONE: display all accounts -> account and balance (upon click load payments from payment controller)
// TODO: delete account -> delete associated payments and transactions(with transaction items)
// TODO: update account -> account name
// DONE: create account -> name and balance

// TransactionItem Controller
// Create <- handled by Transaction
// Update -> update details
// delete -> delete item, recalculate transaction total, payment total, account balance
// retrieve <- Done in Transactions
