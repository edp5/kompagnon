import { AsyncLocalStorage } from "node:async_hooks";

import { knex } from "../../../db/knex-database-connection.js";

const asyncLocalStorage = new AsyncLocalStorage();

class DomainTransaction {
  constructor(knexTransaction) {
    this.knexTransaction = knexTransaction;
  }

  /**
   * Execute a function within a transaction context.
   * If already within a transaction, reuses the existing transaction.
   * @param {Function} callback - The function to execute within the transaction
   * @param {import('knex').Knex.TransactionConfig} transactionConfig - Optional transaction configuration
   * @returns {Promise<*>} The result of the callback function
   */
  static execute(callback, transactionConfig) {
    const existingConn = DomainTransaction.getConnection();
    if (existingConn.isTransaction === true) {
      return callback();
    }
    return knex.transaction((trx) => {
      const domainTransaction = new DomainTransaction(trx);
      return asyncLocalStorage.run({ transaction: domainTransaction }, callback);
    }, transactionConfig);
  }

  /**
   * Get the current Knex connection.
   * Returns the transaction connection if within a transaction context,
   * otherwise returns the standard Knex connection.
   * @returns {import('knex').Knex} The Knex connection or transaction
   */
  static getConnection() {
    const store = asyncLocalStorage.getStore();

    if (store?.transaction) {
      const domainTransaction = store.transaction;
      return domainTransaction.knexTransaction;
    }
    return knex;
  }
}

/**
 * Wraps a function to execute it within a transaction.
 * This allows you to mark a function as transactional without passing transaction parameters.
 * @param {Function} func - The function to wrap
 * @param {import('knex').Knex.TransactionConfig=} transactionConfig - Optional transaction configuration
 * @returns {function(...*): Promise<*>} The wrapped function
 */
function withTransaction(func, transactionConfig) {
  if (typeof func !== "function") {
    throw new TypeError("Expected a function to wrap with transaction");
  }
  return (...args) => DomainTransaction.execute(() => func(...args), transactionConfig);
}

export { DomainTransaction, withTransaction };
