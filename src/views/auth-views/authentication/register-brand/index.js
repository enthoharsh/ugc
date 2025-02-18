import React from 'react';
import { Card, Row, Col } from "antd";
import { useSelector } from 'react-redux';
import BrandRegisterForm from 'views/auth-views/components/BrandRegisterForm';

const backgroundStyle = {
  backgroundImage: 'url(/img/others/img-17.jpg)',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover'
};

const RegisterOne = props => {
  const theme = useSelector(state => state.theme.currentTheme);

  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={12}> {/* Increased width for the new form */}
            <Card className="px-4 py-4">
              <div className="my-2">
                <div className="text-center mb-8">
                  <img 
                    className="img-fluid" 
                    src={`/img/${theme === 'light' ? 'logo.png': 'logo-white.png'}`} 
                    alt=""
                  />
                  <p className="text-muted mt-4">Create a new brand account:</p>
                </div>
                <Row justify="center">
                  <Col xs={24} sm={24} md={24} lg={24}>
                    <BrandRegisterForm {...props}/>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RegisterOne;