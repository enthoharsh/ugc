import React, { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Statistic, Button, Progress, 
  Typography, Tag, List, Empty, Avatar, Badge, Spin, Space
} from 'antd';
import { 
  DollarOutlined, ProjectOutlined, CheckCircleOutlined, 
  EyeOutlined, RiseOutlined, UserOutlined, StarOutlined
} from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Title, Text } = Typography;

const CreatorDashboard = () => {
  // State for dynamic data
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [marketplaceProjects, setMarketplaceProjects] = useState([]);
  const [portfolioData, setPortfolioData] = useState({});
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeContracts: 0,
    completedProjects: 0,
    pendingPayouts: 0,
  });

  // Get user from localStorage for personalization
  const user = JSON.parse(localStorage.getItem("main_user") || '{"name":"Creator"}');

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

  // Navigate to different pages
  const navigateTo = (path) => {
    window.location.href = path;
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch contracts
        const contractsResponse = await api.get("Contracts", {
          tabFilter: { user_id: user._id }
        });
        
        // Fetch applications
        const applicationsResponse = await api.get("Applications", {
          tabFilter: { user_id: user._id }
        });
        
        // Fetch marketplace projects (campaigns)
        const campaignsResponse = await api.get("Campaigns", {
          limit: 100 // Get all available campaigns
        });
        
        // Fetch portfolio data
        const portfolioResponse = await api.get("Portfolios", {
          tabFilter: { user_id: user._id }
        });
        
        // Process contracts data
        if (contractsResponse?.data?.data) {
          const contractsData = contractsResponse.data.data || [];
          setContracts(contractsData);
          
          // Calculate stats
          const totalEarnings = contractsData.reduce((sum, contract) => 
            sum + (contract.amount || 0), 0);
          
          const activeContracts = contractsData.filter(
            contract => contract.status === 'In Progress'
          ).length;
          
          const completedProjects = contractsData.filter(
            contract => contract.status === 'Completed'
          ).length;
          
          const pendingPayouts = contractsData
            .filter(contract => 
              contract.status === 'Completed' && 
              contract.payment_status !== 'Paid'
            )
            .reduce((sum, contract) => sum + (contract.amount || 0), 0);
          
          setStats({
            totalEarnings,
            activeContracts,
            completedProjects,
            pendingPayouts
          });
        }
        
        // Process applications data
        if (applicationsResponse?.data?.data) {
          setApplications(applicationsResponse.data.data || []);
        }
        
        // Process marketplace projects
        if (campaignsResponse?.data?.data) {
          // Filter out campaigns that the creator has already applied to
          const appliedCampaignIds = applications.map(app => app.campaign_id);
          
          const availableProjects = campaignsResponse.data.data
            .filter(campaign => !appliedCampaignIds.includes(campaign._id));
            
          setMarketplaceProjects(availableProjects);
        }
        
        // Process portfolio data
        if (portfolioResponse?.data?.data && portfolioResponse.data.data.length > 0) {
          setPortfolioData(portfolioResponse.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate portfolio completeness score
  const calculatePortfolioCompleteness = () => {
    if (!portfolioData || Object.keys(portfolioData).length === 0) return 0;
    
    let score = 0;
    let totalFields = 0;
    
    // Check all important portfolio fields
    const fieldsToCheck = [
      'bio', 'gender', 'age', 'country', 'available',
      'social_links', 'portfolio_links', 'rates', 'videos'
    ];
    
    fieldsToCheck.forEach(field => {
      totalFields++;
      
      if (field === 'social_links' || field === 'portfolio_links') {
        if (portfolioData[field] && portfolioData[field].length > 0) {
          score++;
        }
      } else if (field === 'rates' || field === 'videos') {
        if (portfolioData[field] && portfolioData[field].length > 0) {
          score++;
        }
      } else if (portfolioData[field]) {
        score++;
      }
    });
    
    return Math.round((score / totalFields) * 100);
  };

  // Calculate application success rate
  const calculateApplicationSuccessRate = () => {
    if (!applications || applications.length === 0) return 0;
    
    const hiredApplications = applications.filter(app => 
      app.status === 'Hired'
    ).length;
    
    return Math.round((hiredApplications / applications.length) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Portfolio completeness and application success rate
  const portfolioCompleteness = calculatePortfolioCompleteness();
  const proposalSuccessRate = calculateApplicationSuccessRate();

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
            {contracts.length > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center' }}>
                <RiseOutlined style={{ color: colors.success, marginRight: '4px' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Latest: ${contracts[0]?.amount?.toFixed(2) || '0.00'} on {formatDate(contracts[0]?.createdAt)}
                </Text>
              </div>
            )}
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
              <Button 
                type="link" 
                style={{ paddingLeft: 0, fontSize: '12px' }}
                onClick={() => navigateTo('/app/creators/all-contracts')}
              >
                View all contracts
              </Button>
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
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {stats.completedProjects > 0 
                  ? `${Math.round((stats.completedProjects / (stats.completedProjects + stats.activeContracts)) * 100)}% completion rate` 
                  : 'No completed projects yet'
                }
              </Text>
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
              {stats.pendingPayouts > 0 ? (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Payments in processing
                </Text>
              ) : (
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  No pending payouts
                </Text>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} md={16}>
          <Card 
            title={<span style={{ color: colors.text }}>Recent Contracts</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            extra={
              <Button 
                type="primary" 
                ghost
                onClick={() => navigateTo('/app/creators/all-contracts')}
              >
                View All
              </Button>
            }
            bodyStyle={{ padding: contracts.length ? '0' : '24px' }}
          >
            {contracts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={contracts.slice(0, 5)}
                renderItem={contract => (
                  <List.Item
                    style={{ padding: '16px 24px' }}
                    actions={[
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => navigateTo(`/app/creators/view-contract/${contract._id}`)}
                      >
                        View
                      </Button>
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
                          <div style={{ marginBottom: '4px' }}>Amount: <span style={{ fontWeight: 500 }}>${contract.amount?.toFixed(2) || '0.00'}</span></div>
                          <Tag color={
                            contract.status === 'Completed' ? 'green' : 
                            contract.status === 'In Progress' ? 'blue' : 
                            'default'
                          }>
                            {contract.status || 'Unknown'}
                          </Tag>
                          {contract.payment_status && (
                            <Tag color={
                              contract.payment_status === 'Paid' ? 'green' : 
                              contract.payment_status === 'Pending Release' ? 'orange' : 
                              'gold'
                            } style={{ marginLeft: '5px' }}>
                              {contract.payment_status}
                            </Tag>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty 
                description={
                  <div>
                    <p>No contracts found</p>
                    <Button 
                      type="primary"
                      onClick={() => navigateTo('/app/creators/marketplace')}
                    >
                      Browse Marketplace
                    </Button>
                  </div>
                } 
              />
            )}
          </Card>
          
          <Card 
            title={<span style={{ color: colors.text }}>Your Applications</span>}
            style={{ borderRadius: '8px' }}
            extra={
              <Button 
                type="primary" 
                ghost
                onClick={() => navigateTo('/app/creators/marketplace')}
              >
                Browse More
              </Button>
            }
            bodyStyle={{ padding: applications.length ? '0' : '24px' }}
          >
            {applications.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={applications.slice(0, 5)}
                renderItem={application => (
                  <List.Item
                    style={{ padding: '16px 24px' }}
                    actions={[
                      application.status === 'Hired' ? (
                        <Button 
                          type="link"
                          onClick={() => {
                            // Find the contract related to this application
                            const relatedContract = contracts.find(c => 
                              c.application_id === application._id
                            );
                            
                            if (relatedContract) {
                              navigateTo(`/app/creators/view-contract/${relatedContract._id}`);
                            } else {
                              navigateTo('/app/creators/all-contracts');
                            }
                          }}
                        >
                          View Contract
                        </Button>
                      ) : (
                        <Tag color={
                          application.status === 'Shortlisted' ? 'blue' :
                          application.status === 'Rejected' ? 'red' :
                          'orange'
                        }>
                          {application.status}
                        </Tag>
                      )
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          src={application.campaign?.product_brand_logo} 
                          style={{ border: '2px solid #f0f0f0' }}
                        />
                      }
                      title={
                        <span style={{ fontWeight: 500 }}>
                          {application.campaign?.campaign_name || 'Unnamed Campaign'}
                        </span>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '4px' }}>
                            Brand: {application.campaign?.brand_name || 'Unknown'}
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            Your Quote: <span style={{ fontWeight: 500 }}>${application.amount?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div>
                            Applied on: {formatDate(application.createdAt)}
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
                  <div>
                    <p>No applications submitted yet</p>
                    <Button 
                      type="primary"
                      onClick={() => navigateTo('/app/creators/marketplace')}
                    >
                      Browse Opportunities
                    </Button>
                  </div>
                } 
              />
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card 
            title={<span style={{ color: colors.text }}>Profile Stats</span>}
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
                <Button 
                  type="primary" 
                  ghost 
                  size="small"
                  onClick={() => navigateTo('/app/creators/portfolio')}
                >
                  Complete your portfolio
                </Button>
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
            title={<span style={{ color: colors.text }}>Portfolio Setup</span>}
            style={{ marginBottom: 24, borderRadius: '8px' }}
            bodyStyle={{ padding: '24px' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                {
                  title: 'Upload Videos',
                  description: 'Showcase your best work to brands',
                  completed: portfolioData.videos && portfolioData.videos.length > 0,
                  action: () => navigateTo('/app/creators/portfolio')
                },
                {
                  title: 'Set Your Rates',
                  description: 'Define your pricing structure',
                  completed: portfolioData.rates && portfolioData.rates.length > 0,
                  action: () => navigateTo('/app/creators/portfolio')
                },
                {
                  title: 'Add Social Links',
                  description: 'Connect your social media profiles',
                  completed: portfolioData.social_links && portfolioData.social_links.length > 0,
                  action: () => navigateTo('/app/creators/portfolio')
                },
                {
                  title: 'Complete Bio',
                  description: 'Tell brands about yourself',
                  completed: !!portfolioData.bio,
                  action: () => navigateTo('/app/creators/portfolio')
                }
              ]}
              renderItem={item => (
                <List.Item
                  actions={[
                    item.completed ? (
                      <CheckCircleOutlined style={{ color: colors.success, fontSize: '20px' }} />
                    ) : (
                      <Button 
                        type="link"
                        onClick={item.action}
                      >
                        Complete
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
          
          <Card 
            title={<span style={{ color: colors.text }}>Marketplace Opportunities</span>}
            style={{ borderRadius: '8px' }}
            extra={
              <Button 
                type="primary" 
                ghost
                onClick={() => navigateTo('/app/creators/marketplace')}
              >
                Browse All
              </Button>
            }
            bodyStyle={{ padding: marketplaceProjects.length ? '0' : '24px' }}
          >
            {marketplaceProjects.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={marketplaceProjects.slice(0, 3)}
                renderItem={project => (
                  <List.Item
                    style={{ padding: '16px 24px' }}
                    actions={[
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => navigateTo(`/app/creators/marketplace/view-project/${project._id}`)}
                      >
                        Details
                      </Button>
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
                        <span style={{ fontWeight: 500 }}>
                          {project.campaign_name || 'Unnamed Campaign'}
                        </span>
                      }
                      description={
                        <div>
                          <div style={{ marginBottom: '4px' }}>Brand: {project.brand_name || 'Unknown'}</div>
                          <div>
                            <Tag color="blue">{project.video_type || 'Video'}</Tag>
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