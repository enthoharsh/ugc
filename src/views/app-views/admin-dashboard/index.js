import React, { useState, useEffect } from 'react';
import { 
  Typography, Card, Row, Col, Statistic, Button, Table, Tag, 
  Progress, Avatar, Badge, List, Empty, Space, Divider, Alert
} from 'antd';
import { 
  UserOutlined, FileProtectOutlined, CheckCircleOutlined, 
  EyeOutlined, BellOutlined, WarningOutlined, UserAddOutlined,
  BarChartOutlined, DollarOutlined, RiseOutlined, TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 245,
    pendingPayments: 18,
    totalRevenue: 58200.40,
    pendingApprovals: 7,
    activeContracts: 32
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Define a consistent color palette (matching the brand/creator dashboard style)
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

  // Chart options for user registrations
  const userRegistrationsOptions = {
    options: {
      chart: {
        type: 'area',
        toolbar: {
          show: false
        },
        fontFamily: 'Roboto, sans-serif',
        background: 'transparent'
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 90, 100]
        }
      },
      dataLabels: {
        enabled: false
      },
      colors: [colors.primary],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        labels: {
          style: {
            colors: '#8e8e8e'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#8e8e8e'
          },
          formatter: function (value) {
            return Math.round(value);
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return Math.round(val) + ' users';
          }
        }
      },
      grid: {
        borderColor: '#f1f1f1',
        row: {
          opacity: 0.5
        }
      }
    },
    series: [{
      name: 'User Registrations',
      data: [15, 25, 28, 38, 42, 50, 65, 80, 95, 105, 115, 130]
    }]
  };

  // Chart options for payment distribution
  const paymentDistributionOptions = {
    options: {
      chart: {
        type: 'donut',
        toolbar: {
          show: false
        }
      },
      colors: [colors.primary, colors.secondary, colors.success, colors.warning],
      labels: ['Brands', 'Creators', 'Platform Fees', 'Refunds'],
      legend: {
        position: 'bottom',
        offsetY: 0
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: function (w) {
                  return '$' + w.globals.seriesTotals.reduce((a, b) => a + b, 0).toLocaleString();
                }
              }
            }
          }
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    series: [34500, 16700, 5800, 1200]
  };
  
  // Fetch dashboard data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRecentUsers([
        {
          id: 1,
          name: 'John Smith',
          email: 'john@example.com',
          type: 'Brand',
          status: 'Pending',
          registerDate: '2025-02-20'
        },
        {
          id: 2,
          name: 'Sarah Johnson',
          email: 'sarah@example.com',
          type: 'Creator',
          status: 'Active',
          registerDate: '2025-02-18'
        },
        {
          id: 3,
          name: 'Michael Brown',
          email: 'michael@example.com',
          type: 'Creator',
          status: 'Pending',
          registerDate: '2025-02-22'
        },
        {
          id: 4,
          name: 'Tech Solutions Inc',
          email: 'contact@techsolutions.com',
          type: 'Brand',
          status: 'Active',
          registerDate: '2025-02-15'
        }
      ]);
      
      setPendingPayments([
        {
          id: 'PMT-001',
          amount: 1200.00,
          creator: 'Emma Wilson',
          brand: 'FashionNow',
          campaign: 'Summer Collection',
          dueDate: '2025-02-28'
        },
        {
          id: 'PMT-002',
          amount: 950.50,
          creator: 'Alex Richards',
          brand: 'GadgetWorld',
          campaign: 'Tech Review Series',
          dueDate: '2025-03-05'
        },
        {
          id: 'PMT-003',
          amount: 2400.00,
          creator: 'Sarah Johnson',
          brand: 'Fitness Connect',
          campaign: 'Workout Challenges',
          dueDate: '2025-02-26'
        }
      ]);
      
      setAlerts([
        {
          id: 1,
          type: 'warning',
          message: '7 new users awaiting approval',
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'info',
          message: 'System maintenance scheduled for 26 Feb, 2025',
          time: '5 hours ago'
        },
        {
          id: 3,
          type: 'success',
          message: 'Monthly financial reports are ready for review',
          time: '1 day ago'
        }
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="welcome-section" style={{ marginBottom: 24, background: colors.background, padding: '24px', borderRadius: '8px' }}>
        <Title level={3} style={{ color: colors.text, marginBottom: '8px' }}>Admin Dashboard</Title>
        <Text type="secondary">Manage platform users, contracts and payments</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Total Users</span>}
              value={stats.totalUsers}
              valueStyle={{ color: colors.secondary, fontSize: '24px' }}
              prefix={<TeamOutlined />}
              loading={loading}
            />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
              <UserAddOutlined style={{ color: colors.success, marginRight: '4px' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>+12 this week</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Pending Payments</span>}
              value={stats.pendingPayments}
              valueStyle={{ color: colors.warning, fontSize: '24px' }}
              prefix={<FileProtectOutlined />}
              loading={loading}
            />
            <div style={{ marginTop: '12px' }}>
              <Button type="link" style={{ paddingLeft: 0, fontSize: '12px' }}>Process payments</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Total Revenue</span>}
              value={stats.totalRevenue}
              precision={2}
              valueStyle={{ color: colors.success, fontSize: '24px' }}
              prefix={<DollarOutlined />}
              suffix="USD"
              loading={loading}
            />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
              <RiseOutlined style={{ color: colors.success, marginRight: '4px' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>+8.5% from last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Pending Approvals</span>}
              value={stats.pendingApprovals}
              valueStyle={{ color: colors.danger, fontSize: '24px' }}
              prefix={<WarningOutlined />}
              loading={loading}
            />
            <div style={{ marginTop: '12px' }}>
              <Button type="link" style={{ paddingLeft: 0, fontSize: '12px' }}>Review users</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Card 
            title={<span style={{ color: colors.text }}>User Registrations</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            extra={<Button type="primary" ghost>View Reports</Button>}
            bodyStyle={{ padding: '12px' }}
          >
            <Chart
              options={userRegistrationsOptions.options}
              series={userRegistrationsOptions.series}
              type="area"
              height={300}
            />
          </Card>

          <Card 
            title={<span style={{ color: colors.text }}>Recent Users</span>}
            style={{ borderRadius: '8px', marginBottom: 24 }}
            extra={<Link to="/app/admin/users"><Button type="primary" ghost>Manage All Users</Button></Link>}
            bodyStyle={{ padding: '0px' }}
          >
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            ) : (
              <Table 
                dataSource={recentUsers}
                rowKey="id"
                pagination={false}
                size="middle"
              >
                <Table.Column 
                  title="Name" 
                  dataIndex="name" 
                  render={(text, record) => (
                    <Space>
                      <Avatar icon={<UserOutlined />} style={{ backgroundColor: record.type === 'Brand' ? colors.primary : colors.secondary }} />
                      <Text style={{ fontWeight: 500 }}>{text}</Text>
                    </Space>
                  )}
                />
                <Table.Column title="Email" dataIndex="email" />
                <Table.Column 
                  title="Type" 
                  dataIndex="type" 
                  render={type => (
                    <Tag color={type === 'Brand' ? colors.primary : colors.secondary}>{type}</Tag>
                  )}
                />
                <Table.Column 
                  title="Status" 
                  dataIndex="status" 
                  render={status => (
                    <Tag color={status === 'Active' ? 'green' : 'gold'}>{status}</Tag>
                  )}
                />
                <Table.Column 
                  title="Actions" 
                  key="actions"
                  render={(_, record) => (
                    <Link to={`/app/admin/users/${record.id}`}>
                      <Button type="link" icon={<EyeOutlined />}>View</Button>
                    </Link>
                  )}
                />
              </Table>
            )}
          </Card>
          
          <Card 
            title={<span style={{ color: colors.text }}>Pending Payments</span>}
            style={{ borderRadius: '8px' }}
            extra={<Link to="/app/admin/payments"><Button type="primary" ghost>View All Payments</Button></Link>}
            bodyStyle={{ padding: loading || pendingPayments.length === 0 ? '24px' : '0px' }}
          >
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            ) : pendingPayments.length > 0 ? (
              <Table 
                dataSource={pendingPayments}
                rowKey="id"
                pagination={false}
                size="middle"
              >
                <Table.Column title="ID" dataIndex="id" />
                <Table.Column 
                  title="Amount" 
                  dataIndex="amount" 
                  render={amount => `$${amount.toFixed(2)}`}
                />
                <Table.Column title="Creator" dataIndex="creator" />
                <Table.Column title="Brand" dataIndex="brand" />
                <Table.Column 
                  title="Due Date" 
                  dataIndex="dueDate" 
                  render={(date) => {
                    const isNear = new Date(date) - new Date() < 3 * 24 * 60 * 60 * 1000;
                    return (
                      <Text style={{ color: isNear ? colors.danger : 'inherit' }}>{date}</Text>
                    );
                  }}
                />
                <Table.Column 
                  title="Actions" 
                  key="actions"
                  render={(_, record) => (
                    <Space>
                      <Button type="primary" size="small">Process</Button>
                      <Button type="link" size="small">Details</Button>
                    </Space>
                  )}
                />
              </Table>
            ) : (
              <Empty description="No pending payments" />
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={<span style={{ color: colors.text }}>Payment Distribution</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Chart
              options={paymentDistributionOptions.options}
              series={paymentDistributionOptions.series}
              type="donut"
              height={300}
            />
          </Card>

          <Card 
            title={<span style={{ color: colors.text }}>Platform Alerts</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            extra={<Button type="text" icon={<BellOutlined />} />}
            bodyStyle={{ padding: alerts.length ? '12px' : '24px' }}
          >
            {loading ? (
              <div style={{ padding: '8px', textAlign: 'center' }}>Loading...</div>
            ) : alerts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={alerts}
                renderItem={alert => (
                  <List.Item style={{ padding: '12px 12px' }}>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={
                            alert.type === 'warning' ? <WarningOutlined /> : 
                            alert.type === 'success' ? <CheckCircleOutlined /> : 
                            <BellOutlined />
                          }
                          style={{ 
                            backgroundColor: 
                              alert.type === 'warning' ? colors.warning : 
                              alert.type === 'success' ? colors.success : 
                              colors.info
                          }} 
                        />
                      }
                      title={alert.message}
                      description={<Text type="secondary">{alert.time}</Text>}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No alerts" />
            )}
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
                <Link to="/app/admin/users">
                  <Button type="link" icon={<UserOutlined />} style={{ paddingLeft: 0 }}>
                    Manage Users
                  </Button>
                  <div><Text type="secondary">Approve or reject user accounts</Text></div>
                </Link>,
                
                <Link to="/app/admin/contracts">
                  <Button type="link" icon={<FileProtectOutlined />} style={{ paddingLeft: 0 }}>
                    Manage Contracts
                  </Button>
                  <div><Text type="secondary">Process payments for completed contracts</Text></div>
                </Link>,
                
                <Link to="/app/admin/reports">
                  <Button type="link" icon={<BarChartOutlined />} style={{ paddingLeft: 0 }}>
                    Analytics Reports
                  </Button>
                  <div><Text type="secondary">View platform performance insights</Text></div>
                </Link>
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;