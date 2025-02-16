import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Card, Drawer, Button, Row, Col, Tag, Typography, Avatar, message, Modal } from "antd";
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

const { Title, Text } = Typography;

const { TabPane } = Tabs;

const CampaignDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const [campaignInfo, setCampaignInfo] = useState({});
  const [applications, setApplications] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [reload, setReload] = useState(Math.random());
  const { confirm } = Modal;

  const projects = [
    {
      id: 1,
      name: "Colten Aguilar",
      image: "https://i.pravatar.cc/100",
      status: "Hired",
      price: "$300",
      deadline: "13-04-2025",
    },
    {
      id: 2,
      name: "John Doe",
      image: "https://i.pravatar.cc/101",
      status: "Hired",
      price: "$500",
      deadline: "15-05-2025",
    },
    {
      id: 3,
      name: "Emma Watson",
      image: "https://i.pravatar.cc/102",
      status: "Hired",
      price: "$400",
      deadline: "20-06-2025",
    },
    {
      id: 4,
      name: "Alice Johnson",
      image: "https://i.pravatar.cc/103",
      status: "Hired",
      price: "$600",
      deadline: "25-07-2025",
    },
    {
      id: 5,
      name: "Colten Aguilar",
      image: "https://i.pravatar.cc/100",
      status: "Hired",
      price: "$300",
      deadline: "13-04-2025",
    },

    // Repeat the project data as needed
  ];

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
            <Avatar src={record.created_by.profile_picture} className="avatar-style">
              <span className="avatar-text">
                {record.created_by.name.charAt(0).toUpperCase()} {record.created_by.name.charAt(1).toUpperCase()}
              </span>
            </Avatar>
            <div className="name-details">
              <div className="name-text">{record.created_by.name}</div>
              {/* <div className="name-text">{record.created_by.country}</div> */}
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
        render: (text) => <span>{text.length > 50 ? text.substring(0, 50) + "..." : text}</span>,
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
            {obj.status != 'Hired' && <>
              {!obj.isLike ? (
                <LikeOutlined onClick={() => applicationShortlist(obj._id)} />
              ) : (
                <LikeFilled style={{ color: "#16a34a" }} />
              )}
            </>}
            <>
              <EyeFilled
                onClick={() => showDrawer(obj)}
                style={{ cursor: "pointer" }}
              />
            </>
            {obj.status != 'Hired' && <>
              <CloseOutlined onClick={() => applicationReject(obj._id)} style={{ color: "red" }} />
            </>}
          </Space>
        ),
      },
    ];

    const applicationHired = async (_id) => {
      confirm({
        title: 'Do you want to hire this applicant?',
        content: 'This action cannot be undone as we will create a contract for this applicant.',
        onOk() {
          const hire = async () => {
            const resp = await api.update("Applications", { status: 'Hired' }, _id);
            if (resp.success) {
              await api.save("Contracts", {
                campaign_id: id,
                application_id: _id,
                user_id: selectedDetails.created_by._id,
                start_date: new Date(),
                end_date: new Date(selectedDetails.deadline_date),
                amount: selectedDetails.amount,
                status: 'In Progress',
                timeline: [
                  { 
                    type: "contract_started", 
                    data: { 
                      brand_text: "You started the contract", 
                      creator_text: "Brand started the contract",
                      date: new Date(), 
                      amount: selectedDetails.amount 
                    } 
                  }
                ],
              });

              message.success(resp.message)
              setReload(Math.random())
            } else {
              console.log(resp.error);
              message.error(resp.message)
            }

          };

          hire();
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }

    const applicationReject = async (_id) => {
      const resp = await api.update("Applications", { status: 'Rejected' }, _id);
      if (resp.success) {
        message.success(resp.message)
        setReload(Math.random())
      } else {
        console.log(resp.error);
        message.error(resp.message)
      }
    }

    const applicationShortlist = async (_id) => {
      const resp = await api.update("Applications", { status: 'Shortlisted' }, _id);
      if (resp.success) {
        message.success(resp.message)
        setReload(Math.random())
      } else {
        message.error(resp.message)
      }
    }

    const onTabChange = (key) => {
      setActiveTabKey(key);
    };

    const ContentTable = () => {
      return (
        <Table
          columns={columns}
          dataSource={applications.filter((item) => {
            if (activeTabKey === 'all') return true;
            return item.status.toLowerCase() === activeTabKey;
          })}
        // pagination={{
        //   total: 11,
        //   pageSize: 10,
        //   showSizeChanger: true,
        //   showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        // }}
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
        children: <ContentTable />, // Replace with actual content
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
        children: <ContentTable />, // Replace with actual content
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
        children: <ContentTable />, // Replace with actual content
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
        children: <ContentTable />, // Replace with actual content
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
        children: <ContentTable />, // Replace with actual content
      },
    ];

    return (
      <div className="p-4 campaign-detail-tables">
        {/* <Tabs items={tabItems} /> */}
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
                  src={selectedDetails.created_by.profile_picture}
                  className="avatar-style"
                >
                  <span className="avatar-text">
                    {selectedDetails.created_by.name.charAt(0).toUpperCase()}{" "} {selectedDetails.created_by.name.charAt(1).toUpperCase()}
                  </span>
                </Avatar>
                <div className="name-details">
                  <div className="name-text">{selectedDetails.created_by.name}</div>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Quote :</div>
                <div style={{ width: "80%" }}>$ {selectedDetails.amount}</div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Proposed Deadline </div>
                <div style={{ width: "80%" }}>
                  {new Date(selectedDetails.deadline_date).toDateString()}
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Criteria :</div>
                <div style={{ width: "80%" }}>
                  <div className="criteria-container">
                    {selectedDetails.criterias.map((tag) => (
                      <Tag key={tag} className="criteria-tag">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Details :</div>
                <div style={{ width: "80%" }}>
                  <p style={{
                    border: "1px solid #f0f0f0",
                    padding: "8px",
                    borderRadius: "4px",
                    background: "#fafafa",
                    maxHeight: "200px",
                    overflowY: "auto",
                  }}>
                    {selectedDetails.cover_letter}
                  </p>
                </div>
              </div>
              {/* <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Portfolio :</div>
                <div style={{ width: "80%" }}>
                  <a
                    href={'https://www.google.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#d946ef" }}
                  >
                    View Profile ↗
                  </a>
                </div>
              </div> */}

              {/* Action Buttons */}
              {selectedDetails.status != 'Hired' && <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <Button
                  type="primary"
                  style={{ background: "#f97316", border: "none" }}
                  onClick={() => applicationHired(selectedDetails._id)}
                >
                  Hire
                </Button>
                <Button
                  type="default"
                  style={{ background: "#e0f2fe", color: "#0284c7" }}
                  onClick={() => applicationShortlist(selectedDetails._id)}
                >
                  Shortlisted
                </Button>
                <Button
                  type="default"
                  style={{ background: "#fee2e2", color: "#b91c1c" }}
                  onClick={() => applicationReject(selectedDetails._id)}
                >
                  Reject
                </Button>
              </div>}
            </div>
          )}
        </Drawer>
        <Tabs
          defaultActiveKey="all"
          onChange={(key) => onTabChange(key)}
        >
          {tabItems.map((item, i) => {
            return (
              <TabPane tab={item.label} key={item.key}>
                {item.children}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    );
  };

  const getCampaignDetails = async (payload) => {
    const CampaignResp = await api.getSingle(`Campaigns`, payload);

    const ContractsResponse = await api.get(`Contracts`, {
      tabFilter: { campaign_id: id }
    });

    const ApplicationsResponse = await api.get(`Applications`, {
      tabFilter: { campaign_id: id }
    });

    setCampaignInfo(CampaignResp.data)
    setContracts(ContractsResponse.data.data)
    setApplications(ApplicationsResponse.data.data)
  }

  useEffect(() => {
    if (id) {
      getCampaignDetails({
        _id: id
      })
    } else {
      history.goBack()
    }
  }, [id, reload])

  return (
    <>
      <div className="campaign-container">
        <div className="campaign-header">
          <Title level={2}>
            {campaignInfo.campaign_name}
          </Title>
          <Link to={`campaign-info/${id}`}>
            <Button className="secondary-color-btn">
              <span>View Campaign Info</span> <EyeOutlined />
            </Button>
          </Link>
        </div>
        <Text className="breadcrumb">
          Campaigns<span className="mx-2">•</span>  All Campaigns<span className="mx-2">•</span>  <span className="prm-color">{campaignInfo.campaign_name}</span>
        </Text>
        <Row gutter={[24, 24]} className="project-grid">
          {contracts.map((contract, index) => (
            <>
              {" "}
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
                  <Avatar src={contract.user.profile_picture} size={50} />
                </div>
                <div style={{ width: "77%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>
                      <Tag color="green" className="status-tag">
                        Hired
                      </Tag>
                    </span>
                    <span>
                      <Text className="price">
                        ${contract.amount}
                      </Text>
                    </span>
                  </div>
                  <div>
                    <Text className="name mt-2 mb-2">{contract.user.name}</Text>
                    <Text className="deadline d-block mb-2">
                      Deadline: {new Date(contract.end_date).toDateString()}
                    </Text>
                    <Link to={"view-project/" + contract._id} className="view-project-btn">
                      View Project
                    </Link>
                  </div>
                </div>
              </div>
            </>
          ))}
        </Row>
      </div>
      <BottomTables />
    </>
  );
};

export default CampaignDetail;
