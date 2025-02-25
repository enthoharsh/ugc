import React, { useEffect, useRef, useState } from "react";
import {
  Timeline,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Avatar,
  message,
  Modal,
  Image,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  VideoCameraOutlined,
  InstagramOutlined,
} from "@ant-design/icons";
import {
  BagIcon,
  BudgetIcon,
  CalenderIcon,
  MonitorPlatformIcon,
  VideoCamIcon,
} from "components/icons";
import { Layout, Button, Input, Upload } from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CampaignInfo from "./CampaignInfo";
import { useParams, useHistory } from "react-router-dom";
import { api } from "auth/FetchInterceptor";

const { Paragraph } = Typography;
const { Content, Sider } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ChatInterface = ({ contractInfo }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const chatContainerRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("main_user"));
  const isBrand = user.role === "Brand";

  // Load chat messages
  const loadMessages = async () => {
    try {
      const response = await api.get("ChatMessages", {
        tabFilter: { contract_id: contractInfo._id },
        sortColumn: "createdAt",
        sortDirection: "asc",
        limit: 10000,
      });
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      message.error("Failed to load messages");
    }
  };

  useEffect(() => {
    if (contractInfo._id) {
      loadMessages();
      // Poll for new messages every 10 seconds
      const interval = setInterval(loadMessages, 10000);
      return () => clearInterval(interval);
    }
  }, [contractInfo._id]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleUpload = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api
        .uploadFile("Users", {
          file: reader.result,
          extension: info.file.name.split(".").pop(),
        })
        .then((res) => {
          if (res.success) {
            setUploadedFiles([
              ...uploadedFiles,
              {
                url: res.url,
                name: info.file.name,
                type: info.file.type,
              },
            ]);
            setLoading(false);
            info.onSuccess();
          }
        });
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;

    try {
      const messageData = {
        contract_id: contractInfo._id,
        user_id: user._id,
        message_type: uploadedFiles.length > 0 ? "attachment" : "text",
        message: newMessage.trim(),
        message_data: {
          files: uploadedFiles,
          timestamp: new Date().toISOString(),
        },
        read_by: [user._id],
      };

      await api.save("ChatMessages", messageData);
      setNewMessage("");
      setUploadedFiles([]);
      await loadMessages();
    } catch (error) {
      message.error("Failed to send message");
    }
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.user_id === user._id;
    const messageTime = new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <div
        key={msg._id}
        className={`message-wrapper ${isOwnMessage ? "user-message" : ""}`}
      >
        <Avatar
          size="small"
          src={msg.user?.profile_picture || "https://via.placeholder.com/32"}
        />
        <div className="message-content">
          <div className="message-bubble">
            {msg.message_type === "attachment" &&
              msg.message_data?.files?.map((file, index) => (
                <div key={index} className="attachment-preview">
                  {file.type?.startsWith("image/") ? (
                    <img
                      src={file.url}
                      alt="attachment"
                      style={{ maxWidth: "200px" }}
                    />
                  ) : (
                    <Button
                      icon={<FileOutlined />}
                      onClick={() => window.open(file.url)}
                    >
                      {file.name}
                    </Button>
                  )}
                </div>
              ))}
            {msg.message}
          </div>
          <Text type="secondary" className="message-time">
            {messageTime}
          </Text>
        </div>
      </div>
    );
  };

  const renderTimeline = () => (
    <div className="timeline-wrapper">
      <div className="timeline-header">PROJECT TIMELINE</div>
      <ProjectTimeline
        contract={contractInfo}
        onTimelineUpdate={() => {
          // Trigger parent component to refresh contract info
          if (contractInfo.onRefresh) {
            contractInfo.onRefresh();
          }
        }}
      />
    </div>
  );

  const removeFile = (fileIndex) => {
    setUploadedFiles((files) =>
      files.filter((_, index) => index !== fileIndex)
    );
  };

  const renderFilePreview = () => {
    if (uploadedFiles.length === 0) return null;

    return (
      <div
        style={{
          padding: "8px",
          border: "1px solid #d9d9d9",
          borderRadius: "4px",
          marginTop: "8px",
          marginBottom: "8px",
          backgroundColor: "#ffffffcf",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {uploadedFiles.map((file, index) => (
            <div key={index} style={{ position: "relative" }}>
              {file.type?.startsWith("image/") ? (
                <div
                  style={{
                    position: "relative",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "4px",
                    backgroundColor: "#fafafa",
                  }}
                >
                  <img
                    src={file.url}
                    alt="preview"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={() => removeFile(index)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "50%",
                      transform: "translate(50%, -50%)",
                      background: "white",
                      borderRadius: "50%",
                      padding: "4px",
                      border: "1px solid #d9d9d9",
                      display: "none",
                      zIndex: 999,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.display = "block";
                    }}
                  />
                  <div
                    onMouseEnter={(e) => {
                      e.currentTarget.parentElement.querySelector(
                        "button"
                      ).style.display = "block";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.parentElement.querySelector(
                        "button"
                      ).style.display = "none";
                    }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    padding: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fafafa",
                    minWidth: "200px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FileOutlined style={{ color: "#1890ff" }} />
                    <span
                      style={{
                        fontSize: "14px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "150px",
                      }}
                    >
                      {file.name}
                    </span>
                  </div>
                  <Button
                    type="text"
                    style={{
                      cursor: "pointer",
                      zIndex: 999,
                      position: "relative",
                    }}
                    icon={<DeleteOutlined />}
                    onClick={() => removeFile(index)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout className="chat-layout">
      <Content style={{ padding: "24px", background: "#fff" }}>
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map(renderMessage)}
        </div>
        <div className="file-preview"></div>
        <div className="chat-input">
          <TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            autoSize={{ minRows: 1, maxRows: 4 }}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <div
            className="file-preview"
            style={{
              position: "absolute",
              bottom: 75,
              left: 0,
            }}
          >
            {renderFilePreview()}
          </div>
          <div className="input-actions">
            <Upload
              customRequest={handleUpload}
              showUploadList={false}
              multiple={true}
            >
              <Button
                type="text"
                icon={<PaperClipOutlined />}
                loading={loading}
              />
            </Upload>
            <Button icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0.834522 3.55271C0.617856 1.60771 2.62036 0.179373 4.38952 1.01771L14.3429 5.73271C16.2495 6.63521 16.2495 9.34854 14.3429 10.251L4.38952 14.9669C2.62036 15.8052 0.618689 14.3769 0.834522 12.4319L1.23452 8.82521H7.99952C8.22054 8.82521 8.4325 8.73741 8.58878 8.58113C8.74506 8.42485 8.83286 8.21289 8.83286 7.99187C8.83286 7.77086 8.74506 7.5589 8.58878 7.40262C8.4325 7.24634 8.22054 7.15854 7.99952 7.15854H1.23536L0.835356 3.55271H0.834522Z"
                  fill="black"
                />
              </svg>} onClick={sendMessage} disabled={loading}/>
          </div>
        </div>
      </Content>
      <Sider width={400} theme="light" style={{ padding: "24px" }}>
        {renderTimeline()}
      </Sider>
    </Layout>
  );
};

const ViewProject = () => {
  const [tabKey, setTabKey] = useState(1);
  const [contractInfo, setContractInfo] = useState({});
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("main_user"));
  const isBrand = user.role === "Brand";

  const getContractDetails = async (payload) => {
    const CampaignResp = await api.getSingle(`Contracts`, payload);

    if (CampaignResp) {
      setContractInfo(CampaignResp.data);
    }
  };

  useEffect(() => {
    if (id) {
      getContractDetails({
        _id: id,
      });
    }
  }, [id]);
  const cardStyle = {
    border: "1px dashed #d3d3d3",
    borderRadius: "8px",
    padding: "16px",
    maxWidth: "250px",
  };

  const sectionStyle = {
    marginBottom: "12px",
  };

  return (
    <div className="project-container">
      <Title level={2}>{contractInfo?.campaign?.campaign_name}</Title>
      <Card className="header-card">
        <Row align="middle" justify="space-between">
          <Col>
            <div
              className="project-card"
              style={{
                display: "flex",
                padding: 0,
                border: "none",
                background: "transparent",
              }}
            >
              <div
                style={{
                  width: "23%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Avatar src={contractInfo?.user?.profile_picture} size={50} />
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
                </div>
                <div>
                  <Text className="name mt-2 mb-2">
                    {contractInfo?.user?.name}
                  </Text>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <Text className="price">$ {contractInfo?.amount}</Text>
          </Col>
        </Row>
        <div className="nav-tabs">
          <span
            className={`${tabKey == 1 ? "active" : ""}`}
            onClick={() => setTabKey(1)}
          >
            Overview
          </span>
          <span
            className={`${tabKey == 2 ? "active" : ""}`}
            onClick={() => setTabKey(2)}
          >
            Messages
          </span>
          {isBrand ? null : (
            <span
              className={`${tabKey == 3 ? "active" : ""}`}
              onClick={() => setTabKey(3)}
            >
              Project Details
            </span>
          )}
        </div>
      </Card>

      {tabKey == 1 && (
        <Row gutter={24} className="content-section">
          <Col span={16}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Title level={4} className="mb-4">
                    Project Timeline
                  </Title>

                  {contractInfo.timeline ? (
                    <ProjectTimeline
                      contract={contractInfo}
                      onTimelineUpdate={() => {
                        getContractDetails({
                          _id: id,
                        });
                      }}
                    />
                  ) : (
                    <div>No timeline data available</div>
                  )}
                </div>
                <div>
                  <Title level={4} className="mb-4"></Title>
                  <div style={cardStyle}>
                    <div style={sectionStyle}>
                      <Text type="secondary">Contract Started</Text>
                      <br />
                      <Text strong>26 Jul 2022 5:00 AM</Text>
                    </div>
                    <div style={sectionStyle}>
                      <Text type="secondary">Payment Status</Text>
                      <br />
                      <Text strong>Payment Held In Escrow</Text>
                    </div>
                    <div style={sectionStyle}>
                      <Text type="secondary">Project Status</Text>
                      <br />
                      <Text strong>Awaiting Brand Feedback</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card className="side-card">
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <CalenderIcon />
                </div>
                <div>
                  <Paragraph>
                    <div>Date Posted:</div>
                    <strong> 02 May 2023</strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <BagIcon />
                </div>
                <div>
                  <Paragraph>
                    <div>Type:</div>
                    <strong> Physical Product – Video Ad</strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <VideoCamIcon />
                </div>
                <div>
                  <Paragraph>
                    <div>Videos Required:</div> <strong>15s x2, 60s x1</strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <MonitorPlatformIcon />
                </div>
                <div>
                  <Paragraph>
                    <div>Platform & Ratio:</div>
                    <strong> Instagram, TikTok. Aspect ratio: 4:5</strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div>
                  <BudgetIcon />
                </div>
                <div>
                  <Paragraph>
                    <div>Budget:</div> <strong>$500</strong>
                  </Paragraph>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {tabKey == 2 && contractInfo?.timeline?.length > 0 && (
        <ChatInterface
          contractInfo={contractInfo}
          onTimelineUpdate={() => {
            getContractDetails({
              _id: id,
            });
          }}
        />
      )}

      {tabKey == 3 && <CampaignInfo id={contractInfo.campaign_id} />}
    </div>
  );
};

export default ViewProject;

const ProjectTimeline = ({ contract, onTimelineUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); // 'shipping', 'digital', 'content', 'revision'
  const [formData, setFormData] = useState({
    trackingId: "",
    shippingNotes: "",
    digitalLink: "",
    digitalNotes: "",
    feedback: "",
    uploadedFiles: [],
  });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("main_user"));
  const isBrand = user.role === "Brand";
  const requiresShipping =
    contract?.campaign?.do_you_need_to_ship_your_product_to_the_creators;

  const handleUpload = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api
        .uploadFile("Users", {
          file: reader.result,
          extension: info.file.name.split(".").pop(),
        })
        .then((res) => {
          if (res.success) {
            setFormData((prev) => ({
              ...prev,
              uploadedFiles: [...prev.uploadedFiles, res.url],
            }));
            setLoading(false);
            info.onSuccess();
          }
        });
    };
  };

  const updateTimeline = async (newTimelineItem) => {
    try {
      const latestContract = await api.getSingle("Contracts", {
        _id: contract._id,
      });
      const updatedTimeline = [
        ...latestContract.data.timeline,
        newTimelineItem,
      ];
      await api.update(
        "Contracts",
        {
          ...latestContract,
          timeline: updatedTimeline,
        },
        latestContract.data._id
      );
      onTimelineUpdate();
      message.success("Timeline updated successfully");
    } catch (error) {
      message.error("Failed to update timeline");
    }
  };

  const handleProductHandoff = async () => {
    const timelineItem = {
      type: requiresShipping ? "product_shipped" : "digital_access_shared",
      data: {
        brand_text: requiresShipping
          ? "You shipped products"
          : "You shared product access details",
        creator_text: requiresShipping
          ? `Product shipped by ${contract.created_by.name}`
          : "Product access details shared",
        date: new Date(),
        trackingId: formData.trackingId,
        notes: requiresShipping
          ? formData.shippingNotes
          : formData.digitalNotes,
        link: formData.digitalLink,
      },
    };
    await updateTimeline(timelineItem);
    setIsModalVisible(false);
    setFormData({
      ...formData,
      trackingId: "",
      shippingNotes: "",
      digitalLink: "",
      digitalNotes: "",
    });
  };

  const handleProductReceived = async () => {
    const timelineItem = {
      type: "product_received",
      data: {
        brand_text: "Creator received products",
        creator_text: "You received products",
        date: new Date(),
      },
    };
    await updateTimeline(timelineItem);
  };

  const handleContentSubmit = async () => {
    const timelineItem = {
      type: "content_delivered",
      data: {
        brand_text: "Content delivered by creator",
        creator_text: "You delivered content",
        date: new Date(),
        files: formData.uploadedFiles,
      },
    };
    await updateTimeline(timelineItem);
    setIsModalVisible(false);
    setFormData({ ...formData, uploadedFiles: [] });
  };

  const handleRevisionRequest = async () => {
    const timelineItem = {
      type: "revision_requested",
      data: {
        brand_text: "Revision requested by you",
        creator_text: `Revision requested by ${contract.created_by.name}`,
        date: new Date(),
        feedback: formData.feedback,
      },
    };
    await updateTimeline(timelineItem);
    setIsModalVisible(false);
    setFormData({ ...formData, feedback: "" });
  };

  const handleMarkComplete = () => {
    confirm({
      title: "Are you sure you want to mark this project as complete?",
      icon: <ExclamationCircleOutlined />,
      content: "This action will release the payment and cannot be undone.",
      onOk: async () => {
        const timelineItem = {
          type: "project_completed",
          data: {
            brand_text: "Project marked as complete",
            creator_text: `Project completed by ${contract.created_by.name}`,
            date: new Date(),
            status: "Completed",
          },
        };
        await updateTimeline(timelineItem);
        message.success("Project marked as complete");
      },
    });
  };

  const getNextAction = () => {
    const timeline = contract.timeline || [];
    const lastItem = timeline[timeline.length - 1];

    // No timeline items - start of contract
    if (timeline.length === 1 && isBrand) {
      return {
        type: "initial",
        button: (
          <Button
            onClick={() => {
              setModalType(requiresShipping ? "shipping" : "digital");
              setIsModalVisible(true);
            }}
          >
            {requiresShipping ? "Ship Product" : "Share Access Details"}
          </Button>
        ),
      };
    }

    if (!lastItem) return null;

    // Logic for other states
    switch (lastItem.type) {
      case "product_shipped":
      case "digital_access_shared":
        if (!isBrand) {
          return {
            type: "receive",
            button: (
              <Button onClick={handleProductReceived}>Mark as Received</Button>
            ),
          };
        }
        break;

      case "product_received":
        if (!isBrand) {
          return {
            type: "content",
            button: (
              <Button
                onClick={() => {
                  setModalType("content");
                  setIsModalVisible(true);
                }}
              >
                Submit Content
              </Button>
            ),
          };
        }
        break;

      case "content_delivered":
        if (isBrand) {
          return {
            type: "review",
            button: (
              <div className="timeline-actions">
                <Button
                  className="secondary-color-btn"
                  onClick={() => {
                    setModalType("revision");
                    setIsModalVisible(true);
                  }}
                >
                  Request Revision
                </Button>
                <Button
                  className="primary-solid-button"
                  onClick={handleMarkComplete}
                >
                  Mark Complete
                </Button>
              </div>
            ),
          };
        }
        break;

      case "revision_requested":
        if (!isBrand) {
          return {
            type: "content",
            button: (
              <Button
                onClick={() => {
                  setModalType("content");
                  setIsModalVisible(true);
                }}
              >
                Submit Revision
              </Button>
            ),
          };
        }
        break;
    }

    return null;
  };

  const renderTimelineItem = (item) => {
    const text =
      (isBrand ? item.data.brand_text : item.data.creator_text) ||
      item.data.text;
    const date = new Date(item.data.date).toLocaleDateString();

    return (
      <div className="timeline-item">
        <div className="timeline-item-content">
          <div className="timeline-header-for-title">
            <div className="timeline-item-title">{text}</div>
            <div className="timeline-item-date">{date}</div>
          </div>

          {item.data.amount && (
            <div className="timeline-amount">${item.data.amount}</div>
          )}

          {item.data.trackingId && (
            <div className="timeline-tracking">
              <div className="timeline-tracking-label">Tracking ID</div>
              <div className="timeline-tracking-id">{item.data.trackingId}</div>
            </div>
          )}

          {item.data.files && item.data.files.length > 0 && (
            <div className="timeline-attachments">
              {item.data.files.map((file, index) => (
                <div key={index} className="timeline-attachment">
                  <PaperClipOutlined style={{ color: "#666" }} />
                  <div className="timeline-attachment-info">
                    {file.name || `File ${index + 1}`}
                  </div>
                  <button
                    className="timeline-download-button"
                    onClick={() => window.open(file.url || file, "_blank")}
                  >
                    <DownloadOutlined /> Download
                  </button>
                </div>
              ))}
            </div>
          )}

          {item.data.notes && (
            <div className="timeline-notes">
              <strong>Notes</strong>
              <div>{item.data.notes}</div>
            </div>
          )}

          {item.type === "product_shipped" && !isBrand && (
            <button
              className="timeline-action-button"
              onClick={handleProductReceived}
            >
              Mark Received
            </button>
          )}

          {item.type === "revision_requested" && !isBrand && (
            <button
              className="timeline-action-button"
              onClick={() => {
                setModalType("content");
                setIsModalVisible(true);
              }}
            >
              Deliver
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "shipping":
        return (
          <>
            <Input
              placeholder="Enter tracking ID"
              value={formData.trackingId}
              onChange={(e) =>
                setFormData({ ...formData, trackingId: e.target.value })
              }
              className="mb-3"
            />
            <TextArea
              rows={4}
              placeholder="Enter shipping notes..."
              value={formData.shippingNotes}
              onChange={(e) =>
                setFormData({ ...formData, shippingNotes: e.target.value })
              }
            />
          </>
        );

      case "digital":
        return (
          <>
            <Input
              placeholder="Enter access link"
              value={formData.digitalLink}
              onChange={(e) =>
                setFormData({ ...formData, digitalLink: e.target.value })
              }
              className="mb-3"
            />
            <TextArea
              rows={4}
              placeholder="Enter access details and notes..."
              value={formData.digitalNotes}
              onChange={(e) =>
                setFormData({ ...formData, digitalNotes: e.target.value })
              }
            />
          </>
        );

      case "content":
      case "revision":
        return (
          <>
            {modalType === "revision" && (
              <TextArea
                rows={4}
                placeholder="Enter revision feedback..."
                value={formData.feedback}
                onChange={(e) =>
                  setFormData({ ...formData, feedback: e.target.value })
                }
                className="mb-3"
              />
            )}
            <Upload
              customRequest={handleUpload}
              multiple={true}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />} loading={loading}>
                Upload Files
              </Button>
            </Upload>
          </>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (modalType) {
      case "shipping":
        return "Ship Product";
      case "digital":
        return "Share Access Details";
      case "content":
        return "Submit Content";
      case "revision":
        return "Request Revision";
      default:
        return "";
    }
  };

  const handleModalOk = () => {
    switch (modalType) {
      case "shipping":
      case "digital":
        handleProductHandoff();
        break;
      case "content":
        handleContentSubmit();
        break;
      case "revision":
        handleRevisionRequest();
        break;
    }
  };

  const nextAction = getNextAction();

  return (
    <div className="timeline-wrapper">
      {/* <Timeline> */}
      <div className="timeline-content">
        {[...(contract.timeline || [])].reverse().map(renderTimelineItem)}
      </div>
      {/* </Timeline> */}

      {/* Show next action at the top */}
      {nextAction?.button && (
        <div style={{ padding: "16px", borderTop: "1px solid #eee" }}>
          {nextAction.button}
        </div>
      )}

      <Modal
        title={getModalTitle()}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setFormData({
            trackingId: "",
            shippingNotes: "",
            digitalLink: "",
            digitalNotes: "",
            feedback: "",
            uploadedFiles: [],
          });
        }}
        onOk={handleModalOk}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};
