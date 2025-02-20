import React, { useEffect, useState } from "react";
import { Drawer, Button, Tag, Typography, Avatar, message } from "antd";
import {
  EyeFilled,
  CloseOutlined,
  LikeFilled,
  LikeOutlined, RightOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Table, Space, Tabs } from "antd";
import { api } from "auth/FetchInterceptor";

const { Title, Text } = Typography;

const { TabPane } = Tabs;

const AllContracts = () => {
  const [contracts, setContract] = useState([]);

  const BottomTables = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDetails, setSelectedDetails] = useState(null);
    const [key, setKey] = useState('all')
    const user = JSON.parse(localStorage.getItem("main_user"));

    const closeDrawer = () => {
      setDrawerVisible(false);
      setSelectedDetails(null);
    };

    const columns1 = [
      user.role == 'Brand' ? {
        title: "Creator",
        key: "user",
        dataIndex: "user",
        render: (user) => {
          return (
            <Space>
              <Avatar src={user.profile_picture} />
              <div>
                <div style={{ fontWeight: 500 }}>{user.name}</div>
              </div>
            </Space>
          )
        },
      } : {
        title: "Brand",
        key: "campaign",
        dataIndex: "campaign",
        render: (campaign) => {
          console.log(campaign);

          return (
            <Space>
              <Avatar src={campaign.product_brand_logo} />
              <div>
                <div style={{ fontWeight: 500 }}>{campaign.campaign_name}</div>
              </div>
            </Space>
          )
        },
      },
      {
        title: "Stared",
        dataIndex: "start_date",
        key: "start_date",
        render: (start_date) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Text>{new Date(start_date).toDateString()}</Text>
          </div>
        ),
      },
      {
        title: "Deadline",
        dataIndex: "end_date",
        key: "end_date",
        render: (end_date) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Text>{new Date(end_date).toDateString()}</Text>
          </div>
        ),
      },
      {
        title: "Contract Amount",
        dataIndex: "amount",
        key: "amount",
        align: "left",
        render: (amount) => (
          <div style={{ display: "flex", gap: "10px" }}>
            <Text>$ {amount}</Text>
          </div>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
          let statusClass = "status-default";
          if (status === "Completed") statusClass = "status-hired";
          if (status === "In Progress") statusClass = "status-shortlisted";

          return <span className={`status-badge ${statusClass}`}>{status}</span>;
        },
      }
    ];

    const onTabChange = (key) => {
      setKey(key)
    };

    const ContentTable = () => {
      return (
        <Table
          className="campaign-detail-table"
          columns={columns1}
          dataSource={contracts.filter(contract => {
            if (key === "all") return true;
            return contract.status === key
          })}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log(record);
                if(window.location.pathname.includes('brand')) {
                  // /app/brands/campaigns/campaign-detail/view-project/679b01b392bfe5c46e7b3bf6
                  window.location.href = `/app/brands/campaigns/campaign-detail/view-project/${record._id}`;
                } else {
                  window.location.href = `/app/creators/view-contract/${record._id}`;
                }
              },
            };
          }}
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
            All<span className="ml-2 status-badge status-default">
              {contracts.length}
            </span>
          </>
        ),
        children: <ContentTable />, // Replace with actual content
      },
      {
        key: "In Progress",
        label: (
          <>
            In Progress
            <span className="ml-2 text-green-600 status-badge status-shortlisted">
              {contracts.filter(contract => contract.status === "In Progress").length}
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
              {contracts.filter(contract => contract.status === "Completed").length}
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

  const getContracts = async () => {
    const user = JSON.parse(localStorage.getItem("main_user"));
    let payload = {}
    if (user.role == "Brand") {
      payload = { tabFilter: { created_by_id: user._id } }
    } else {
      payload = { tabFilter: { user_id: user._id } };
    }

    const resp = await api.get(`Contracts`, payload);
    setContract(resp.data.data);
  }

  useEffect(() => {
    getContracts()
  }, [])

  return (
    <>
      <Title level={2}>All Contracts</Title>
      <BottomTables />
    </>
  );
};

export default AllContracts;
