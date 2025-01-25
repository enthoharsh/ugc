import React, { useEffect, useState } from "react";
import { Drawer, Button, Tag, Typography, Avatar, message } from "antd";
import {
  EyeFilled,
  CloseOutlined,
  LikeFilled,
  LikeOutlined,RightOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Table, Space, Tabs } from "antd";
import { api } from "auth/FetchInterceptor";

const { Title, Text } = Typography;

const { TabPane } = Tabs;
const AllContracts = () => {
  const BottomTables = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [key, setKey] = useState('all')
    const showDrawer = (details) => {
      setSelectedDetails(details);
      setDrawerVisible(true);
    };
  
    const closeDrawer = () => {
      setDrawerVisible(false);
      setSelectedDetails(null);
    };
    const data1 = [
      {
        key: "1",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "2",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "3",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "Completed",
      },
      {
        key: "4",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "5",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "6",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "7",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "8",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "9",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "Completed",
      },
      {
        key: "10",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
      {
        key: "11",
        name: "Camila Cabelo",
        campaign: "North Face Campaign",
        avatar: "https://via.placeholder.com/40",
        stared: false,
        deadline: "03 Dec 2022",
        contractDate: "30 Mar 2022",
        amount: "$300",
        status: "In Progress",
      },
    ];
    const columns1 = [
      {
        title: "Creator",
        key: "creator",
        render: (record) => (
          <Space>
            <Avatar src={"https://i.pravatar.cc/101"} />
            <div>
              <div style={{ fontWeight: 500 }}>{record.name}</div>
              <div style={{ color: "#8c8c8c" }}>{record.campaign}</div>
            </div>
          </Space>
        ),
      //   sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Stared",
        dataIndex: "contractDate",
        key: "contractDate",
        align: "center",
      },
      {
        title: "Deadline",
        dataIndex: "deadline",
        key: "deadline",
      //   sorter: (a, b) => new Date(a.deadline) - new Date(b.deadline),
      },
      {
        title: "Contract Amount",
        dataIndex: "amount",
        key: "amount",
        align: "left",
      //   sorter: (a, b) => a.amount.replace("$", "") - b.amount.replace("$", ""),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          let statusClass = "status-default";
          if (status === "Completed") statusClass = "status-hired";
          if (status === "In Progress") statusClass = "status-reviewing";
  
          return <span className={`status-badge ${statusClass}`}>{status}</span>;
        },
        // filters: [
        //   { text: "In Progress", value: "In Progress" },
        //   { text: "Completed", value: "Completed" },
        // ],
        // onFilter: (value, record) => record.status === value,
      },
      {
        key: "action",
        render: () => <Link to={`view-contract/${1}`}><RightOutlined style={{ color: "#8c8c8c" }} /></Link>,
        width: 50,
      },
    ];
    const onTabChange = (key) => {
      console.log(key, "key");
      if (key=='all') {
        getContracts({})
      } else {
        getContracts({status:key})
      }
    };
    const ContentTable = () => {
      return (
        <Table
          columns={columns1}
          dataSource={data1}
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
        key: "In Progress",
        label: (
          <>
            In Progress
            <span className="ml-2 text-green-600 status-badge status-reviewing">
              18
            </span>
          </>
        ),
        children: <ContentTable />, // Replace with actual content
      },
      {
        key: "Completed",
        label: (
          <>
            Completed
            <span className="ml-2 text-blue-600 status-badge status-hired">
              22
            </span>
          </>
        ),
        children: <ContentTable />, // Replace with actual content
      }
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
                  {selectedDetails.proposedDeadline
                    ? selectedDetails.proposedDeadline
                    : "2024-12-01"}
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
                  <p
                    style={{
                      border: "1px solid #f0f0f0",
                      padding: "8px",
                      borderRadius: "4px",
                      background: "#fafafa",
                      maxHeight: "200px",
                      overflowY: "auto",
                    }}
                  >
                    Praesent egestas tristique nibh. Cum sociis natoque penatibus
                    et magnis dis parturient montes, nascetur ridiculus mus. Nulla
                    facilisi.Praesent egestas tristique nibh. Cum sociis natoque
                    penatibus et magnis dis parturient montes, nascetur ridiculus
                    mus. Nulla facilisi. Praesent egestas tristique nibh. Cum
                    sociis natoque penatibus et magnis dis parturient montes,
                    nascetur ridiculus mus. Nulla facilisi.
                  </p>
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>Portfolio :</div>
                <div style={{ width: "80%" }}>
                  <a
                    href={"https://www.google.com"}
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
                >
                  Hire
                </Button>
                <Button
                  type="default"
                  style={{ background: "#e0f2fe", color: "#0284c7" }}
                >
                  Shortlist
                </Button>
                <Button
                  type="default"
                  style={{ background: "#fee2e2", color: "#b91c1c" }}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
        </Drawer>
        <Tabs
          defaultActiveKey="all"
          onChange={onTabChange}
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
  const getContracts = async (payload)=>{
    const resp = await api.get(`Contracts`,payload);
    if (resp.statusCode==200) {
      console.log(resp)
    } else {
      console.log(resp.error);
      message.error(resp.message)
    }
  }
useEffect(() => {
  getContracts({})
}, [])
  return (
    <>
    <Title level={2}>All Contracts</Title>
      <BottomTables />
    </>
  );
};

export default AllContracts;
