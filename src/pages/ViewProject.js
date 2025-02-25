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
  Spin,
} from "antd";
import {
  ClockCircleOutlined,
  DollarOutlined,
  VideoCameraOutlined,
  SendOutlined,
  PaperClipOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  BagIcon,
  BudgetIcon,
  CalenderIcon,
  MonitorPlatformIcon,
  VideoCamIcon,
} from "components/icons";
import { Layout, Button, Input, Upload } from "antd";
import CampaignInfo from "./CampaignInfo";
import { useParams, useHistory } from "react-router-dom";
import { api } from "auth/FetchInterceptor";

const { Paragraph } = Typography;
const { Content, Sider } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;

const ViewProject = () => {
  // State management
  const [tabKey, setTabKey] = useState(1);
  const [contractInfo, setContractInfo] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams();
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("main_user"));
  const isBrand = user.role === "Brand";

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

  // Fetch contract details
  const getContractDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getSingle('Contracts', { _id: id });
      
      if (response && response.data) {
        // Add refresh function to contract info
        const contractData = {
          ...response.data,
          onRefresh: () => getContractDetails()
        };
        setContractInfo(contractData);
      } else {
        message.error('Failed to fetch contract details');
      }
    } catch (error) {
      console.error('Error fetching contract details:', error);
      message.error('Failed to load contract data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getContractDetails();
    } else {
      history.goBack();
    }
  }, [id]);

  // Chat interface component
  const ChatInterface = ({ contractInfo }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);
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
        
        if (response && response.data && response.data.data) {
          setMessages(response.data.data);
          setTimeout(scrollToBottom, 100);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
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
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    };
  
    const handleUpload = async (info) => {
      if (info.file.status === "uploading") {
        setUploadLoading(true);
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
              setUploadLoading(false);
              info.onSuccess();
            } else {
              setUploadLoading(false);
              message.error('Failed to upload file');
            }
          })
          .catch(error => {
            console.error('File upload error:', error);
            setUploadLoading(false);
            message.error('Error uploading file');
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
        console.error('Send message error:', error);
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
            src={msg.user?.profile_picture}
            style={{ backgroundColor: '#f56a00' }}
          >
            {msg.user?.name ? msg.user.name.charAt(0).toUpperCase() : 'U'}
          </Avatar>
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
            {messages.length > 0 ? (
              messages.map(renderMessage)
            ) : (
              <div className="empty-chat-message">
                No messages yet. Start the conversation by sending a message.
              </div>
            )}
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
                  loading={uploadLoading}
                />
              </Upload>
              <Button 
                icon={<SendOutlined />} 
                onClick={sendMessage}
              />
            </div>
          </div>
        </Content>
        <Sider width={400} theme="light" style={{ padding: "24px" }}>
          <ProjectTimeline
            contract={contractInfo}
            onTimelineUpdate={() => getContractDetails()}
          />
        </Sider>
      </Layout>
    );
  };

  // Project timeline component
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
    const [uploading, setUploading] = useState(false);
  
    const user = JSON.parse(localStorage.getItem("main_user"));
    const isBrand = user.role === "Brand";
    const requiresShipping = contract?.campaign?.do_you_need_to_ship_your_product_to_the_creators;
  
    const handleUpload = async (info) => {
      if (info.file.status === "uploading") {
        setUploading(true);
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
                uploadedFiles: [...prev.uploadedFiles, {
                  url: res.url,
                  name: info.file.name,
                  type: info.file.type
                }],
              }));
              setUploading(false);
              info.onSuccess();
            } else {
              setUploading(false);
              message.error('Failed to upload file');
            }
          })
          .catch(error => {
            console.error('File upload error:', error);
            setUploading(false);
            message.error('Error uploading file');
          });
      };
    };
  
    const updateTimeline = async (newTimelineItem) => {
      try {
        const latestContract = await api.getSingle("Contracts", {
          _id: contract._id,
        });
        
        if (!latestContract || !latestContract.data) {
          message.error('Failed to fetch latest contract data');
          return;
        }
        
        // Update status if provided in timelineItem data
        let updateData = {
          timeline: [...latestContract.data.timeline, newTimelineItem]
        };
        
        if (newTimelineItem.data?.status) {
          updateData.status = newTimelineItem.data.status;
        }
        
        // Update payment_status if provided in timelineItem data
        if (newTimelineItem.data?.payment_status) {
          updateData.payment_status = newTimelineItem.data.payment_status;
        }
        
        // Special case for project completion
        if (newTimelineItem.type === "project_completed") {
          updateData.status = "Completed";
          updateData.payment_status = "Pending Release";
        }
        
        await api.update(
          "Contracts",
          {
            ...latestContract.data,
            ...updateData
          },
          latestContract.data._id
        );
        
        onTimelineUpdate();
        message.success("Timeline updated successfully");
      } catch (error) {
        console.error("Timeline update error:", error);
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
            ? `Product shipped by ${contract.created_by?.name || 'Brand'}`
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
      
      // Automatically add content creation phase
      const contentCreationItem = {
        type: "content_creation_started",
        data: {
          brand_text: "Creator is working on content",
          creator_text: "Content creation in progress",
          date: new Date()
        }
      };
      await updateTimeline(contentCreationItem);
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
          creator_text: `Revision requested by ${contract.created_by?.name || 'Brand'}`,
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
          try {
            // Create timeline item for project completion
            const timelineItem = {
              type: "project_completed",
              data: {
                brand_text: "Project marked as complete",
                creator_text: `Project completed by ${contract.created_by?.name || 'Brand'}`,
                date: new Date(),
                status: "Completed",
                payment_status: "Pending Release"
              },
            };
            
            // Get latest contract data
            const latestContract = await api.getSingle("Contracts", {
              _id: contract._id,
            });
            
            if (!latestContract || !latestContract.data) {
              message.error('Failed to fetch latest contract data');
              return;
            }
            
            // Update contract with new status and payment status
            await api.update(
              "Contracts",
              {
                ...latestContract.data,
                status: "Completed", // Update the contract status
                payment_status: "Pending Release", // Update payment status
                timeline: [...latestContract.data.timeline, timelineItem]
              },
              latestContract.data._id
            );
            
            message.success("Project marked as complete. Payment is ready for processing.");
            onTimelineUpdate(); // Refresh the timeline
          } catch (error) {
            console.error("Error completing project:", error);
            message.error("Failed to mark project as complete. Please try again.");
          }
        },
      });
    };
  
    const getNextAction = () => {
      const timeline = contract.timeline || [];
      if (timeline.length === 0) return null;
      
      const lastItem = timeline[timeline.length - 1];
  
      // No timeline items - start of contract
      if (timeline.length === 1 && lastItem.type === "contract_started" && isBrand) {
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
  
        case "content_creation_started":
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
          
        case "project_completed":
          if (!isBrand) {
            return {
              type: "payment",
              button: (
                <Button
                  type="primary"
                  onClick={() => window.location.href = "mailto:support@socialshake.com?subject=Payment for Contract " + contract._id}
                >
                  Contact Support Team
                </Button>
              ),
            };
          }
          break;
      }
  
      return null;
    };
  
    const renderTimelineItem = (item) => {
      const text = isBrand ? item.data.brand_text : item.data.creator_text || item.data.text;
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
            
            {item.data.notes && (
              <div className="timeline-notes">
                <strong>Notes</strong>
                <div>{item.data.notes}</div>
              </div>
            )}
            
            {item.data.link && (
              <div className="timeline-link">
                <strong>Access Link</strong>
                <div>
                  <a href={item.data.link} target="_blank" rel="noopener noreferrer">
                    {item.data.link}
                  </a>
                </div>
              </div>
            )}
  
            {item.data.feedback && (
              <div className="timeline-feedback">
                <strong>Feedback</strong>
                <div>{item.data.feedback}</div>
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
            
            {/* For physical product shipment */}
            {(item.type === "product_shipped" || item.type === "digital_access_shared") && !isBrand && 
             !contract.timeline.some(t => t.type === "product_received") && (
              <button
                className="timeline-action-button"
                onClick={handleProductReceived}
              >
                Mark Received
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
                placeholder="Enter shipping notes, instructions, or other details"
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
                placeholder="Enter access details, credentials and instructions"
                value={formData.digitalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, digitalNotes: e.target.value })
                }
              />
            </>
          );
  
        case "content":
          return (
            <>
              <TextArea
                rows={4}
                placeholder="Add description for your submission..."
                value={formData.contentDescription}
                onChange={(e) =>
                  setFormData({ ...formData, contentDescription: e.target.value })
                }
                className="mb-3"
              />
              <Upload
                customRequest={handleUpload}
                multiple={true}
                showUploadList={true}
              >
                <Button icon={<UploadOutlined />} loading={uploading}>
                  Upload Files
                </Button>
              </Upload>
              {formData.uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <div className="font-weight-bold mb-2">Uploaded Files:</div>
                  {formData.uploadedFiles.map((file, index) => (
                    <div key={index} className="mb-1 d-flex align-items-center">
                      <FileOutlined className="mr-2" />
                      <span>{file.name}</span>
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />} 
                        size="small"
                        onClick={() => {
                          const newFiles = [...formData.uploadedFiles];
                          newFiles.splice(index, 1);
                          setFormData({...formData, uploadedFiles: newFiles});
                        }}
                        className="ml-2"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          );
  
        case "revision":
          return (
            <>
              <TextArea
                rows={4}
                placeholder="Provide revision feedback..."
                value={formData.feedback}
                onChange={(e) =>
                  setFormData({ ...formData, feedback: e.target.value })
                }
                className="mb-3"
              />
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
        <div className="timeline-header">PROJECT TIMELINE</div>
        <div className="timeline-content">
          {[...(contract.timeline || [])].reverse().map(renderTimelineItem)}
        </div>
        
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
          okButtonProps={{
            disabled: (
              (modalType === "content" && formData.uploadedFiles.length === 0) ||
              (modalType === "revision" && !formData.feedback) ||
              (modalType === "shipping" && !formData.trackingId) ||
              (modalType === "digital" && !formData.digitalLink && !formData.digitalNotes)
            )
          }}
        >
          {renderModalContent()}
        </Modal>
      </div>
    );
  };

  // Card style for info section
  const cardStyle = {
    border: "1px dashed #d3d3d3",
    borderRadius: "8px",
    padding: "16px",
    maxWidth: "250px",
  };

  const sectionStyle = {
    marginBottom: "12px",
  };

  if (loading && !contractInfo._id) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }

  // Calculate initial contract date from timeline or fallback to contract creation date
  const getInitialContractDate = () => {
    if (!contractInfo.timeline || contractInfo.timeline.length === 0) {
      return formatDate(contractInfo.createdAt);
    }
    
    const startEvent = contractInfo.timeline.find(event => event.type === 'contract_started');
    return startEvent ? formatDate(startEvent.data.date) : formatDate(contractInfo.createdAt);
  };

  // Get payment status from contract
  const getPaymentStatus = () => {
    if (!contractInfo.payment_status) {
      return "Payment Held In Escrow";
    }
    
    switch (contractInfo.payment_status) {
      case "Pending":
        return "Payment Held In Escrow";
      case "Pending Release":
        return "Payment Pending Release";
      case "Paid":
        return "Payment Completed";
      default:
        return contractInfo.payment_status;
    }
  };

  // Determine project status text based on timeline
  const getProjectStatusText = () => {
    if (!contractInfo.timeline || contractInfo.timeline.length === 0) {
      return "Not started";
    }
    
    const lastItem = contractInfo.timeline[contractInfo.timeline.length - 1];
    
    if (lastItem.type === "contract_started") {
      return isBrand ? "Waiting for product handoff" : "Waiting for product/details";
    }
    
    if (lastItem.type === "product_shipped" || lastItem.type === "digital_access_shared") {
      return isBrand ? "Waiting for creator to confirm receipt" : "Waiting for you to confirm receipt";
    }
    
    if (lastItem.type === "product_received") {
      return isBrand ? "Waiting for content" : "You need to create content";
    }
    
    if (lastItem.type === "content_creation_started") {
      return isBrand ? "Creator is working on content" : "You're creating content";
    }
    
    if (lastItem.type === "content_delivered") {
      return isBrand ? "Waiting for your review" : "Waiting for brand review";
    }
    
    if (lastItem.type === "revision_requested") {
      return isBrand ? "Waiting for revised content" : "Revisions requested - action needed";
    }
    
    if (lastItem.type === "project_completed") {
      return "Project completed";
    }
    
    return contractInfo.status || "In progress";
  };

  return (
    <div className="project-container">
      <Title level={2}>{contractInfo?.campaign?.campaign_name || 'Project Details'}</Title>
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
                <Avatar 
                  src={isBrand ? contractInfo?.user?.profile_picture : contractInfo?.created_by?.profile_picture} 
                  size={50}
                  style={{ backgroundColor: '#f56a00' }}
                >
                  {isBrand 
                    ? (contractInfo?.user?.name ? contractInfo.user.name.charAt(0).toUpperCase() : 'U') 
                    : (contractInfo?.created_by?.name ? contractInfo.created_by.name.charAt(0).toUpperCase() : 'B')}
                </Avatar>
              </div>
              <div style={{ width: "77%" }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>
                    <Tag color={contractInfo.status === 'Completed' ? 'green' : 'blue'} className="status-tag">
                      {contractInfo.status || 'In Progress'}
                    </Tag>
                  </span>
                </div>
                <div>
                  <Text className="name mt-2 mb-2">
                    {isBrand ? contractInfo?.user?.name : contractInfo?.created_by?.name || 'User'}
                  </Text>
                </div>
              </div>
            </div>
          </Col>
          <Col>
            <Text className="price">$ {contractInfo?.amount || 0}</Text>
          </Col>
        </Row>
        <div className="nav-tabs">
          <span
            className={`${tabKey === 1 ? "active" : ""}`}
            onClick={() => setTabKey(1)}
          >
            Overview
          </span>
          <span
            className={`${tabKey === 2 ? "active" : ""}`}
            onClick={() => setTabKey(2)}
          >
            Messages
          </span>
          {!isBrand && (
            <span
              className={`${tabKey === 3 ? "active" : ""}`}
              onClick={() => setTabKey(3)}
            >
              Project Details
            </span>
          )}
        </div>
      </Card>

      {/* Different tabs content */}
      {tabKey === 1 && (
        <Row gutter={24} className="content-section">
          <Col span={16}>
            <Card>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "100%" }}>
                  <Title level={4} className="mb-4">
                    Project Timeline
                  </Title>

                  {contractInfo.timeline ? (
                    <ProjectTimeline
                      contract={contractInfo}
                      onTimelineUpdate={() => getContractDetails()}
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
                      <Text strong>{getInitialContractDate()}</Text>
                    </div>
                    <div style={sectionStyle}>
                      <Text type="secondary">Payment Status</Text>
                      <br />
                      <Text strong>{getPaymentStatus()}</Text>
                    </div>
                    <div style={sectionStyle}>
                      <Text type="secondary">Project Status</Text>
                      <br />
                      <Text strong>{getProjectStatusText()}</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <Card className="side-card">
              <div style={{ display: 'flex', gap: '10px' }}>
                <div><CalenderIcon /></div>
                <div>
                  <Paragraph>
                    <div>Deadline:</div>
                    <strong>{contractInfo.end_date ? formatDate(contractInfo.end_date) : 'Not specified'}</strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div><BagIcon /></div>
                <div>
                  <Paragraph>
                    <div>Type:</div>
                    <strong>{contractInfo.campaign?.video_type || 'Not specified'}</strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div><VideoCamIcon /></div>
                <div>
                  <Paragraph>
                    <div>Videos Required:</div>
                    <strong>
                      {contractInfo.campaign?.videos_from_creator ? 
                        Object.entries(contractInfo.campaign.videos_from_creator)
                          .filter(([_, details]) => details.quantity > 0)
                          .map(([duration, details]) => `${duration}s × ${details.quantity}`)
                          .join(", ") :
                        'Not specified'
                      }
                    </strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div><MonitorPlatformIcon /></div>
                <div>
                  <Paragraph>
                    <div>Platform & Ratio:</div>
                    <strong>
                      {Array.isArray(contractInfo.campaign?.what_platforms_is_it_for) 
                        ? contractInfo.campaign.what_platforms_is_it_for.join(", ") 
                        : 'Not specified'}
                      {contractInfo.campaign?.video_aspect_ratio 
                        ? `. Aspect ratio: ${contractInfo.campaign.video_aspect_ratio}` 
                        : ''}
                    </strong>
                  </Paragraph>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div><BudgetIcon /></div>
                <div>
                  <Paragraph>
                    <div>Contract Amount:</div>
                    <strong>${contractInfo.amount || 0}</strong>
                  </Paragraph>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {tabKey === 2 && contractInfo._id && (
        <ChatInterface contractInfo={contractInfo} />
      )}

      {tabKey === 3 && contractInfo.campaign?._id && (
        <CampaignInfo id={contractInfo.campaign._id} />
      )}
    </div>
  );
};

export default ViewProject;