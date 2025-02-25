import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Card, Drawer, Button, Row, Col, Tag, Typography, Avatar, message, Modal, Spin } from "antd";
import {
  EyeOutlined,
  EyeFilled,
  CloseOutlined,
  LikeFilled,
  LikeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Table, Space, Tabs } from "antd";
import { api } from "auth/FetchInterceptor";
import StripePaymentModal from './StripePaymentModal';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CampaignDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [campaignInfo, setCampaignInfo] = useState({});
  const [applications, setApplications] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [reload, setReload] = useState(Math.random());
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [processingApplication, setProcessingApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate total videos needed from videos_from_creator object
  const calculateTotalVideos = (videosObj) => {
    if (!videosObj) return "Not specified";
    
    const result = [];
    Object.entries(videosObj).forEach(([duration, details]) => {
      if (details.quantity && details.quantity > 0) {
        result.push(`${duration}s x${details.quantity}`);
      }
    });
    
    return result.length > 0 ? result.join(", ") : "None";
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      if (!processingApplication) return;
      
      const resp = await api.update("Applications", { 
        status: 'Hired',
        payment_intent_id: paymentIntent.id 
      }, processingApplication._id);
  
      if (resp.success) {
        await api.save("Contracts", {
          campaign_id: id,
          application_id: processingApplication._id,
          user_id: processingApplication.user_id,
          start_date: new Date(),
          end_date: new Date(processingApplication.deadline_date),
          amount: processingApplication.amount,
          status: 'In Progress',
          payment_intent_id: paymentIntent.id,
          timeline: [
            { 
              type: "contract_started", 
              data: { 
                brand_text: "You started the contract", 
                creator_text: "Brand started the contract",
                date: new Date(), 
                amount: processingApplication.amount 
              } 
            }
          ],
        });
  
        message.success('Payment completed and creator hired successfully!');
        setReload(Math.random());
      } else {
        message.error(resp.message || 'Failed to update application');
      }
    } catch (error) {
      console.error('Contract creation error:', error);
      message.error('Failed to create contract. Please try again.');
    } finally {
      setPaymentModalVisible(false);
      setProcessingApplication(null);
    }
  };

  const { confirm } = Modal;

  const BottomTables = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [activeTabKey, setActiveTabKey] = useState("all");

    const showDrawer = (details) => {
      setSelectedDetails(details);
      setDrawerVisible(true);
    };

    const closeDrawer = () => {
      setDrawerVisible(false);
      setSelectedDetails(null);
    };

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        key: "name",
        render: (text, record) => (
          <div className="name-container">
            <Avatar 
              src={record.created_by?.profile_picture} 
              className="avatar-style"
            >
              {record.created_by?.name ? 
                record.created_by.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <div className="name-details">
              <div className="name-text">{record.created_by?.name || 'Unknown User'}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Quote",
        dataIndex: "amount",
        width: "10%",
        key: "amount",
        render: (text) => <span>$ {text}</span>,
      },
      {
        title: "Details",
        dataIndex: "cover_letter",
        width: "28%",
        key: "cover_letter",
        render: (text) => (
          <span>{text ? (text.length > 50 ? text.substring(0, 50) + "..." : text) : 'No details provided'}</span>
        ),
      },
      {
        title: "Criteria",
        key: "criterias",
        dataIndex: "criterias",
        width: "35%",
        render: (criterias) => (
          <div className="criteria-container">
            {(criterias || []).map((criteria) => (
              <Tag key={criteria} className="criteria-tag">
                {criteria}
              </Tag>
            ))}
          </div>
        ),
      },
      {
        title: "Status",
        key: "status",
        width: "10%",
        dataIndex: "status",
        render: (status) => {
          let statusClass = "status-default";
          if (status === "Hired") statusClass = "status-hired";
          if (status === "Shortlisted") statusClass = "status-shortlisted";
          if (status === "Rejected") statusClass = "status-rejected";
          if (status === "Applied") statusClass = "status-applied";

          return <span className={`status-badge ${statusClass}`}>{status}</span>;
        },
      },
      {
        title: "",
        key: "action",
        width: "17%",
        render: (obj) => (
          <Space size="middle" className="action-container">
            {obj.status !== 'Hired' && (
              <>
                <Button 
                  type="text" 
                  icon={obj.status === 'Shortlisted' ? <LikeFilled style={{ color: "#16a34a" }} /> : <LikeOutlined />} 
                  onClick={() => applicationShortlist(obj._id)}
                />
              </>
            )}
            <>
              <Button
                type="text"
                icon={<EyeFilled />}
                onClick={() => showDrawer(obj)}
                style={{ cursor: "pointer" }}
              />
            </>
            {obj.status !== 'Hired' && (
              <>
                <Button 
                  type="text" 
                  icon={<CloseOutlined style={{ color: "red" }} />} 
                  onClick={() => applicationReject(obj._id)}
                />
              </>
            )}
          </Space>
        ),
      },
    ];

    const applicationReject = async (_id) => {
      try {
        const resp = await api.update("Applications", { status: 'Rejected' }, _id);
        if (resp.success) {
          message.success('Application rejected successfully');
          setReload(Math.random());
        } else {
          message.error(resp.message || 'Failed to reject application');
        }
      } catch (error) {
        console.error('Application reject error:', error);
        message.error('Failed to reject application');
      }
    };

    const applicationShortlist = async (_id) => {
      try {
        const resp = await api.update("Applications", { status: 'Shortlisted' }, _id);
        if (resp.success) {
          message.success('Application shortlisted successfully');
          setReload(Math.random());
        } else {
          message.error(resp.message || 'Failed to shortlist application');
        }
      } catch (error) {
        console.error('Application shortlist error:', error);
        message.error('Failed to shortlist application');
      }
    };

    const onTabChange = (key) => {
      setActiveTabKey(key);
    };

    const ContentTable = () => {
      return (
        <Table
          columns={columns}
          dataSource={applications.filter((item) => {
            if (activeTabKey === 'all') return true;
            return item.status.toLowerCase() === activeTabKey.toLowerCase();
          })}
          rowKey="_id"
          pagination={applications.length > 10 ? {
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} applications`,
          } : false}
          loading={loading}
        />
      );
    };

    const tabItems = [
      {
        key: "all",
        label: (
          <>
            All<span className="ml-2 status-badge status-default">{applications.length}</span>
          </>
        ),
      },
      {
        key: "applied",
        label: (
          <>
            Applied<span className="ml-2 status-badge status-applied">
              {applications.filter((item) => item.status === "Applied").length}
            </span>
          </>
        ),
      },
      {
        key: "shortlisted",
        label: (
          <>
            Shortlisted
            <span className="ml-2 text-blue-600 status-badge status-shortlisted">
              {applications.filter((item) => item.status === "Shortlisted").length}
            </span>
          </>
        ),
      },
      {
        key: "hired",
        label: (
          <>
            Hired
            <span className="ml-2 text-green-600 status-badge status-hired">
              {applications.filter((item) => item.status === "Hired").length}
            </span>
          </>
        ),
      },
      {
        key: "rejected",
        label: (
          <>
            Rejected
            <span className="ml-2 text-red-600 status-badge status-rejected">
              {applications.filter((item) => item.status === "Rejected").length}
            </span>
          </>
        ),
      },
    ];

    return (
      <div className="p-4 campaign-detail-tables">
        <Drawer
          title={null}
          placement="right"
          onClose={closeDrawer}
          visible={drawerVisible}
          width={450}
          className="custom-drawer"
        >
          {selectedDetails && (
            <div>
              <span
                className={`status-badge status-${selectedDetails.status.toLowerCase()}`}
                style={{ display: "inline-block", marginBottom: "16px" }}
              >
                {selectedDetails.status}
              </span>
              {/* User Details */}
              <div className="name-container mt-4 mb-3">
                <Avatar
                  src={selectedDetails.created_by?.profile_picture}
                  className="avatar-style"
                >
                  <span className="avatar-text">
                    {selectedDetails.created_by?.name ? selectedDetails.created_by.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </Avatar>
                <div className="name-details">
                  <div className="name-text">{selectedDetails.created_by?.name || 'Unknown User'}</div>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Quote:</div>
                <div style={{ width: "80%" }}>$ {selectedDetails.amount}</div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Proposed Deadline:</div>
                <div style={{ width: "80%" }}>
                  {selectedDetails.deadline_date ? formatDate(selectedDetails.deadline_date) : 'Not specified'}
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Criteria:</div>
                <div style={{ width: "80%" }}>
                  <div className="criteria-container">
                    {(selectedDetails.criterias || []).map((tag) => (
                      <Tag key={tag} className="criteria-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Details:</div>
                <div style={{ width: "80%" }}>
                  <p style={{
                    border: "1px solid #f0f0f0",
                    padding: "8px",
                    borderRadius: "4px",
                    background: "#fafafa",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}>
                    {selectedDetails.cover_letter || 'No additional details provided'}
                  </p>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Portfolio:</div>
                <div style={{ width: "80%" }}>
                  <Link
                    to={'/app/brands/portfolio/' + selectedDetails.created_by?._id}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="portfolio-link"
                  >
                    View Profile ↗
                  </Link>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedDetails.status !== 'Hired' && (
                <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                  <Button
                    type="primary"
                    style={{ background: "#f97316", border: "none" }}
                    onClick={() => {
                      setProcessingApplication(selectedDetails);
                      setPaymentModalVisible(true);
                    }}
                  >
                    Hire
                  </Button>
                  <Button
                    type="default"
                    style={{ background: "#e0f2fe", color: "#0284c7" }}
                    onClick={() => applicationShortlist(selectedDetails._id)}
                  >
                    Shortlist
                  </Button>
                  <Button
                    type="default"
                    style={{ background: "#fee2e2", color: "#b91c1c" }}
                    onClick={() => applicationReject(selectedDetails._id)}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </Drawer>
        <Tabs
          defaultActiveKey="all"
          onChange={onTabChange}
        >
          {tabItems.map((item) => (
            <TabPane tab={item.label} key={item.key}>
              <ContentTable />
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  };

  const getCampaignDetails = async () => {
    try {
      setLoading(true);
      
      // Get campaign details
      const campaignResp = await api.getSingle('Campaigns', { _id: id });
      
      // Get contracts for this campaign
      const contractsResponse = await api.get('Contracts', {
        tabFilter: { campaign_id: id }
      });
      
      // Get applications for this campaign
      const applicationsResponse = await api.get('Applications', {
        tabFilter: { campaign_id: id }
      });
      
      if (campaignResp && campaignResp.data) {
        setCampaignInfo(campaignResp.data);
      }
      
      if (contractsResponse && contractsResponse.data) {
        setContracts(contractsResponse.data.data || []);
      }
      
      if (applicationsResponse && applicationsResponse.data) {
        setApplications(applicationsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      message.error('Failed to load campaign data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getCampaignDetails();
    } else {
      history.goBack();
    }
  }, [id, reload]);

  if (loading && !campaignInfo._id) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }

  return (
    <>
      <div className="campaign-container">
        <div className="campaign-header">
          <Title level={2}>
            {campaignInfo.campaign_name || 'Campaign Details'}
          </Title>
          <Link to={`campaign-info/${id}`}>
            <Button className="secondary-color-btn">
              <span>View Campaign Info</span> <EyeOutlined />
            </Button>
          </Link>
        </div>
        <Text className="breadcrumb">
          Campaigns<span className="mx-2">•</span> All Campaigns<span className="mx-2">•</span> 
          <span className="prm-color">{campaignInfo.campaign_name || 'Campaign Details'}</span>
        </Text>
        
        {/* Display hired creators */}
        <Row gutter={[24, 24]} className="project-grid">
          {contracts.length > 0 ? (
            contracts.map((contract) => (
              <div
                className="project-card"
                style={{ display: "flex" }}
                key={contract._id}
              >
                <div
                  style={{
                    width: "23%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar 
                    src={contract.user?.profile_picture} 
                    size={50}
                    style={{ backgroundColor: '#f56a00' }}
                  >
                    {contract.user?.name ? contract.user.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </div>
                <div style={{ width: "77%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>
                      <Tag color="green" className="status-tag">
                        {contract.status || 'Hired'}
                      </Tag>
                    </span>
                    <span>
                      <Text className="price">
                        ${contract.amount}
                      </Text>
                    </span>
                  </div>
                  <div>
                    <Text className="name mt-2 mb-2">{contract.user?.name || 'Creator'}</Text>
                    <Text className="deadline d-block mb-2">
                      Deadline: {contract.end_date ? formatDate(contract.end_date) : 'Not specified'}
                    </Text>
                    <Link to={"view-project/" + contract._id} className="view-project-btn">
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-contracts-message">
              No creators hired yet. Review applications below to hire creators.
            </div>
          )}
        </Row>
      </div>
      
      {/* Applications table */}
      <BottomTables />
      
      {/* Payment modal */}
      <StripePaymentModal
        visible={paymentModalVisible}
        amount={processingApplication?.amount || 0}
        onSuccess={handlePaymentSuccess}
        onCancel={() => {
          setPaymentModalVisible(false);
          setProcessingApplication(null);
        }}
      />
    </>
  );
};

export default CampaignDetail;