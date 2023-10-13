const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

BigInt.prototype.toJSON = function () { 
  const int = Number.parseInt(this.toString()); 
  return int ?? this.toString(); 
};

module.exports = {
  registerTransaction: async (req, res) => {
    try {
      const { source_account_id, destination_account_id, amount } = req.body;
  
      if (!source_account_id || !destination_account_id || isNaN(amount) || amount <= 0) {
        return res.status(400).json({
          status: false,
          message: "Invalid input data",
          data: null,
        });
      }
  
      const sourceAccount = await prisma.bank_accounts.findUnique({
        where: { id: source_account_id },
      });
  
      if (!sourceAccount) {
        return res.status(404).json({
          status: false,
          message: "Source account ID not found",
          data: null,
        });
      }
  
      const destinationAccount = await prisma.bank_accounts.findUnique({
        where: { id: destination_account_id },
      });
  
      if (!destinationAccount) {
        return res.status(404).json({
          status: false,
          message: "Destination account ID not found",
          data: null,
        });
      }
  
      if (sourceAccount.balance < amount) {
        return res.status(400).json({
          status: false,
          message: "Insufficient balance",
          data: null,
        });
      }
  
      const transaction = await prisma.bank_account_transactions.create({
        data: {
          source_account_id,
          destination_account_id,
          amount: BigInt(amount)
        }
      });
  
      await prisma.bank_accounts.update({
        where: { id: source_account_id },
        data: { balance: { decrement: amount } },
      });
  
      await prisma.bank_accounts.update({
        where: { id: destination_account_id },
        data: { balance: { increment: amount } },
      });
  
      return res.json({
        data: transaction
      });
    } catch (error) {
      console.error("Error: ", error);
      return res.status(500).json({
        error: 'Failed to register transaction'
      });
    }
  },

  getTransaction: async (req, res) => {
    const transactions = await prisma.bank_account_transactions.findMany();

    return res.json({
      data: transactions
    });
  },
  
  getTransactionId: async (req, res) => {
    const transactionId = parseInt(req.params.transactionId);
    const transaction = await prisma.bank_account_transactions.findUnique({
      where: {
        id: transactionId
      },
      include: {
        source_account: true,
        destination_account: true
      }
    });
  
      return res.json({
        data: transaction
      });
  }
}  