import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionTDO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

interface GetAllTransaction {
  transactions: Array<Transaction>;

  balance: object | null;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): GetAllTransaction {
    return {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(({ type }) => type === 'income')
      .reduce((total, { value }) => total + value, 0);

    const outcome = this.transactions
      .filter(({ type }) => type === 'outcome')
      .reduce((total, { value }) => total + value, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }

  public create({ title, value, type }: CreateTransactionTDO): Transaction {
    const { total } = this.getBalance();

    if (type === 'outcome' && total < value) {
      throw new Error(
        "You can't make a withdrawal because at the moment we don't have balance positive",
      );
    } else {
      const transaction = new Transaction({ title, value, type });

      this.transactions.push(transaction);

      return transaction;
    }
  }
}

export default TransactionsRepository;
