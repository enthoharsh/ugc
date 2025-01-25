import React, { useEffect, useState } from "react";
import { useParams,useHistory } from 'react-router-dom';
import { Card, Drawer, Button, Row, Col, Tag, Typography, Avatar, message } from "antd";
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
    const showDrawer = (details) => {
      setSelectedDetails(details);
      setDrawerVisible(true);
    };
  
    const closeDrawer = () => {
      setDrawerVisible(false);
      setSelectedDetails(null);
    };
    const data = [
      {
        key: "1",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Reviewing",
        isLike: true,
      },
      {
        key: "2",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "6",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "7",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "8",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "9",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "10",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "11",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Applied",
        isLike: false,
      },
      {
        key: "12",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Rejected",
        isLike: false,
      },
      {
        key: "13",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "14",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "3",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "4",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      {
        key: "5",
        name: "Colten Aguilar",
        location: "Indonesia",
        quote: "$300",
        details: "Lorem project cover letter....",
        criteria: ["English", "Asian", "Pets", "Mandarin", "Pool"],
        status: "Hired",
        isLike: false,
      },
      // Add more data as needed
    ];
  
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        width: "20%",
        key: "name",
        render: (text, record) => (
          <div className="name-container">
            <Avatar src={"https://i.pravatar.cc/101"} className="avatar-style">
              <span className="avatar-text">CA</span>
            </Avatar>
            <div className="name-details">
              <div className="name-text">{text}</div>
              <div className="location-text">{record.location}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Quote",
        dataIndex: "quote",
        width: "10%",
        key: "quote",
      },
      {
        title: "Details",
        dataIndex: "details",
        width: "28%",
        key: "details",
      },
      {
        title: "Criteria",
        key: "criteria",
        dataIndex: "criteria",
        width: "35%",
        render: (tags) => (
          <div className="criteria-container">
            {tags.map((tag) => (
              <Tag key={tag} className="criteria-tag">
                {tag}
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
          if (status === "Reviewing") statusClass = "status-reviewing";
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
            <>
              {!obj.isLike ? (
                <LikeOutlined onClick={()=>applicationHired(obj.id||1)} />
              ) : (
                <LikeFilled style={{ color: "#16a34a" }} />
              )}
            </>
            <>
              <EyeFilled
                onClick={() => showDrawer(obj)}
                style={{ cursor: "pointer" }}
              />
            </>
            <>
              <CloseOutlined onClick={()=>applicationReject(obj.id||1)} style={{ color: "red" }} />
            </>
          </Space>
        ),
      },
    ];
    const applicationHired=async(userObjId)=>{
      console.log(userObjId);
      const resp = await api.update("Applications",{status:'hired',user_id:userObjId,campaign_id:id})
      if (resp.statusCode==200) {
        message.success(resp.message)
      } else {
        console.log(resp.error);
        message.error(resp.message)
      }
    }
    const applicationReject = async (userObjId) => {
      console.log(userObjId);
      const resp = await api.update("Applications",{status:'reject',user_id:userObjId,campaign_id:id})
      if (resp.statusCode==200) {
        message.success(resp.message)
      } else {
        console.log(resp.error);
        message.error(resp.message)
      }
    }
    const applicationShortlist = async (userObjId) =>{
      console.log(userObjId);
      const resp = await api.update("Applications",{status:'shortlist',user_id:userObjId,campaign_id:id})
      if (resp.statusCode==200) {
        message.success(resp.message)
      } else {
        console.log(resp.error);
        message.error(resp.message)
      }
    }
    const onTabChange = (key) => {
      console.log(key, "key");
      if (key=='all') {
        getCampaignDetails({id:id})
      } else {
        getCampaignDetails({id:id,status:key})
      }
    };
    const ContentTable = () => {
      return (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            total: 11,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
        />
      );
    };
    const tabItems = [
      {
        key: "all",
        label: (
          <>
            All<span className="ml-2 status-badge status-default">80</span>
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
              18
            </span>
          </>
        ),
        children: <ContentTable />, // Replace with actual content
      },
      {
        key: "reviewing",
        label: (
          <>
            Reviewing
            <span className="ml-2 text-blue-600 status-badge status-reviewing">
              22
            </span>
          </>
        ),
        children: <ContentTable />, // Replace with actual content
      },
      {
        key: "applied",
        label: (
          <>
            Applied<span className="ml-2 status-badge status-applied">11</span>
          </>
        ),
        children: <ContentTable />, // Replace with actual content
      },
      {
        key: "reject",
        label: (
          <>
            Rejected
            <span className="ml-2 text-red-600 status-badge status-rejected">
              32
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
                  src={"https://i.pravatar.cc/101"}
                  className="avatar-style"
                >
                  <span className="avatar-text">CA</span>
                </Avatar>
                <div className="name-details">
                  <div className="name-text">{selectedDetails.name}</div>
                  <div className="location-text">{selectedDetails.location}</div>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Quote :</div>
                <div style={{ width: "80%" }}>{selectedDetails.quote}</div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Proposed Deadline </div>
                <div style={{ width: "80%" }}>
                  {selectedDetails.proposedDeadline ? selectedDetails.proposedDeadline : "2024-12-01"}
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Criteria :</div>
                <div style={{ width: "80%" }}>
                  <div className="criteria-container">
                    {selectedDetails.criteria.map((tag) => (
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
                  Praesent egestas tristique nibh. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi.Praesent egestas tristique nibh. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi. Praesent egestas tristique nibh. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nulla facilisi.
                  </p>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
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
              </div>
  
              {/* Action Buttons */}
              <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                <Button
                  type="primary"
                  style={{ background: "#f97316", border: "none" }}
                  onClick={()=>applicationHired(selectedDetails.id || 1)}
                >
                  Hire
                </Button>
                <Button
                  type="default"
                  style={{ background: "#e0f2fe", color: "#0284c7" }}
                  onClick={()=>applicationShortlist(selectedDetails.id || 1)}
                >
                  Shortlist
                </Button>
                <Button
                  type="default"
                  style={{ background: "#fee2e2", color: "#b91c1c" }}
                  onClick={()=>applicationReject(selectedDetails.id || 1)}
                >
                  Reject
                </Button>
              </div>
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


      const getCampaignDetails = async (payload)=>{
        const resp = await api.get(`Applications`,payload);
        if (resp.statusCode==200) {
          console.log(resp)
        } else {
          console.log(resp.error);
          message.error(resp.message)
        }
      }
  useEffect(() => {
    if (id) {
      getCampaignDetails({id})
    } else {
      history.goBack()
    }
  }, [id])
  return (
    <>
      <div className="campaign-container">
        <div className="campaign-header">
          <Title level={2}>North Face Jacket Campaign</Title>
          <Link to={`campaign-info/${id}`}>
          <Button className="secondary-color-btn">
            <span>View Campaign Info</span> <EyeOutlined />
          </Button>
          </Link>
        </div>
        <Text className="breadcrumb">
          Campaigns • All Campaigns • North Face Jacket Campaign
        </Text>
        <Row gutter={[24, 24]} className="project-grid">
          {projects.map((project, index) => (
            <>
              {" "}
              <div
                className="project-card"
                style={{ display: "flex" }}
                key={project.id}
              >
                <div
                  style={{
                    width: "23%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Avatar src={project.image} size={50} />
                </div>
                <div style={{ width: "77%" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span>
                      <Tag color="green" className="status-tag">
                        {project.status}
                      </Tag>
                    </span>
                    <span>
                      <Text className="price">{project.price}</Text>
                    </span>
                  </div>
                  <div>
                    <Text className="name mt-2 mb-2">{project.name}</Text>
                    <Text className="deadline d-block mb-2">
                      Deadline: {project.deadline}
                    </Text>
                    <Link to={"view-project/1"} className="view-project-btn">
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
