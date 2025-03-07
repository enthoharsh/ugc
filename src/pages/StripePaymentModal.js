import React, { useState } from 'react';
import { Modal, Alert, Button, Space } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from 'auth/FetchInterceptor';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QbWrHFfFMx3GxeO6G8C72ke4dJCj5x80YazKFT2onSW58h1j0MtrlHK0stjeW0ioejX1MRfpprS621z2m7DLMfh009uRSSWCH');

const PaymentForm = ({ amount, onSuccess, onCancel, campaignId, applicationData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('main_user') || '{}');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // First create or retrieve a customer
      const customerResponse = await api.customRoute('createOrRetrieveCustomer', {
        email: user.email,
        name: user.name,
        metadata: {
          userId: user._id
        }
      });

      if (!customerResponse.success) {
        throw new Error(customerResponse.message || 'Failed to create customer');
      }

      // Create payment intent using the customer ID
      const response = await api.customRoute('createPaymentIntent', {
        amount: amount,
        customerId: customerResponse.customerId,
        metadata: {
          campaignId: campaignId,
          applicationId: applicationData._id,
          description: `Hiring creator for campaign: ${applicationData.campaign?.campaign_name}`
        }
      });

      const { clientSecret } = response;

      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.name,
            email: user.email
          }
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onSuccess(result.paymentIntent, customerResponse.customerId);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('main_user') || '{}');
      
      const response = await api.customRoute('createPortalSession', {
        email: user.email,
        userId: user._id,
        returnUrl: window.location.href
      });
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        setError('Failed to redirect to billing portal. Please try again.');
      }
    } catch (error) {
      setError('Failed to access billing portal. Please try again.');
      console.error('Portal error:', error);
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <Button
          type="link"
          onClick={redirectToCustomerPortal}
          style={{ padding: 0, height: 'auto' }}
        >
          View billing history and manage payment methods
        </Button>
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

const StripePaymentModal = ({ visible, amount, onSuccess, onCancel, campaignId, applicationData }) => {
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
          campaignId={campaignId}
          applicationData={applicationData}
        />
      </Elements>
    </Modal>
  );
};

export default StripePaymentModal;