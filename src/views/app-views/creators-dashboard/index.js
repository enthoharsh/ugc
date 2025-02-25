import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Button, Avatar, Divider, Progress, Empty } from 'antd';
import { DollarOutlined, ProjectOutlined, CheckCircleOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { api } from 'auth/FetchInterceptor';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const CreatorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeContracts: 0,
    completedProjects: 0,
    pendingPayouts: 0
  });

  const user = JSON.parse(localStorage.getItem("main_user"));

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch available projects
        const projectsResponse = await api.get("Campaigns", {
          limit: 5,
          sortColumn: "createdAt",
          sortDirection: "desc"
        });

        // Fetch creator's contracts
        const contractsResponse = await api.get("Contracts", {
          tabFilter: { user_id: user._id }
        });

        // Process data
        if (projectsResponse.data && contractsResponse.data) {
          setProjects(projectsResponse.data.data || []);
          
          const contractsData = contractsResponse.data.data || [];
          setContracts(contractsData);
          
          // Calculate statistics
          const totalEarnings = contractsData.reduce((sum, contract) => sum + (contract.amount || 0), 0);
          const activeContracts = contractsData.filter(contract => contract.status === 'In Progress').length;
          const completedProjects = contractsData.filter(contract => contract.status === 'Completed').length;
          const pendingPayouts = contractsData
            .filter(contract => contract.status === 'Completed' && !contract.payment_released)
            .reduce((sum, contract) => sum + (contract.amount || 0), 0);
          
          setStats({
            totalEarnings,
            activeContracts,
            completedProjects,
            pendingPayouts
          });
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id]);

  // Chart options for earnings
  const chartOptions = {
    options: {
      chart: {
        type: 'area',
        toolbar: {
          show: false
        }
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
      }
    },
    series: [{
      name: 'Earnings',
      data: [400, 600, 800, 950, 1100, 1200, 1250, 1300, 1450, 1550, 1700, 1850]
    }]
  };

  // Sample progress indicators
  const portfolioCompleteness = 85;
  const proposalSuccessRate = 60;

  return (
    <div className="creator-dashboard">
      <div className="welcome-section" style={{ marginBottom: 24 }}>
        <Title level={3}>Welcome back, {user.name}!</Title>
        <Text type="secondary">Here's an overview of your creator dashboard</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Earnings"
              value={stats.totalEarnings}
              precision={2}
              valueStyle={{ color: '#FC52E4' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Contracts"
              value={stats.activeContracts}
              valueStyle={{ color: '#FD5C02' }}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completed Projects"
              value={stats.completedProjects}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Payouts"
              value={stats.pendingPayouts}
              precision={2}
              valueStyle={{ color: '#faad14' }}
              prefix={<DollarOutlined />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        {/* Left Column */}
        <Col xs={24} md={16}>
          {/* Earnings Chart */}
          <Card 
            title="Monthly Earnings" 
            style={{ marginBottom: 24 }}
            extra={<Button type="link">View Details</Button>}
          >
            <Chart
              options={chartOptions.options}
              series={chartOptions.series}
              type="area"
              height={350}
            />
          </Card>

          {/* Recent Projects */}
          <Card 
            title="Recent Contracts" 
            extra={<Link to="/app/creators/all-contracts"><Button type="link">View All</Button></Link>}
          >
            {contracts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={contracts.slice(0, 5)}
                renderItem={contract => (
                  <List.Item
                    actions={[
                      <Link to={`/app/creators/view-contract/${contract._id}`}>
                        <Button type="link" icon={<EyeOutlined />}>View</Button>
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={contract.campaign?.product_brand_logo} />}
                      title={<span>{contract.campaign?.campaign_name || 'Unnamed Campaign'}</span>}
                      description={
                        <div>
                          <div>Brand: {contract.campaign?.brand_name || 'Unknown'}</div>
                          <div>Amount: ${contract.amount}</div>
                          <div>Status: <Tag color={contract.status === 'Completed' ? 'green' : contract.status === 'In Progress' ? 'blue' : 'default'}>{contract.status}</Tag></div>
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

        {/* Right Column */}
        <Col xs={24} md={8}>
          {/* Profile Completeness */}
          <Card title="Profile Completion" style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Portfolio Completeness</Text>
                <Text strong>{portfolioCompleteness}%</Text>
              </div>
              <Progress percent={portfolioCompleteness} strokeColor="#FC52E4" />
              <div style={{ marginTop: 8 }}>
                <Link to="/app/creators/portfolio">
                  <Button type="link" style={{ paddingLeft: 0 }}>Complete your portfolio</Button>
                </Link>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text>Proposal Success Rate</Text>
                <Text strong>{proposalSuccessRate}%</Text>
              </div>
              <Progress percent={proposalSuccessRate} strokeColor="#FD5C02" />
            </div>
          </Card>
          
          {/* Marketplace Opportunities */}
          <Card 
            title="Marketplace Opportunities" 
            extra={<Link to="/app/creators/marketplace"><Button type="link">Browse All</Button></Link>}
          >
            {projects.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={projects.slice(0, 3)}
                renderItem={project => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={project.product_brand_logo} />}
                      title={<Link to={`/app/creators/marketplace/view-project/${project._id}`}>{project.campaign_name}</Link>}
                      description={
                        <div>
                          <div>Brand: {project.brand_name}</div>
                          <div>
                            <Tag color="blue">{project.video_type}</Tag>
                            {project.budget && <Tag color="green">${project.campaign_budget}</Tag>}
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