import React, { useState } from 'react';
import { Modal, Alert, Button, Space } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from 'auth/FetchInterceptor';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QbWrHFfFMx3GxeO6G8C72ke4dJCj5x80YazKFT2onSW58h1j0MtrlHK0stjeW0ioejX1MRfpprS621z2m7DLMfh009uRSSWCH');

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent using your API interceptor
      const response = await api.customRoute('createPaymentIntent', {
        amount: amount
      });

      const { clientSecret } = response;

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '0 auto' }}>
      {error && (
        <Alert 
          message="Payment Error" 
          description={error}
          type="error"
          style={{ marginBottom: '16px' }} 
        />
      )}
      
      <div style={{ 
        padding: '16px',
        border: '1px solid #d9d9d9',
        borderRadius: '6px',
        marginBottom: '16px'
      }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: '8px'
      }}>
        <Button
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={!stripe}
          className="primary-solid-button"
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </Button>
      </div>
    </form>
  );
};

const StripePaymentModal = ({ visible, amount, onSuccess, onCancel }) => {
  return (
    <Modal
      title="Complete Payment"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      centered
    >
      <Elements stripe={stripePromise}>
        <PaymentForm 
          amount={amount}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </Elements>
    </Modal>
  );
};

export default StripePaymentModal;