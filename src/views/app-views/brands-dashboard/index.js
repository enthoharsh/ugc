import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Button,
  List,
  Tag,
  Avatar,
  Empty,
  Divider,
  Space,
  Badge,
} from "antd";
import {
  VideoCameraOutlined,
  TeamOutlined,
  DollarOutlined,
  EyeOutlined,
  PlusOutlined,
  RiseOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { api } from "auth/FetchInterceptor";
import Chart from "react-apexcharts";

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
    totalSpent: 0,
  });

  const user = JSON.parse(localStorage.getItem("main_user"));

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch brand's campaigns
        const campaignsResponse = await api.get("Campaigns", {
          tabFilter: { created_by_id: user._id },
        });

        // Fetch brand's contracts
        const contractsResponse = await api.get("Contracts", {
          tabFilter: { created_by_id: user._id },
        });

        // Fetch applications for brand's campaigns
        const campaignIds =
          campaignsResponse.data?.data?.map((campaign) => campaign._id) || [];
        let allApplications = [];

        if (campaignIds.length > 0) {
          const applicationsPromises = campaignIds.map((id) =>
            api.get("Applications", { tabFilter: { campaign_id: id } })
          );

          const applicationsResponses = await Promise.all(applicationsPromises);
          allApplications = applicationsResponses.flatMap(
            (response) => response.data?.data || []
          );
        }

        // Process data
        if (campaignsResponse.data && contractsResponse.data) {
          const campaignsData = campaignsResponse.data.data || [];
          const contractsData = contractsResponse.data.data || [];

          setCampaigns(campaignsData);
          setContracts(contractsData);
          setApplications(allApplications);

          // Calculate statistics
          const activeCampaigns = campaignsData.filter(
            (campaign) => !campaign.is_completed && !campaign.is_cancelled
          ).length;

          const totalSpent = contractsData.reduce(
            (sum, contract) => sum + (contract.amount || 0),
            0
          );

          // Get unique creators
          const uniqueCreatorIds = new Set(
            contractsData.map((contract) => contract.user_id).filter(Boolean)
          );

          setStats({
            totalCampaigns: campaignsData.length,
            activeCampaigns,
            totalCreators: uniqueCreatorIds.size,
            totalSpent,
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
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadius: 4,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#FD5C02"],
      xaxis: {
        categories: [
          "Campaign 1",
          "Campaign 2",
          "Campaign 3",
          "Campaign 4",
          "Campaign 5",
        ],
        labels: {
          style: {
            colors: "#8e8e8e",
          },
        },
      },
      yaxis: {
        title: {
          text: "Applications",
        },
        labels: {
          style: {
            colors: "#8e8e8e",
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " applications";
          },
        },
      },
    },
    series: [
      {
        name: "Applications",
        data: [12, 8, 15, 5, 10],
      },
    ],
  };

  // Chart options for spending
  const spendingOptions = {
    options: {
      chart: {
        type: "donut",
      },
      colors: ["#FD5C02", "#FC52E4", "#52c41a", "#faad14"],
      labels: [
        "Video Production",
        "Social Media",
        "Product Highlights",
        "Testimonials",
      ],
      legend: {
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 300,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
    series: [4200, 3800, 2600, 1800],
  };

  // Define a consistent color palette
  const colors = {
    primary: "#fd5c02", // Main brand color
    secondary: "#FC52E4", // Secondary accent color
    success: "#4CAF50", // Green for positive indicators
    warning: "#fd5c02", // Orange for warnings/neutral indicators
    danger: "#F5222D", // Red for negative indicators
    info: "#fd5c02", // Blue for information
    text: "#2C3E50", // Primary text color
    lightText: "#8392A5", // Secondary text color
    background: "#F8FAFC", // Dashboard background
  };

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
              Welcome back, {user.name}!
            </Title>
            <div style={{ marginTop: 8 }}>
              <Text style={{ color: colors.lightText }}>
                Here's a quick overview of your campaigns and contracts.
              </Text>
            </div>
          </Col>
          <Col>
            <Link to="/app/brands/campaigns/order-form">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{
                  background: colors.primary,
                  borderColor: colors.primary,
                }}
              >
                New Campaign
              </Button>
            </Link>
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
                Campaign Performance
              </Title>
            }
            style={{
              marginBottom: 24,
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
            extra={
              <Button type="link" style={{ color: colors.primary }}>
                View Details
              </Button>
            }
          >
            <Chart
              options={{
                ...campaignPerformanceOptions.options,
                colors: [colors.primary, colors.secondary],
                theme: {
                  mode: "light",
                  palette: "palette1",
                },
                chart: {
                  ...campaignPerformanceOptions.options.chart,
                  toolbar: {
                    show: false,
                  },
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                },
                grid: {
                  borderColor: "#f1f1f1",
                },
                xaxis: {
                  ...campaignPerformanceOptions.options.xaxis,
                  labels: {
                    style: {
                      colors: colors.lightText,
                    },
                  },
                },
                yaxis: {
                  labels: {
                    style: {
                      colors: colors.lightText,
                    },
                  },
                },
              }}
              series={campaignPerformanceOptions.series}
              type="bar"
              height={300}
            />
          </Card>

          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Recent Campaigns
              </Title>
            }
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
            extra={
              <Link to="/app/brands/campaigns/all-campaigns">
                <Button type="link" style={{ color: colors.primary }}>
                  View All
                </Button>
              </Link>
            }
          >
            {campaigns.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={campaigns.slice(0, 5)}
                renderItem={(campaign) => (
                  <List.Item
                    actions={[
                      <Link
                        to={`/app/brands/campaigns/campaign-detail/${campaign._id}`}
                      >
                        <Button
                          type="link"
                          icon={<EyeOutlined />}
                          style={{ color: colors.primary }}
                        >
                          View
                        </Button>
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          src={campaign.product_brand_logo}
                        />
                      }
                      title={<Text strong>{campaign.campaign_name}</Text>}
                      description={
                        <Space
                          direction="vertical"
                          size={2}
                          style={{ width: "100%" }}
                        >
                          <Text style={{ color: colors.text }}>
                            Product: {campaign.product_name}
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
                                  (app) => app.campaign_id === campaign._id
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
                    <Link
                      to="/app/brands/campaigns/order-form"
                      style={{ color: colors.primary }}
                    >
                      Create one now!
                    </Link>
                  </span>
                }
              />
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
              <Link to="/app/brands/campaigns/order-form">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  block
                  style={{
                    background: colors.primary,
                    borderColor: colors.primary,
                    height: "40px",
                  }}
                >
                  Create New Campaign
                </Button>
              </Link>
              <Link to="/app/brands/all-contracts">
                <Button
                  block
                  style={{
                    borderColor: colors.info,
                    color: colors.info,
                    height: "40px",
                  }}
                >
                  View Contracts
                </Button>
              </Link>
              <Link to="/app/brands/account-settings">
                <Button block style={{ height: "40px" }}>
                  Account Settings
                </Button>
              </Link>
            </div>
          </Card>

          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Campaign Spending Breakdown
              </Title>
            }
            style={{
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
          >
            <Chart
              options={{
                ...spendingOptions.options,
                colors: [
                  // color should be kind of flat colors
                  "#3498db",
                  "#e74c3c",
                  "#2ecc71",
                  "#f1c40f",
                ],
                legend: {
                  position: "bottom",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                  labels: {
                    colors: colors.text,
                  },
                },
                chart: {
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                },
              }}
              series={spendingOptions.series}
              type="donut"
              height={300}
            />
          </Card>

          <Card
            title={
              <Title level={5} style={{ margin: 0 }}>
                Recent Contracts
              </Title>
            }
            style={{
              marginTop: 24,
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            }}
            extra={
              <Link to="/app/brands/all-contracts">
                <Button type="link" style={{ color: colors.primary }}>
                  View All
                </Button>
              </Link>
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
                        <Link
                          to={`/app/brands/campaigns/view-project/${contract._id}`}
                          style={{ color: colors.text }}
                        >
                          {contract.user?.name || "Unknown Creator"}
                        </Link>
                      }
                      description={
                        <Space direction="vertical" size={2}>
                          <Text style={{ color: colors.lightText }}>
                            <CalendarOutlined style={{ marginRight: 4 }} />
                            Campaign: {contract.campaign?.campaign_name}
                          </Text>
                          <Text style={{ color: colors.lightText }}>
                            <DollarOutlined style={{ marginRight: 4 }} />
                            Amount: ${contract.amount}
                          </Text>
                          <div>
                            Status:{" "}
                            <Tag
                              color={
                                contract.status === "Completed"
                                  ? colors.success
                                  : contract.status === "In Progress"
                                  ? colors.info
                                  : colors.warning
                              }
                            >
                              {contract.status}
                            </Tag>
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
