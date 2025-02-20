import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, Checkbox, Steps, message } from "antd";
import {
  showAuthMessage,
  showLoading,
  hideAuthMessage,
  authenticated,
  signUp,
  signIn,
} from "redux/actions/Auth";
import { useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import JwtAuthService from "services/JwtAuthService";
import { api } from "auth/FetchInterceptor";
import axios from "axios";
import { API_BASE_URL } from "configs/AppConfig";
import FirebaseService from "services/FirebaseService";

const { Option } = Select;

const BrandRegisterForm = (props) => {
  const { showLoading, signUp, loading, signIn } = props;
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const steps = [
    { title: "Basic Info" },
    { title: "Business Info" },
    { title: "Company Details" },
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
    businessName: [
      { required: true, message: "Please input your business name" },
    ],
    industry: [{ required: true, message: "Please select your industry" }],
    brandName: [
      { required: true, message: "Please input your brand/agency name" },
    ],
    companyType: [
      { required: true, message: "Please select your company type" },
    ],
    companyIndustry: [
      { required: true, message: "Please select your company industry" },
    ],
    annualRevenue: [
      { required: true, message: "Please select your annual revenue" },
    ],
    termsAccepted: [
      {
        validator: (_, value) =>
          value
            ? Promise.resolve()
            : Promise.reject("Please accept the terms of service"),
      },
    ],
  };

  const companyTypes = [
    "DTC Brand",
    "Amazon Seller",
    "Aggregator",
    "Agency",
    "Digital Services",
    "Mobile App",
    "Other",
  ];

  const industries = [
    "Apparel",
    "Beauty & Skin Care",
    "Consumer Product",
    "Electronics",
    "Food & Beverages",
    "Health & Wellness",
    "Home Goods",
    "Jewellery & Accessories",
    "Kids & Family",
    "Pets",
    "Services",
    "Software",
    "Sports",
    "Supplements",
    "Gaming",
    "CBD",
    "Fintech",
    "Other",
  ];

  const revenueRanges = [
    "<$100k",
    "$100k-$1M",
    "$1M-$10M",
    "$10M-$50M",
    ">$50M",
  ];

  const onFinish = async (values) => {
    console.log("Received values:", values);
    let finalFormData = {
      ...formData,
      ...values,
    };

    let finalFormDataNew = {
      name: finalFormData.firstName,
      last_name: finalFormData.lastName,
      email: finalFormData.email,
      phone: finalFormData.phone,
      password: finalFormData.password,
      role: "Brand",
      business_name: finalFormData.businessName,
      industry: finalFormData.industry,
      brand_name: finalFormData.brandName,
      company_type: finalFormData.companyType,
      company_industry: finalFormData.companyIndustry,
      annual_revenue: finalFormData.annualRevenue,
    };

    const res = await axios.post(
      API_BASE_URL + "/api/signup-as-brand",
      finalFormDataNew
    );
    console.log("Response:", res);

    if (res.data.success) {
      const res2 = await FirebaseService.signUpEmailRequest(
        finalFormData.email,
        finalFormData.password
      );
      console.log("Firebase response:", res2);

      if (res2.message) {
        message.error(res2.message);
      } else {
        message.success("Registration successful");
        signIn(values);
      }
    } else {
      message.error(res.data.message);
    }
    //   try {
    // 	showLoading();
    // 	const values = await form.validateFields();

    // 	// Combine all form data
    // 	const finalFormData = {
    // 	  ...formData,
    // 	  ...values
    // 	};

    // 	console.log('Complete form data:', finalFormData);

    // 	const res = await api.customRoute('signup-as-brand', finalFormData);

    // 	if (res.data.success) {
    // 		//signUp(finalFormData);
    // 	} else {
    // 		message.error(res.data.message);
    // 	}
    //   } catch (error) {
    // 	message.error('Registration failed. Please try again.');
    //   }
  };

  const next = async () => {
    try {
      const values = await form.validateFields(getFieldsForStep(currentStep));
      setFormData({ ...formData, ...values });
      setCurrentStep(currentStep + 1);
      console.log("Current accumulated data:", { ...formData, ...values });
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
        return ["businessName", "industry", "brandName"];
      case 2:
        return [
          "companyType",
          "companyIndustry",
          "annualRevenue",
          "termsAccepted",
        ];
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
      <Form.Item name="email" label="Email" rules={rules.email}>
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

  const renderBusinessInfo = () => (
    <>
      <Form.Item
        name="businessName"
        label="Business Name"
        rules={rules.businessName}
      >
        <Input prefix={<BankOutlined className="text-primary" />} />
      </Form.Item>
      <Form.Item name="industry" label="Industry" rules={rules.industry}>
        <Select placeholder="Select your industry">
          {industries.map((industry) => (
            <Option key={industry} value={industry}>
              {industry}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="brandName"
        label="Brand/Agency Name"
        rules={rules.brandName}
      >
        <Input prefix={<BankOutlined className="text-primary" />} />
      </Form.Item>
    </>
  );

  const renderCompanyDetails = () => (
    <>
      <Form.Item
        name="companyType"
        label="Company Type"
        rules={rules.companyType}
      >
        <Select placeholder="Select your company type">
          {companyTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="companyIndustry"
        label="Company Industry"
        rules={rules.companyIndustry}
      >
        <Select placeholder="Select your company industry">
          {industries.map((industry) => (
            <Option key={industry} value={industry}>
              {industry}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="annualRevenue"
        label="Annual Revenue"
        rules={rules.annualRevenue}
      >
        <Select placeholder="Select annual revenue range">
          {revenueRanges.map((range) => (
            <Option key={range} value={range}>
              {range}
            </Option>
          ))}
        </Select>
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
        return renderBusinessInfo();
      case 2:
        return renderCompanyDetails();
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
  signUp,
  showAuthMessage,
  hideAuthMessage,
  showLoading,
  authenticated,
};

export default connect(mapStateToProps, mapDispatchToProps)(BrandRegisterForm);
