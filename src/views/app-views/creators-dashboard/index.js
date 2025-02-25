import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Button, Progress, 
  Typography, Tag, List, Empty, Avatar, Badge 
} from 'antd';
import { 
  DollarOutlined, ProjectOutlined, CheckCircleOutlined, 
  EyeOutlined, RiseOutlined, UserOutlined, StarOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { api } from 'auth/FetchInterceptor';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const CreatorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 12580.50,
    activeContracts: 3,
    completedProjects: 15,
    pendingPayouts: 2450.75,
  });
  const [contracts, setContracts] = useState([]);
  const [projects, setProjects] = useState([]);

  const user = JSON.parse(localStorage.getItem("main_user") || '{"name":"Creator"}');

  // Fetch dashboard data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContracts([
        {
          _id: '1',
          campaign: {
            campaign_name: 'Summer Fashion Collection',
            brand_name: 'StyleTrend',
            product_brand_logo: 'https://via.placeholder.com/50'
          },
          amount: 1200,
          status: 'In Progress'
        },
        // Add more sample contracts as needed
      ]);
      
      setProjects([
        {
          _id: '1',
          campaign_name: 'Winter Product Launch',
          brand_name: 'CoolBrand',
          product_brand_logo: 'https://via.placeholder.com/50',
          video_type: 'Product Review',
          campaign_budget: 2000
        },
        // Add more sample projects as needed
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  // Chart options for earnings
  const chartOptions = {
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
      colors: ['#FC52E4'],
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
            return '$' + value;
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '$' + val;
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
      name: 'Earnings',
      data: [400, 600, 800, 950, 1100, 1200, 1250, 1300, 1450, 1550, 1700, 1850]
    }]
  };
  
  // Performance chart options
  const performanceOptions = {
    options: {
      chart: {
        type: 'radar',
        toolbar: {
          show: false
        }
      },
      colors: ['#FC52E4'],
      markers: {
        size: 4,
        colors: ['#FC52E4'],
        strokeWidth: 2,
      },
      fill: {
        opacity: 0.6
      },
      xaxis: {
        categories: ['Engagement', 'Quality', 'Timeliness', 'Communication', 'Creativity']
      }
    },
    series: [{
      name: 'Performance',
      data: [85, 90, 75, 95, 88]
    }]
  };

  // Sample progress indicators
  const portfolioCompleteness = 85;
  const proposalSuccessRate = 60;

  // Define a consistent color palette (matching the brand dashboard style)
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

  return (
    <div className="creator-dashboard">
      <div className="welcome-section" style={{ marginBottom: 24, background: colors.background, padding: '24px', borderRadius: '8px' }}>
        <Title level={3} style={{ color: colors.text, marginBottom: '8px' }}>Welcome back, {user.name}!</Title>
        <Text type="secondary">Here's an overview of your creator dashboard</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Total Earnings</span>}
              value={stats.totalEarnings}
              precision={2}
              valueStyle={{ color: colors.secondary, fontSize: '24px' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
              <RiseOutlined style={{ color: colors.success, marginRight: '4px' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>+15% from last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Active Contracts</span>}
              value={stats.activeContracts}
              valueStyle={{ color: colors.primary, fontSize: '24px' }}
              prefix={<ProjectOutlined />}
            />
            <div style={{ marginTop: '12px' }}>
              <Button type="link" style={{ paddingLeft: 0, fontSize: '12px' }}>View all contracts</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Completed Projects</span>}
              value={stats.completedProjects}
              valueStyle={{ color: colors.success, fontSize: '24px' }}
              prefix={<CheckCircleOutlined />}
            />
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
              <RiseOutlined style={{ color: colors.success, marginRight: '4px' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>+5 since last month</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="stat-card" bodyStyle={{ padding: '24px' }}>
            <Statistic
              title={<span style={{ color: colors.lightText }}>Pending Payouts</span>}
              value={stats.pendingPayouts}
              precision={2}
              valueStyle={{ color: colors.warning, fontSize: '24px' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
            <div style={{ marginTop: '12px' }}>
              <Button type="link" style={{ paddingLeft: 0, fontSize: '12px' }}>View payout details</Button>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Card 
            title={<span style={{ color: colors.text }}>Monthly Earnings</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            extra={<Button type="primary" ghost>View Details</Button>}
            className="chart-card"
            bodyStyle={{ padding: '12px' }}
          >
            <Chart
              options={chartOptions.options}
              series={chartOptions.series}
              type="area"
              height={350}
            />
          </Card>

          <Card 
            title={<span style={{ color: colors.text }}>Recent Contracts</span>}
            style={{ borderRadius: '8px' }}
            extra={<Link to="/app/creators/all-contracts"><Button type="primary" ghost>View All</Button></Link>}
            bodyStyle={{ padding: contracts.length ? '0' : '24px' }}
          >
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            ) : contracts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={contracts.slice(0, 5)}
                renderItem={contract => (
                  <List.Item
                    style={{ padding: '16px 24px' }}
                    actions={[
                      <Link to={`/app/creators/view-contract/${contract._id}`}>
                        <Button type="link" icon={<EyeOutlined />}>View</Button>
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={contract.campaign?.product_brand_logo}
                          style={{ border: '2px solid #f0f0f0' }}
                        />
                      }
                      title={<span style={{ fontWeight: 500 }}>{contract.campaign?.campaign_name || 'Unnamed Campaign'}</span>}
                      description={
                        <div>
                          <div style={{ marginBottom: '4px' }}>Brand: {contract.campaign?.brand_name || 'Unknown'}</div>
                          <div style={{ marginBottom: '4px' }}>Amount: <span style={{ fontWeight: 500 }}>${contract.amount}</span></div>
                          <Tag color={
                            contract.status === 'Completed' ? 'green' : 
                            contract.status === 'In Progress' ? 'blue' : 
                            'default'
                          }>
                            {contract.status}
                          </Tag>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No contracts found" />
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={<span style={{ color: colors.text }}>Performance Ratings</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <Chart
              options={performanceOptions.options}
              series={performanceOptions.series}
              type="radar"
              height={250}
            />
          </Card>

          <Card 
            title={<span style={{ color: colors.text }}>Profile Completion</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Portfolio Completeness</Text>
                <Text strong>{portfolioCompleteness}%</Text>
              </div>
              <Progress percent={portfolioCompleteness} strokeColor={colors.secondary} />
              <div style={{ marginTop: 12 }}>
                <Link to="/app/creators/portfolio">
                  <Button type="primary" ghost size="small">Complete your portfolio</Button>
                </Link>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Proposal Success Rate</Text>
                <Text strong>{proposalSuccessRate}%</Text>
              </div>
              <Progress percent={proposalSuccessRate} strokeColor={colors.primary} />
              <div style={{ marginTop: 12 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Improve your proposal success rate by applying to more relevant projects.
                </Text>
              </div>
            </div>
          </Card>
          
          <Card 
            title={<span style={{ color: colors.text }}>Marketplace Opportunities</span>}
            style={{ borderRadius: '8px' }}
            extra={<Link to="/app/creators/marketplace"><Button type="primary" ghost>Browse All</Button></Link>}
            bodyStyle={{ padding: projects.length ? '0' : '24px' }}
          >
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
            ) : projects.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={projects.slice(0, 3)}
                renderItem={project => (
                  <List.Item
                    style={{ padding: '16px 24px' }}
                    actions={[
                      <Link to={`/app/creators/marketplace/view-project/${project._id}`}>
                        <Button type="link" size="small">Details</Button>
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Badge count={<StarOutlined style={{ color: '#faad14' }} />} offset={[-5, 5]}>
                          <Avatar 
                            src={project.product_brand_logo} 
                            style={{ border: '2px solid #f0f0f0' }}
                          />
                        </Badge>
                      }
                      title={
                        <Link to={`/app/creators/marketplace/view-project/${project._id}`}>
                          {project.campaign_name}
                        </Link>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '4px' }}>Brand: {project.brand_name}</div>
                          <div>
                            <Tag color="blue">{project.video_type}</Tag>
                            {project.campaign_budget && 
                              <Tag color="green">${project.campaign_budget}</Tag>
                            }
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No opportunities found" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreatorDashboard;