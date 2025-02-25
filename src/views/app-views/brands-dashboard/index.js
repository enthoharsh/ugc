import React, { useState, useEffect } from "react";
import {
  Row, Col, Card, Typography, Statistic, Button, 
  List, Tag, Avatar, Space, Badge, Spin, Empty
} from "antd";
import {
  VideoCameraOutlined, TeamOutlined, DollarOutlined, 
  EyeOutlined, PlusOutlined, RiseOutlined, CalendarOutlined
} from "@ant-design/icons";
import { api } from 'auth/FetchInterceptor';

const { Title, Text } = Typography;

const BrandDashboard = () => {
  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalCreators: 0,
    totalSpent: 0
  });

  // Get user from localStorage for personalization
  const user = JSON.parse(localStorage.getItem("main_user") || '{}');

  // Define a consistent color palette matching your theme
  const colors = {
    primary: "#fd5c02", // Main brand color
    secondary: "#FC52E4", // Secondary accent color
    success: "#4CAF50", // Green for positive indicators
    warning: "#faad14", // Orange for warnings/neutral indicators
    danger: "#F5222D", // Red for negative indicators
    info: "#1890ff", // Blue for information
    text: "#2C3E50", // Primary text color
    lightText: "#8392A5", // Secondary text color
    background: "#F8FAFC", // Dashboard background
  };

  // Navigate to a specific route
  const navigateTo = (path) => {
    window.location.href = path;
  };

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

        // Process campaign data
        if (campaignsResponse?.data?.data) {
          const campaignsData = campaignsResponse.data.data || [];
          setCampaigns(campaignsData);

          // Fetch applications for each campaign
          const campaignIds = campaignsData.map(campaign => campaign._id);
          
          if (campaignIds.length > 0) {
            const applicationsResponse = await api.get("Applications", {
              tabFilter: { campaign_id: { $in: campaignIds } }
            });
            
            if (applicationsResponse?.data?.data) {
              setApplications(applicationsResponse.data.data || []);
            }
          }
          
          // Calculate statistics
          const activeCampaigns = campaignsData.filter(
            campaign => !campaign.is_completed && !campaign.is_cancelled
          ).length;
          
          setStats(prevStats => ({
            ...prevStats,
            totalCampaigns: campaignsData.length,
            activeCampaigns
          }));
        }
        
        // Process contract data
        if (contractsResponse?.data?.data) {
          const contractsData = contractsResponse.data.data || [];
          setContracts(contractsData);
          
          // Calculate spending
          const totalSpent = contractsData.reduce(
            (sum, contract) => sum + (contract.amount || 0),
            0
          );
          
          // Get unique creators
          const uniqueCreatorIds = new Set(
            contractsData.map(contract => contract.user_id).filter(Boolean)
          );
          
          setStats(prevStats => ({
            ...prevStats,
            totalCreators: uniqueCreatorIds.size,
            totalSpent
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id]);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      className="brand-dashboard"
      style={{
        background: colors.background,
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <div
        className="welcome-section"
        style={{
          marginBottom: 32,
          background: "white",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        }}
      >
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={3} style={{ margin: 0, color: colors.text }}>
              Welcome back, {user.name || 'Brand'}!
            </Title>
            <div style={{ marginTop: 8 }}>
              <Text style={{ color: colors.lightText }}>
                Here's a quick overview of your campaigns and contracts.
              </Text>
            </div>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigateTo('/app/brands/campaigns/order-form')}
              style={{
                background: colors.primary,
                borderColor: colors.primary,
              }}
            >
              New Campaign
            </Button>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: colors.lightText }}>Total Campaigns</Text>
              }
              value={stats.totalCampaigns}
              valueStyle={{ color: colors.primary, fontWeight: 600 }}
              prefix={<VideoCameraOutlined style={{ color: colors.primary }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: colors.lightText }}>
                  Active Campaigns
                </Text>
              }
              value={stats.activeCampaigns}
              valueStyle={{ color: colors.primary, fontWeight: 600 }}
              prefix={<Badge status="processing" color={colors.primary} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: colors.lightText }}>Total Creators</Text>
              }
              value={stats.totalCreators}
              valueStyle={{ color: colors.info, fontWeight: 600 }}
              prefix={<TeamOutlined style={{ color: colors.info }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            hoverable
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <Statistic
              title={
                <Text style={{ color: colors.lightText }}>Total Spent</Text>
              }
              value={stats.totalSpent}
              precision={2}
              valueStyle={{ color: colors.warning, fontWeight: 600 }}
              prefix={<DollarOutlined style={{ color: colors.warning }} />}
              suffix="USD"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Recent Campaigns
              </Title>
            }
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              marginBottom: 24,
            }}
            extra={
              <Button 
                type="link" 
                style={{ color: colors.primary }}
                onClick={() => navigateTo('/app/brands/campaigns/all-campaigns')}
              >
                View All
              </Button>
            }
          >
            {campaigns.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={campaigns.slice(0, 5)}
                renderItem={(campaign) => (
                  <List.Item
                    actions={[
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        style={{ color: colors.primary }}
                        onClick={() => navigateTo(`/app/brands/campaigns/campaign-detail/${campaign._id}`)}
                      >
                        View
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          src={campaign.product_brand_logo}
                        />
                      }
                      title={<Text strong>{campaign.campaign_name || 'Unnamed Campaign'}</Text>}
                      description={
                        <Space
                          direction="vertical"
                          size={2}
                          style={{ width: "100%" }}
                        >
                          <Text style={{ color: colors.text }}>
                            Product: {campaign.product_name || 'Not specified'}
                          </Text>
                          <div>
                            {campaign.campaign_budget && (
                              <Tag color={colors.warning}>
                                ${campaign.campaign_budget}
                              </Tag>
                            )}
                            {campaign.what_platforms_is_it_for &&
                              campaign.what_platforms_is_it_for.map(
                                (platform, index) => (
                                  <Tag key={index} color={colors.secondary}>
                                    {platform}
                                  </Tag>
                                )
                              )}
                          </div>
                          <div style={{ marginTop: 10 }}>
                            <Text
                              type="secondary"
                              style={{ color: colors.lightText }}
                            >
                              <RiseOutlined style={{ marginRight: 4 }} />
                              Applications:{" "}
                              {
                                applications.filter(
                                  app => app.campaign_id === campaign._id
                                ).length
                              }
                            </Text>
                          </div>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description={
                  <span>
                    No campaigns found.{" "}
                    <Button 
                      type="link"
                      style={{ color: colors.primary, padding: 0 }}
                      onClick={() => navigateTo('/app/brands/campaigns/order-form')}
                    >
                      Create one now!
                    </Button>
                  </span>
                }
              />
            )}
          </Card>

          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Application Statistics
              </Title>
            }
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            {campaigns.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={campaigns.slice(0, 3)}
                renderItem={(campaign) => {
                  const campaignApplications = applications.filter(
                    app => app.campaign_id === campaign._id
                  );
                  
                  const applied = campaignApplications.filter(app => app.status === 'Applied').length;
                  const shortlisted = campaignApplications.filter(app => app.status === 'Shortlisted').length;
                  const hired = campaignApplications.filter(app => app.status === 'Hired').length;
                  
                  return (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size="large"
                            src={campaign.product_brand_logo}
                          />
                        }
                        title={
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text strong>{campaign.campaign_name || 'Unnamed Campaign'}</Text>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Created: {formatDate(campaign.createdAt)}
                            </Text>
                          </div>
                        }
                        description={
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                            <div>
                              <Tag color="blue">Applied: {applied}</Tag>
                            </div>
                            <div>
                              <Tag color="green">Shortlisted: {shortlisted}</Tag>
                            </div>
                            <div>
                              <Tag color="purple">Hired: {hired}</Tag>
                            </div>
                            <div>
                              <Tag color="orange">Total: {campaignApplications.length}</Tag>
                            </div>
                            
                            <div style={{ width: '100%', marginTop: '5px' }}>
                              <Button 
                                type="link" 
                                style={{ padding: 0 }}
                                onClick={() => navigateTo(`/app/brands/campaigns/campaign-detail/${campaign._id}`)}
                              >
                                View Applications
                              </Button>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            ) : (
              <Empty description="No application statistics available" />
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Quick Actions
              </Title>
            }
            style={{
              marginBottom: 24,
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigateTo('/app/brands/campaigns/order-form')}
                style={{
                  background: colors.primary,
                  borderColor: colors.primary,
                  height: "40px",
                }}
              >
                Create New Campaign
              </Button>
              <Button
                onClick={() => navigateTo('/app/brands/all-contracts')}
                style={{
                  borderColor: colors.info,
                  color: colors.info,
                  height: "40px",
                }}
              >
                View Contracts
              </Button>
              <Button 
                onClick={() => navigateTo('/app/brands/account-settings')}
                style={{ height: "40px" }}
              >
                Account Settings
              </Button>
            </div>
          </Card>

          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Recent Contracts
              </Title>
            }
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
            extra={
              <Button 
                type="link" 
                style={{ color: colors.primary }}
                onClick={() => navigateTo('/app/brands/all-contracts')}
              >
                View All
              </Button>
            }
          >
            {contracts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={contracts.slice(0, 3)}
                renderItem={(contract) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          src={contract.user?.profile_picture}
                        />
                      }
                      title={
                        <Text strong style={{ color: colors.text }}>
                          {contract.user?.name || "Unknown Creator"}
                        </Text>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <Text style={{ color: colors.lightText }}>
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            Campaign: {contract.campaign?.campaign_name || 'Unknown Campaign'}
                          </Text>
                          <Text style={{ color: colors.lightText }}>
                            <DollarOutlined style={{ marginRight: 4 }} />
                            Amount: ${contract.amount?.toFixed(2) || '0.00'}
                          </Text>
                          <div>
                            <Tag
                              color={
                                contract.status === "Completed"
                                  ? colors.success
                                  : contract.status === "In Progress"
                                  ? colors.info
                                  : colors.warning
                              }
                            >
                              {contract.status || 'Unknown'}
                            </Tag>
                            <Button 
                              type="link" 
                              style={{ padding: 0, marginLeft: '10px' }}
                              onClick={() => navigateTo(`/app/brands/campaigns/view-project/${contract._id}`)}
                            >
                              View Details
                            </Button>
                          </div>
                        </Space>
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