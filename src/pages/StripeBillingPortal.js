import React, { useState } from 'react';
import { Card, Button, Typography, Space, message } from 'antd';
import { CreditCardOutlined, FileTextOutlined, HistoryOutlined, LoadingOutlined } from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Title, Text } = Typography;

const StripeBillingPortal = ({ userData }) => {
  const [loading, setLoading] = useState(false);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const response = await api.customRoute('createPortalSession', {
        email: userData.email,
        userId: userData._id,
        returnUrl: window.location.href
      });
      
      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        message.error('Failed to redirect to billing portal. Please try again.');
      }
    } catch (error) {
      message.error('Failed to access billing portal. Please try again.');
      console.error('Portal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title={
        <Space>
          <CreditCardOutlined style={{ color: '#fd5c02' }} />
          <span>Billing & Payment Management</span>
        </Space>
      }
      style={{ marginTop: '24px' }}
    >
      <div style={{ marginBottom: '16px' }}>
        <Text>
          Manage your payment methods, view invoices, and update billing information through our secure payment portal.
        </Text>
      </div>
      
      <Space direction="vertical" style={{ width: '100%' }}>
        <Button 
          type="primary" 
          icon={<CreditCardOutlined />} 
          onClick={redirectToCustomerPortal}
          loading={loading}
          style={{ marginBottom: '8px' }}
        >
          {loading ? 'Redirecting...' : 'Manage Payment Methods'}
        </Button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
          <Button 
            type="link"
            icon={<FileTextOutlined />}
            onClick={redirectToCustomerPortal}
            disabled={loading}
          >
            View Invoices
          </Button>
          
          <Button 
            type="link"
            icon={<HistoryOutlined />}
            onClick={redirectToCustomerPortal}
            disabled={loading}
          >
            Payment History
          </Button>
        </div>
      </Space>
      
      <div style={{ marginTop: '16px', fontSize: '12px', color: '#888' }}>
        <Text type="secondary">
          Payments are securely processed by Stripe. Your payment information is never stored on our servers.
        </Text>
      </div>
    </Card>
  );
};

export default StripeBillingPortal;