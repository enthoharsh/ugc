import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, InputNumber, notification } from 'antd';
import { DollarOutlined, SendOutlined } from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CreateInvoice = ({ paypalAccount }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCreateInvoice = async (values) => {
    try {
      setLoading(true);
      const response = await api.customRoute("createInvoice", {
        recipient_email: values.recipient_email,
        amount: values.amount,
        description: values.description
      });

      if (response.success) {
        notification.success({
          message: 'Invoice Created',
          description: 'The invoice has been created and sent successfully!'
        });
        form.resetFields();
      }
    } catch (error) {
      console.error("Failed to create invoice:", error);
      notification.error({
        message: 'Invoice Creation Failed',
        description: error.response?.data?.message || 'There was an error creating the invoice. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!paypalAccount?.connected) {
    return (
      <Card className="mb-4">
        <Title level={4}>
          <DollarOutlined className="mr-2" />
          Create Invoice
        </Title>
        
        <Alert
          message="PayPal Account Required"
          description="You need to connect your PayPal account first to create invoices."
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <Title level={4}>
        <DollarOutlined className="mr-2" />
        Create Invoice
      </Title>
      
      <Text className="mb-4 block">
        Create an invoice using your connected PayPal account ({paypalAccount.email}).
        The invoice will be sent directly to the recipient's email address.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateInvoice}
      >
        <Form.Item
          label="Recipient Email"
          name="recipient_email"
          rules={[
            { required: true, message: 'Please enter recipient email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input placeholder="Enter recipient's email address" />
        </Form.Item>

        <Form.Item
          label="Amount (USD)"
          name="amount"
          rules={[{ required: true, message: 'Please enter an amount' }]}
        >
          <InputNumber
            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={value => value.replace(/\$\s?|(,*)/g, '')}
            min={1}
            step={0.01}
            precision={2}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea 
            rows={4} 
            placeholder="What is this invoice for?"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            icon={<SendOutlined />}
          >
            Create and Send Invoice
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateInvoice;