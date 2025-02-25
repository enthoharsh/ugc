import React, { useState } from "react";
import { connect } from "react-redux";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  GlobalOutlined,
  InfoCircleOutlined,
  DollarOutlined,
  IdcardOutlined
} from "@ant-design/icons";
import { Button, Form, Input, Select, Checkbox, Steps, message, InputNumber, Radio } from "antd";
import { 
  signIn, 
  showLoading, 
  showAuthMessage, 
  hideAuthMessage
} from 'redux/actions/Auth';
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { API_BASE_URL } from "configs/AppConfig";
import FirebaseService from "services/FirebaseService";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const CreatorRegisterForm = props => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const history = useHistory();

  const { 
    hideAuthMessage,
    showLoading,
    signIn, 
    token, 
    loading,
    redirect,
    showMessage,
    message: authMessage
  } = props;

  const steps = [
    { title: "Basic Info" },
    { title: "Profile Details" },
    { title: "Rates & Terms" }
  ];

  // Form validation rules
  const rules = {
    firstName: [{ required: true, message: "Please input your first name" }],
    lastName: [{ required: true, message: "Please input your last name" }],
    email: [
      { required: true, message: "Please input your email address" },
      { type: "email", message: "Please enter a valid email!" },
    ],
    password: [{ required: true, message: "Please input your password" }],
    phone: [{ required: true, message: "Please input your phone number" }],
    bio: [{ required: true, message: "Please provide a short bio" }],
    gender: [{ required: true, message: "Please select your gender" }],
    age: [{ required: true, message: "Please input your age" }],
    country: [{ required: true, message: "Please select your country" }],
    portfolioLinks: [{ type: "array" }],
    socialLinks: [{ type: "array" }],
    gstRegistered: [{ required: true, message: "Please specify if you are GST registered" }],
    rates: [{ required: true, message: "Please specify your rates" }],
    termsAccepted: [
      {
        validator: (_, value) =>
          value
            ? Promise.resolve()
            : Promise.reject("Please accept the terms of service"),
      },
    ],
  };

  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];
  
  const countryOptions = [
    "Australia", "United States", "United Kingdom", "Canada", "New Zealand", 
    "India", "China", "Japan", "Singapore", "Germany", "France", "Brazil", 
    "South Africa", "Mexico", "Other"
  ];

  const onFinish = async (values) => {
    const finalFormData = {
      ...formData,
      ...values,
    };

    // Prepare data for API request
    const userData = {
      name: finalFormData.firstName,
      last_name: finalFormData.lastName,
      email: finalFormData.email,
      phone: finalFormData.phone,
      password: finalFormData.password,
      role: "Creator",
      bio: finalFormData.bio,
      gender: finalFormData.gender,
      age: finalFormData.age,
      country: finalFormData.country,
      portfolio_links: finalFormData.portfolioLinks,
      social_links: finalFormData.socialLinks,
      gst_registered: finalFormData.gstRegistered === "YES",
      rates: finalFormData.rates,
      verified: false // Creators start unverified by default
    };

    try {
      showLoading();
      
      // Register with our API
      const res = await axios.post(
        API_BASE_URL + "/api/signup-as-creator",
        userData
      );

      if (res.data.success) {
        // Register with Firebase
        const firebaseRes = await FirebaseService.signUpEmailRequest(
          finalFormData.email,
          finalFormData.password
        );

        if (firebaseRes.message) {
          message.error(firebaseRes.message);
        } else {
          message.success("Registration successful! Your account is pending verification.");
          
          // Sign in the user
          signIn({
            email: finalFormData.email,
            password: finalFormData.password,
          });
          
          // User will be redirected to pending verification page by the auth logic
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error('Registration failed. Please try again.');
    }
  };

  const next = async () => {
    try {
      const values = await form.validateFields(getFieldsForStep(currentStep));
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ["firstName", "lastName", "email", "password", "phone"];
      case 1:
        return ["bio", "gender", "age", "country", "portfolioLinks", "socialLinks"];
      case 2:
        return ["gstRegistered", "rates", "termsAccepted"];
      default:
        return [];
    }
  };

  const renderBasicInfo = () => (
    <>
      <Form.Item name="firstName" label="First Name" rules={rules.firstName}>
        <Input prefix={<UserOutlined className="text-primary" />} />
      </Form.Item>
      <Form.Item name="lastName" label="Last Name" rules={rules.lastName}>
        <Input prefix={<UserOutlined className="text-primary" />} />
      </Form.Item>
      <Form.Item name="email" label="Email Address" rules={rules.email}>
        <Input prefix={<MailOutlined className="text-primary" />} />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={rules.password}>
        <Input.Password prefix={<LockOutlined className="text-primary" />} />
      </Form.Item>
      <Form.Item name="phone" label="Phone Number" rules={rules.phone}>
        <Input prefix={<PhoneOutlined className="text-primary" />} />
      </Form.Item>
    </>
  );

  const renderProfileDetails = () => (
    <>
      <Form.Item name="bio" label="Bio" rules={rules.bio}>
        <TextArea 
          rows={4} 
          placeholder="Tell us about yourself and your content"
          prefix={<InfoCircleOutlined className="text-primary" />} 
        />
      </Form.Item>
      
      <Form.Item name="gender" label="Gender" rules={rules.gender}>
        <Select placeholder="Select your gender">
          {genderOptions.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item name="age" label="Age" rules={rules.age}>
        <InputNumber min={16} max={100} style={{ width: '100%' }} />
      </Form.Item>
      
      <Form.Item name="country" label="Country" rules={rules.country}>
        <Select 
          placeholder="Select your country"
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {countryOptions.map((country) => (
            <Option key={country} value={country}>
              {country}
            </Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item 
        name="portfolioLinks" 
        label="Portfolio Links (max 2)"
        tooltip="Add up to 2 links to your best work"
      >
        <Input.TextArea 
          rows={2}
          placeholder="Enter one link per line (max 2)"
        />
      </Form.Item>
      
      <Form.Item 
        name="socialLinks" 
        label="Social Links (max 5)"
        tooltip="Add up to 5 social media profile links"
      >
        <Input.TextArea 
          rows={3}
          placeholder="Enter one link per line (max 5)"
        />
      </Form.Item>
    </>
  );

  const renderRatesAndTerms = () => (
    <>
      <Form.Item 
        name="gstRegistered" 
        label="I am registered for GST" 
        rules={rules.gstRegistered}
      >
        <Radio.Group>
          <Radio value="YES">YES</Radio>
          <Radio value="NO">NO</Radio>
        </Radio.Group>
      </Form.Item>
      
      <Form.Item 
        name="rates" 
        label="Starting rate for UGC content"
        tooltip="Your minimum rate for different video lengths"
        rules={rules.rates}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '100px' }}>0-15 seconds:</span>
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: '150px' }}
              min={0}
              name="rate_15sec"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '100px' }}>15-30 seconds:</span>
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: '150px' }}
              min={0}
              name="rate_30sec"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '100px' }}>30-1 minute:</span>
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: '150px' }}
              min={0}
              name="rate_1min"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '100px' }}>1 minute+:</span>
            <InputNumber
              prefix={<DollarOutlined />}
              style={{ width: '150px' }}
              min={0}
              name="rate_1min_plus"
            />
          </div>
        </div>
      </Form.Item>
      
      <Form.Item
        name="termsAccepted"
        valuePropName="checked"
        rules={rules.termsAccepted}
      >
        <Checkbox>I accept the Terms of Service</Checkbox>
      </Form.Item>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderProfileDetails();
      case 2:
        return renderRatesAndTerms();
      default:
        return null;
    }
  };

  // Initialize form with existing data when moving back
  React.useEffect(() => {
    form.setFieldsValue(formData);
  }, [currentStep]);

  return (
    <div className="w-full">
      <Steps current={currentStep} className="mb-8">
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="vertical"
        name="register-form"
        onFinish={onFinish}
        className="mt-4"
        initialValues={formData}
      >
        {renderStepContent()}

        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <Button onClick={prev} className="mr-2">
              Previous
            </Button>
          )}
          {currentStep < steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Next
            </Button>
          )}
          {currentStep === steps.length - 1 && (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
            >
              Sign Up
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = ({ auth }) => {
  const { loading, message, showMessage, token, redirect } = auth;
  return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
  signIn,
  showAuthMessage,
  showLoading,
  hideAuthMessage
};

export default connect(mapStateToProps, mapDispatchToProps)(CreatorRegisterForm);