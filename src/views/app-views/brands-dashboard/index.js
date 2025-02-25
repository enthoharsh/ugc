import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, List, Tag, Button, Avatar, Divider, Progress, Empty } from 'antd';
import { VideoCameraOutlined, TeamOutlined, CheckCircleOutlined, DollarOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { api } from 'auth/FetchInterceptor';
import Chart from 'react-apexcharts';

const { Title, Text } = Typography;

const BrandDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalCreators: 0,
    totalSpent: 0
  });

  const user = JSON.parse(localStorage.getItem("main_user"));

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch brand's campaigns
        const campaignsResponse = await api.get("Campaigns", {
          tabFilter: { created_by_id: user._id }
        });

        // Fetch brand's contracts
        const contractsResponse = await api.get("Contracts", {
          tabFilter: { created_by_id: user._id }
        });

        // Fetch applications for brand's campaigns
        const campaignIds = campaignsResponse.data?.data?.map(campaign => campaign._id) || [];
        let allApplications = [];
        
        if (campaignIds.length > 0) {
          const applicationsPromises = campaignIds.map(id => 
            api.get("Applications", { tabFilter: { campaign_id: id } })
          );
          
          const applicationsResponses = await Promise.all(applicationsPromises);
          allApplications = applicationsResponses.flatMap(response => response.data?.data || []);
        }

        // Process data
        if (campaignsResponse.data && contractsResponse.data) {
          const campaignsData = campaignsResponse.data.data || [];
          const contractsData = contractsResponse.data.data || [];
          
          setCampaigns(campaignsData);
          setContracts(contractsData);
          setApplications(allApplications);
          
          // Calculate statistics
          const activeCampaigns = campaignsData.filter(campaign => 
            !campaign.is_completed && !campaign.is_cancelled
          ).length;
          
          const totalSpent = contractsData.reduce((sum, contract) => sum + (contract.amount || 0), 0);
          
          // Get unique creators
          const uniqueCreatorIds = new Set(
            contractsData.map(contract => contract.user_id).filter(Boolean)
          );
          
          setStats({
            totalCampaigns: campaignsData.length,
            activeCampaigns,
            totalCreators: uniqueCreatorIds.size,
            totalSpent
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

  // Chart options for campaign performance
  const campaignPerformanceOptions = {
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 4
        },
      },
      dataLabels: {
        enabled: false
      },
      colors: ['#FD5C02'],
      xaxis: {
        categories: ['Campaign 1', 'Campaign 2', 'Campaign 3', 'Campaign 4', 'Campaign 5'],
        labels: {
          style: {
            colors: '#8e8e8e'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Applications'
        },
        labels: {
          style: {
            colors: '#8e8e8e'
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " applications"
          }
        }
      }
    },
    series: [{
      name: 'Applications',
      data: [12, 8, 15, 5, 10]
    }]
  };

  // Chart options for spending
  const spendingOptions = {
    options: {
      chart: {
        type: 'donut',
      },
      colors: ['#FD5C02', '#FC52E4', '#52c41a', '#faad14'],
      labels: ['Video Production', 'Social Media', 'Product Highlights', 'Testimonials'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    },
    series: [4200, 3800, 2600, 1800]
  };

  return (
    <div className="brand-dashboard">
      <div className="welcome-section" style={{ marginBottom: 24 }}>
        <Title level={3}>Welcome back, {user.name}!</Title>
        <Text type="secondary">Here's an overview of your brand dashboard</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Campaigns"
              value={stats.totalCampaigns}
              valueStyle={{ color: '#FD5C02' }}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Campaigns"
              value={stats.activeCampaigns}
              valueStyle={{ color: '#FC52E4' }}
              prefix={<VideoCameraOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Creators"
              value={stats.totalCreators}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
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
          {/* Campaign Performance */}
          <Card 
            title="Campaign Performance" 
            style={{ marginBottom: 24 }}
            extra={<Button type="link">View Details</Button>}
          >
            <Chart
              options={campaignPerformanceOptions.options}
              series={campaignPerformanceOptions.series}
              type="bar"
              height={300}
            />
          </Card>

          {/* Recent Campaigns */}
          <Card 
            title="Recent Campaigns" 
            extra={
              <Link to="/app/brands/campaigns/all-campaigns">
                <Button type="link">View All</Button>
              </Link>
            }
          >
            {campaigns.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={campaigns.slice(0, 5)}
                renderItem={campaign => (
                  <List.Item
                    actions={[
                      <Link to={`/app/brands/campaigns/campaign-detail/${campaign._id}`}>
                        <Button type="link" icon={<EyeOutlined />}>View</Button>
                      </Link>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={campaign.product_brand_logo} />}
                      title={<span>{campaign.campaign_name}</span>}
                      description={
                        <div>
                          <div>Product: {campaign.product_name}</div>
                          <div>
                            <Tag color="blue">{campaign.video_type}</Tag>
                            {campaign.campaign_budget && <Tag color="green">${campaign.campaign_budget}</Tag>}
                            {campaign.what_platforms_is_it_for && campaign.what_platforms_is_it_for.map((platform, index) => (
                              <Tag key={index}>{platform}</Tag>
                            ))}
                          </div>
                          <div style={{ marginTop: 4 }}>
                            Applications: {
                              applications.filter(app => app.campaign_id === campaign._id).length
                            }
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                description={
                  <span>
                    No campaigns found. <Link to="/app/brands/campaigns/order-form">Create one now!</Link>
                  </span>
                }
              />
            )}
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} md={8}>
          {/* Quick Actions */}
          <Card title="Quick Actions" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to="/app/brands/campaigns/order-form">
                <Button type="primary" icon={<PlusOutlined />} block>
                  Create New Campaign
                </Button>
              </Link>
              <Link to="/app/brands/all-contracts">
                <Button block>
                  View Contracts
                </Button>
              </Link>
              <Link to="/app/brands/account-settings">
                <Button block>
                  Account Settings
                </Button>
              </Link>
            </div>
          </Card>
          
          {/* Spending Breakdown */}
          <Card title="Campaign Spending Breakdown">
            <Chart
              options={spendingOptions.options}
              series={spendingOptions.series}
              type="donut"
              height={300}
            />
          </Card>
          
          {/* Recent Contracts */}
          <Card 
            title="Recent Contracts" 
            style={{ marginTop: 24 }}
            extra={
              <Link to="/app/brands/all-contracts">
                <Button type="link">View All</Button>
              </Link>
            }
          >
            {contracts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={contracts.slice(0, 3)}
                renderItem={contract => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={contract.user?.profile_picture} />}
                      title={
                        <Link to={`/app/brands/campaigns/view-project/${contract._id}`}>
                          {contract.user?.name || 'Unknown Creator'}
                        </Link>
                      }
                      description={
                        <div>
                          <div>Campaign: {contract.campaign?.campaign_name}</div>
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
      </Row>
    </div>
  );
};

export default BrandDashboard;