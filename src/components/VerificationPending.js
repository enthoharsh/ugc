import React, { useEffect, useState } from 'react';
import { Result, Button, Typography, Card, Spin } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig';
import { connect } from 'react-redux';
import { signOut } from 'redux/actions/Auth';
import { api } from 'auth/FetchInterceptor';

const { Paragraph, Text } = Typography;

const VerificationPending = ({ signOut, token }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  
  // Check verification status on mount and periodically
  useEffect(() => {
    if (!token) {
      history.push(`${AUTH_PREFIX_PATH}/login`);
      return;
    }
    
    // Function to check user verification status
    const checkVerificationStatus = async () => {
      setLoading(true);
      try {
        // Get latest user details
        const response = await api.customRoute("getUserDetails", {});
        const user = response.user;
        
        if (!user) {
          signOut();
          return;
        }
        
        // Update user data in localStorage
        localStorage.setItem('main_user', JSON.stringify(user));
        
        // If user is verified or not a creator, redirect
        if (user.verified || user.role !== 'Creator') {
          const redirectPath = user.role === 'Brand' 
            ? `${APP_PREFIX_PATH}/brands/dashboard`
            : `${APP_PREFIX_PATH}/creators/dashboard`;
          
          history.push(redirectPath);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Check immediately
    checkVerificationStatus();
    
    // Set up periodic check every 60 seconds
    const interval = setInterval(checkVerificationStatus, 60000);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, [token, history, signOut]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="verification-pending-container" style={{ 
      height: '100vh', 
      background: '#f0f2f5', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '0 20px' 
    }}>
      <Card style={{ maxWidth: '600px', width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Result
          icon={<ClockCircleOutlined style={{ color: '#FD5C02' }} />}
          title="Account Verification Pending"
          subTitle="Your creator account is currently under review"
        >
          <div style={{ textAlign: 'left', marginTop: '20px' }}>
            <Paragraph>
              Thank you for registering with Social Shake! Our team is currently reviewing your application.
            </Paragraph>

            <Paragraph>
              <Text strong>What happens next?</Text>
            </Paragraph>
            
            <Paragraph>
              <ul>
                <li>Our team will review your application within 1-2 business days</li>
                <li>You'll receive an email notification when your account is approved</li>
                <li>Once approved, you can log in and start creating content</li>
              </ul>
            </Paragraph>

            <Paragraph type="secondary">
              If you haven't received any update after 2 business days, please contact our support team 
              at <a href="mailto:support@socialshake.io">support@socialshake.io</a>
            </Paragraph>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <Button onClick={() => signOut()} type="default">
                Sign Out
              </Button>
              <Button type="primary" style={{ background: '#FD5C02', borderColor: '#FD5C02' }} onClick={() => window.location.reload()}>
                Check Status
              </Button>
            </div>
          </div>
        </Result>
      </Card>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { token } = auth;
  return { token };
};

const mapDispatchToProps = {
  signOut
};

export default connect(mapStateToProps, mapDispatchToProps)(VerificationPending);