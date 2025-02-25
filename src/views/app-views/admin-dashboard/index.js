import React, { useState, useEffect } from 'react';
import { 
  Typography, Card, Row, Col, Statistic, Button, Table, Tag, 
  Progress, Avatar, Space, List, Tabs, Spin, Alert
} from 'antd';
import { 
  UserOutlined, FileProtectOutlined, CheckCircleOutlined, 
  EyeOutlined, BellOutlined, DollarOutlined, RiseOutlined, TeamOutlined
} from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AdminDashboard = () => {
  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingVerifications: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    activeContracts: 0
  });

  // Define a consistent color palette matching your theme
  const colors = {
    primary: '#fd5c02',
    secondary: '#FC52E4',
    success: '#4CAF50',
    warning: '#faad14',
    danger: '#F5222D',
    info: '#1890ff',
    text: '#2C3E50',
    lightText: '#8392A5',
    background: '#F8FAFC',
  };

  // Fetch all data for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersResponse = await api.get("Users", {});
        
        // Fetch contracts
        const contractsResponse = await api.get("Contracts", {
          tabFilter: { status: 'Completed', payment_status: { $ne: 'Paid' } }
        });
        
        // Fetch campaigns
        const campaignsResponse = await api.get("Campaigns", {});
        
        // Process data
        if (usersResponse?.data?.data) {
          const usersData = usersResponse.data.data || [];
          setUsers(usersData);
          
          // Calculate stats
          const pendingVerifications = usersData.filter(user => 
            user.role === 'Creator' && user.verified === false
          ).length;
          
          setStats(prevStats => ({
            ...prevStats,
            totalUsers: usersData.length,
            pendingVerifications
          }));
        }
        
        if (contractsResponse?.data?.data) {
          const contractsData = contractsResponse.data.data || [];
          setContracts(contractsData);
          
          // Calculate revenue and payouts
          const totalRevenue = contractsData.reduce(
            (sum, contract) => sum + (contract.amount || 0),
            0
          );
          
          const pendingPayouts = contractsData
            .filter(contract => contract.payment_status !== 'Paid')
            .reduce((sum, contract) => sum + (contract.amount || 0), 0);
            
          const activeContracts = contractsData.filter(
            contract => contract.status === 'In Progress'
          ).length;
          
          setStats(prevStats => ({
            ...prevStats,
            totalRevenue,
            pendingPayouts,
            activeContracts
          }));
        }
        
        if (campaignsResponse?.data?.data) {
          setCampaigns(campaignsResponse.data.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Navigate to different pages
  const navigateTo = (path) => {
    window.location.href = path;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Recent users table columns
  const userColumns = [
    {
      title: 'Name',
      key: 'name',
      render: (_, user) => (
        <Space>
          <Avatar src={user.profile_picture} icon={<UserOutlined />} 
            style={{ backgroundColor: user.role === 'Brand' ? colors.primary : colors.secondary }} />
          <Text style={{ fontWeight: 500 }}>{user.name} {user.last_name || ''}</Text>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'Brand' ? colors.primary : role === 'Creator' ? colors.secondary : 'purple'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'verified',
      render: (_, user) => (
        <Tag color={user.verified ? 'green' : 'red'}>
          {user.verified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigateTo(`/app/admin/users`)}
        >
          View
        </Button>
      ),
    },
  ];

  // Pending payments table columns
  const paymentColumns = [
    {
      title: 'Contract ID',
      key: 'id',
      render: (_, contract) => <Text copyable>{contract._id?.substring(0, 8)}...</Text>,
    },
    {
      title: 'Creator',
      key: 'creator',
      render: (_, contract) => (
        <Space>
          <Avatar src={contract.user?.profile_picture} icon={<UserOutlined />} />
          <Text>{contract.user?.name || 'Unknown'}</Text>
        </Space>
      ),
    },
    {
      title: 'Brand',
      key: 'brand',
      render: (_, contract) => (
        <Text>{contract.campaign?.brand_name || 'Unknown'}</Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: amount => `$${amount?.toFixed(2) || '0.00'}`,
    },
    {
      title: 'Status',
      key: 'payment_status',
      render: (_, contract) => (
        <Tag color={contract.payment_status === 'Pending Release' ? 'orange' : 'volcano'}>
          {contract.payment_status || 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, contract) => (
        <Button 
          type="primary" 
          size="small"
          onClick={() => navigateTo('/app/admin/contracts')}
        >
          Process
        </Button>
      ),
    },
  ];

  return (
    <div className="admin-dashboard">
      <div className="welcome-section" style={{ marginBottom: 24, background: colors.background, padding: '24px', borderRadius: '8px' }}>
        <Title level={3} style={{ color: colors.text, marginBottom: '8px' }}>Admin Dashboard</Title>
        <Text type="secondary">Manage platform users, contracts and payments</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Total Users</span>}
              value={stats.totalUsers}
              valueStyle={{ color: colors.secondary, fontSize: '24px' }}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: '12px' }}>
              <Button 
                type="link" 
                style={{ paddingLeft: 0, fontSize: '12px' }}
                onClick={() => navigateTo('/app/admin/users')}
              >
                View all users
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Pending Verifications</span>}
              value={stats.pendingVerifications}
              valueStyle={{ color: colors.warning, fontSize: '24px' }}
              prefix={<FileProtectOutlined />}
            />
            <div style={{ marginTop: '12px' }}>
              <Button 
                type="link" 
                style={{ paddingLeft: 0, fontSize: '12px' }}
                onClick={() => navigateTo('/app/admin/users')}
              >
                Review users
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Total Revenue</span>}
              value={stats.totalRevenue}
              precision={2}
              valueStyle={{ color: colors.success, fontSize: '24px' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '12px' }}>
              <Button 
                type="link" 
                style={{ paddingLeft: 0, fontSize: '12px' }}
                onClick={() => navigateTo('/app/admin/contracts')}
              >
                View details
              </Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Pending Payouts</span>}
              value={stats.pendingPayouts}
              precision={2}
              valueStyle={{ color: colors.danger, fontSize: '24px' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '12px' }}>
              <Button 
                type="link" 
                style={{ paddingLeft: 0, fontSize: '12px' }}
                onClick={() => navigateTo('/app/admin/contracts')}
              >
                Process payments
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Card 
            title={<span style={{ color: colors.text }}>Recent Users</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            extra={
              <Button 
                type="primary" 
                ghost
                onClick={() => navigateTo('/app/admin/users')}
              >
                Manage All Users
              </Button>
            }
            bodyStyle={{ padding: '0px' }}
          >
            {users.length > 0 ? (
              <Table 
                columns={userColumns}
                dataSource={users.slice(0, 5)}
                rowKey="_id"
                pagination={false}
                size="middle"
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>No users found</div>
            )}
          </Card>
          
          <Card 
            title={<span style={{ color: colors.text }}>Pending Payments</span>}
            style={{ borderRadius: '8px' }}
            extra={
              <Button 
                type="primary" 
                ghost
                onClick={() => navigateTo('/app/admin/contracts')}
              >
                View All Payments
              </Button>
            }
            bodyStyle={{ padding: contracts.length === 0 ? '24px' : '0px' }}
          >
            {contracts.length > 0 ? (
              <Table 
                columns={paymentColumns}
                dataSource={contracts.filter(c => c.payment_status !== 'Paid').slice(0, 5)}
                rowKey="_id"
                pagination={false}
                size="middle"
              />
            ) : (
              <div style={{ padding: '20px', textAlign: 'center' }}>No pending payments</div>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={<span style={{ color: colors.text }}>Platform Status</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Active Campaigns</Text>
                <Text strong>{campaigns.filter(c => !c.is_completed).length}</Text>
              </div>
              <Progress 
                percent={Math.min(100, Math.round((campaigns.filter(c => !c.is_completed).length / Math.max(1, campaigns.length)) * 100))} 
                strokeColor={colors.primary}
              />
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Active Contracts</Text>
                <Text strong>{stats.activeContracts}</Text>
              </div>
              <Progress 
                percent={Math.min(100, Math.round((stats.activeContracts / Math.max(1, contracts.length)) * 100))} 
                strokeColor={colors.secondary}
              />
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Verified Creators</Text>
                <Text strong>
                  {users.filter(u => u.role === 'Creator' && u.verified).length} / {users.filter(u => u.role === 'Creator').length}
                </Text>
              </div>
              <Progress 
                percent={Math.min(100, Math.round((users.filter(u => u.role === 'Creator' && u.verified).length / Math.max(1, users.filter(u => u.role === 'Creator').length)) * 100))} 
                strokeColor={colors.success}
              />
            </div>
          </Card>
          
          <Card 
            title={<span style={{ color: colors.text }}>Quick Links</span>}
            style={{ borderRadius: '8px' }}
            bodyStyle={{ padding: '16px 24px' }}
          >
            <List
              split={true}
              renderItem={item => (
                <List.Item style={{ padding: '12px 0' }}>
                  {item}
                </List.Item>
              )}
              dataSource={[
                <div>
                  <Button 
                    type="link" 
                    icon={<UserOutlined />} 
                    style={{ paddingLeft: 0 }}
                    onClick={() => navigateTo('/app/admin/users')}
                  >
                    Manage Users
                  </Button>
                  <div><Text type="secondary">Approve or reject user accounts</Text></div>
                </div>,
                
                <div>
                  <Button 
                    type="link" 
                    icon={<FileProtectOutlined />} 
                    style={{ paddingLeft: 0 }}
                    onClick={() => navigateTo('/app/admin/contracts')}
                  >
                    Manage Contracts
                  </Button>
                  <div><Text type="secondary">Process payments for completed contracts</Text></div>
                </div>
              ]}
            />
          </Card>

          <Card 
            title={<span style={{ color: colors.text }}>System Notices</span>}
            style={{ marginTop: 24, borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            {stats.pendingVerifications > 0 && (
              <Alert
                message={`${stats.pendingVerifications} creator${stats.pendingVerifications !== 1 ? 's' : ''} awaiting verification`}
                description="Review and approve creators to help them start earning"
                type="warning"
                showIcon
                action={
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => navigateTo('/app/admin/users')}
                  >
                    Review
                  </Button>
                }
                style={{ marginBottom: 16 }}
              />
            )}
            
            {contracts.filter(c => c.payment_status === 'Pending Release').length > 0 && (
              <Alert
                message={`${contracts.filter(c => c.payment_status === 'Pending Release').length} payment${contracts.filter(c => c.payment_status === 'Pending Release').length !== 1 ? 's' : ''} ready for processing`}
                description="Completed contracts awaiting payment release"
                type="info"
                showIcon
                action={
                  <Button 
                    size="small" 
                    type="primary"
                    onClick={() => navigateTo('/app/admin/contracts')}
                  >
                    Process
                  </Button>
                }
              />
            )}
            
            {stats.pendingVerifications === 0 && contracts.filter(c => c.payment_status === 'Pending Release').length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircleOutlined style={{ fontSize: 32, color: colors.success, marginBottom: 16 }} />
                <div>
                  <Text>All systems operational</Text>
                </div>
                <div>
                  <Text type="secondary">No pending actions required</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;