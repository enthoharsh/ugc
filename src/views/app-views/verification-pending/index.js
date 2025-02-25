import React, { useEffect } from 'react';
import { Result, Button, Typography, Card } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { Link, useHistory } from 'react-router-dom';
import { AUTH_PREFIX_PATH, APP_PREFIX_PATH } from 'configs/AppConfig';
import { connect } from 'react-redux';
import { signOut } from 'redux/actions/Auth';

const { Paragraph, Text } = Typography;

const VerificationPending = ({ signOut, token }) => {
  const history = useHistory();
  
  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (!token) {
      history.push(`${AUTH_PREFIX_PATH}/login`);
    }
    
    // Check user role and verification status from localStorage
    const user = JSON.parse(localStorage.getItem('main_user'));
    
    // If user is verified or not a creator, redirect to appropriate dashboard
    if (user) {
      if (user.verified || user.role !== 'Creator') {
        const redirectPath = user.role === 'Brand' 
          ? `${APP_PREFIX_PATH}/brands/dashboard`
          : `${APP_PREFIX_PATH}/creators/dashboard`;
        
        history.push(redirectPath);
      }
    }
  }, [token, history]);

  return (
    <div className="h-100 bg-white" style={{ padding: '40px 20px' }}>
      <Card style={{ maxWidth: '600px', margin: '0 auto', borderRadius: '12px' }}>
        <Result
          icon={<ClockCircleOutlined style={{ color: '#ff6600' }} />}
          title="Account Verification Pending"
          subTitle="Your creator account is currently under review"
        >
          <div className="mt-4">
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
                <li>Once approved, you can log in and start using the platform</li>
              </ul>
            </Paragraph>

            <Paragraph type="secondary">
              If you haven't received any update after 2 business days, please contact our support team 
              at <a href="mailto:support@socialshake.io">support@socialshake.io</a>
            </Paragraph>

            <div className="mt-4 d-flex justify-content-between">
              <Button onClick={() => signOut()} type="default">
                Sign Out
              </Button>
              <Link to={`${AUTH_PREFIX_PATH}/login`}>
                <Button type="primary">
                  Back to Login
                </Button>
              </Link>
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