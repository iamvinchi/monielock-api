import axios from 'axios';

export const getAllBanks = async() => {
    try {
      const response = await axios.get(
        'https://api.paystack.co/bank',
        {
          params: {
            country: 'nigeria',
            currency: 'NGN',
            perPage: 100
          },
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Paystack API Error:', error.response?.data || error.message);
      throw error;
    }
  }

export const validateBankAccount = async(data) => {
    const {bankCode, accountNumber, accountName} = data
    const secretKey = process.env.PAYSTACK_SECRET_KEY
  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
      {
        headers: {
          'Authorization': `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    return  error.response?.data || error.message;
  }
}

export const generateReference = (walletId) => {
    const random = Math.floor(1000000000 + Math.random() * 9000000000);
    return `${walletId}-${random}`
  };

export const createRecipient = async (accountDetails) => {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transferrecipient',
        {
          type: 'nuban',
          name: accountDetails.accountName,
          account_number: accountDetails.accountNumber,
          bank_code: accountDetails.bankCode,
          currency: 'NGN'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating recipient:', error.response?.data || error.message);
      throw error;
    }
  };

export const initiateTransfer = async (transferDetails) => {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transfer',
        {
          source: 'balance',
          amount: transferDetails.amount * 100,
          recipient: transferDetails.recipientCode,
          reason: transferDetails.reason || 'Withdrawal'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.data;
    } catch (error) {
      console.error('Transfer error:', error.response?.data || error.message);
      throw error;
    }
  };

  export const refundCustomer = async (transferData) => {
    try {
      const response = await axios.post(
        'https://api.paystack.co/refund',
        {
          transaction: transferData.reference,
          amount: transferData.amount,
          merchant_note: `Refund for failed transfer ${transferData.reference}`,
          customer_note: 'Your transfer failed. Amount has been refunded.'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return {
        success: true,
        refundId: response.data.data.id
      };
    } catch (error) {
      console.error('Refund failed:', error.response?.data || error.message);
      throw error;
    }
  };
  
  // Verify refund status with Paystack
  const verifyRefundStatus = async (refundId) => {
    const response = await axios.get(
      `https://api.paystack.co/refund/${refundId}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );
    
    return response.data.data.status;
  };