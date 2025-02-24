import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Typography, Space, notification } from 'antd';
import { LoadingOutlined, CheckCircleFilled, PayCircleFilled, CloseOutlined } from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Title, Text } = Typography;

const PayPalSettings = ({ userData, onDisconnect, loading }) => {
  const [disconnecting, setDisconnecting] = useState(false);
  
  // Check URL parameters for connection status

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.paypalobjects.com/js/external/api.js';
        script.async = true;
        script.onload = () => {
            window.paypal.use(['login'], function (login) {
                login.render({
                    "appid": "AUyULHYFTpCGBFaTlrlT-JHaPS5WM_7tAA8M3zGPKBUQdnSnsimvAfLJf1BA4bU-lYu8FZScANOC0BWN",
                    "authend": "sandbox",
                    "scopes": "openid email",
                    "containerid": "paypal",
                    "responseType": "code",
                    "locale": "en-us",
                    "buttonType": "CWP",
                    "buttonShape": "pill",
                    "buttonSize": "lg",
                    "fullPage": "false",
                    "returnurl": "https://ugc-backend.inkapps.io/api/paypal/callback"
                });
            });
        };
        document.body.appendChild(script);
    }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paypalStatus = params.get('paypal');
    
    if (paypalStatus === 'success') {
      notification.success({
        message: 'PayPal Connected',
        description: 'Your PayPal account has been successfully connected.',
      });
      
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    } else if (paypalStatus === 'error') {
      const reason = params.get('reason') || 'unknown';
      
      notification.error({
        message: 'Connection Failed',
        description: `Failed to connect your PayPal account. Reason: ${reason}`,
      });
      
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleDisconnect = async () => {
    try {
      setDisconnecting(true);
      const response = await api.customRoute("paypal/disconnect", {});
      
      if (response.success) {
        notification.success({
          message: 'PayPal Disconnected',
          description: 'Your PayPal account has been successfully disconnected.',
        });
        
        if (onDisconnect) onDisconnect();
      }
    } catch (error) {
      console.error("Failed to disconnect PayPal:", error);
      notification.error({
        message: 'Disconnection Failed',
        description: 'Failed to disconnect your PayPal account. Please try again.',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const paypalAccount = userData?.paypal_account;
  const isConnected = paypalAccount?.connected;

  return (
    <Card className="mb-4">
      <Title level={4}>
        <PayCircleFilled className="mr-2" style={{ color: '#003087' }}/>
        PayPal Account
      </Title>
      
      {loading ? (
        <div className="text-center py-4">
          <LoadingOutlined style={{ fontSize: 24 }} spin />
          <div className="mt-2">Loading PayPal account details...</div>
        </div>
      ) : isConnected ? (
        <div>
          <Alert
            message="PayPal Account Connected"
            description={
              <Space direction="vertical">
                <Text>Connected Account: {paypalAccount.email}</Text>
                <Text>Account Name: {paypalAccount.name || 'Not available'}</Text>
                <Text type="secondary">Last updated: {new Date(paypalAccount.updated_at).toLocaleString()}</Text>
              </Space>
            }
            type="success"
            showIcon
            icon={<CheckCircleFilled />}
            className="mb-4"
          />
          <Button 
            danger 
            onClick={handleDisconnect}
            loading={disconnecting}
            icon={<CloseOutlined />}
          >
            Disconnect PayPal Account
          </Button>
        </div>
      ) : (
        <div>
          <Alert
            message="Connect Your PayPal Account"
            description="Connect your PayPal account to receive payments through our platform."
            type="info"
            showIcon
            className="mb-4"
          />
          <div id="paypal-button-container"></div>
          
          {/* PayPal Login Button */}
          <div>
            <span id='paypal'></span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default PayPalSettings;