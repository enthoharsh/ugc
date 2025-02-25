import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal, Input, message, Tooltip, Typography } from 'antd';
import { DollarOutlined, CheckCircleOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Text } = Typography;

const AdminContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [currentContract, setCurrentContract] = useState(null);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [search, setSearch] = useState('');
  const [paymentIdValue, setPaymentIdValue] = useState('');

  // Fetch contracts
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const response = await api.get('Contracts', {
        tabFilter: { 
          status: 'Completed',
          payment_status: { $ne: 'Paid' } // Fetch contracts that aren't marked as paid
        }
      });
      
      if (response.data && response.data.data) {
        setContracts(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch contracts');
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  // Open payment modal
  const showPaymentModal = (contract) => {
    setCurrentContract(contract);
    setPaymentNotes('');
    setPaymentIdValue('');
    setPaymentModalVisible(true);
  };

  // Handle payment confirmation
  const handlePaymentConfirmation = async () => {
    try {
      if (!currentContract) return;
      
      const paymentData = {
        contract_id: currentContract._id,
        payment_reference_id: paymentIdValue,
        payment_notes: paymentNotes,
        amount: currentContract.amount,
        status: 'Completed',
        description: `Payment for contract #${currentContract._id}`,
        user_id: currentContract.user_id
      };
      
      // Create payment record
      const paymentResponse = await api.save('Payments', paymentData);
      
      if (paymentResponse.success) {
        // Update contract with payment status
        const contractUpdateResponse = await api.update('Contracts', {
          _id: currentContract._id,
          payment_status: 'Paid',
          payment_id: paymentResponse.data._id,
          payment_date: new Date(),
          payment_notes: paymentNotes,
          payment_reference_id: paymentIdValue
        }, currentContract._id);
        
        if (contractUpdateResponse.success) {
          message.success('Payment marked as processed successfully');
          setPaymentModalVisible(false);
          fetchContracts(); // Refresh the list
        } else {
          message.error('Failed to update contract payment status');
        }
      } else {
        message.error('Failed to create payment record');
      }
    } catch (error) {
      message.error('An error occurred while processing payment');
      console.error('Error processing payment:', error);
    }
  };

  // Filter contracts based on search
  const filteredContracts = contracts.filter(contract => {
    return search === '' || 
      contract.campaign?.campaign_name?.toLowerCase().includes(search.toLowerCase()) || 
      contract.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      contract.user?.email?.toLowerCase().includes(search.toLowerCase());
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Table columns
  const columns = [
    {
      title: 'Contract ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <Text copyable>{id.substring(0, 8)}...</Text>,
    },
    {
      title: 'Campaign',
      dataIndex: 'campaign',
      key: 'campaign',
      render: (campaign) => campaign?.campaign_name || 'N/A',
    },
    {
      title: 'Creator',
      key: 'creator',
      render: (_, record) => (
        <span>
          {record.user?.name || 'Unknown'} 
          <br />
          <small>{record.user?.email || ''}</small>
        </span>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Completion Date',
      key: 'completionDate',
      render: (_, record) => {
        // Find the completion date from the timeline
        const completionEvent = record.timeline?.find(event => 
          event.type === 'project_completed' || event.data?.status === 'Completed'
        );
        return formatDate(completionEvent?.data?.date || record.updatedAt);
      },
    },
    {
      title: 'Payment Status',
      key: 'payment_status',
      render: (_, record) => (
        <Tag color={record.payment_status === 'Paid' ? 'green' : 'volcano'}>
          {record.payment_status || 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<DollarOutlined />} 
            onClick={() => showPaymentModal(record)}
            disabled={record.payment_status === 'Paid'}
          >
            Process Payment
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-contracts">
      <h2>Contract Payment Management</h2>
      
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search campaigns or creators"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredContracts} 
        rowKey="_id"
        loading={loading}
      />

      {/* Payment Processing Modal */}
      <Modal
        title="Process Payment"
        visible={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        onOk={handlePaymentConfirmation}
        okText="Confirm Payment"
        okButtonProps={{ 
          icon: <CheckCircleOutlined />,
          disabled: !paymentIdValue.trim()
        }}
      >
        {currentContract && (
          <div>
            <p><strong>Campaign:</strong> {currentContract.campaign?.campaign_name || 'N/A'}</p>
            <p><strong>Creator:</strong> {currentContract.user?.name || 'Unknown'}</p>
            <p><strong>Email:</strong> {currentContract.user?.email || 'N/A'}</p>
            <p><strong>Amount to Pay:</strong> ${currentContract.amount.toFixed(2)}</p>
            
            <div style={{ marginTop: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  Payment Reference ID:
                  <Tooltip title="Enter the transaction ID from your payment system">
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </label>
                <Input 
                  placeholder="Transaction ID / Reference Number" 
                  value={paymentIdValue}
                  onChange={e => setPaymentIdValue(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 8 }}>Payment Notes (optional):</label>
                <Input.TextArea 
                  rows={4}
                  placeholder="Enter any additional payment details" 
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminContracts;