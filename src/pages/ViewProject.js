import React, { useEffect, useRef, useState } from 'react';
import { Timeline, Card, Row, Col, Typography, Tag, Avatar, message, Modal, Image } from 'antd';
import { ClockCircleOutlined, DollarOutlined, VideoCameraOutlined, InstagramOutlined } from '@ant-design/icons';
import { BagIcon, BudgetIcon, CalenderIcon, MonitorPlatformIcon, VideoCamIcon } from 'components/icons';
import {
  Layout,
  Button,
  Input,
  Upload,
} from 'antd';
import {
  SendOutlined,
  PaperClipOutlined,
  UploadOutlined,
  DownloadOutlined,
  FileOutlined,
} from '@ant-design/icons';
import CampaignInfo from './CampaignInfo';
import { useParams, useHistory } from 'react-router-dom';
import { api } from 'auth/FetchInterceptor';

const { Paragraph } = Typography;
const { Content, Sider } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;

const ChatInterface = ({ contractInfo }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const chatContainerRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("main_user"));
  const isBrand = user.role === 'Brand';

  // Load chat messages
  const loadMessages = async () => {
    try {
      const response = await api.get('ChatMessages', {
        tabFilter: { contract_id: contractInfo._id }
      });
      setMessages(response.data.data);
      scrollToBottom();
    } catch (error) {
      message.error('Failed to load messages');
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
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api.uploadFile("Users", {
        file: reader.result,
        extension: info.file.name.split(".").pop(),
      }).then((res) => {
        if (res.success) {
          setUploadedFiles([...uploadedFiles, {
            url: res.url,
            name: info.file.name,
            type: info.file.type
          }]);
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
        message_type: uploadedFiles.length > 0 ? 'attachment' : 'text',
        message: newMessage.trim(),
        message_data: {
          files: uploadedFiles,
          timestamp: new Date().toISOString()
        },
        read_by: [user._id]
      };

      await api.save('ChatMessages', messageData);
      setNewMessage('');
      setUploadedFiles([]);
      await loadMessages();
    } catch (error) {
      message.error('Failed to send message');
    }
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.user_id === user._id;
    const messageTime = new Date(msg.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return (
      <div 
        key={msg._id} 
        className={`message-wrapper ${isOwnMessage ? 'user-message' : ''}`}
      >
        <Avatar 
          size="small" 
          src={msg.user?.profile_picture || "https://via.placeholder.com/32"} 
        />
        <div className="message-content">
          <div className="message-bubble">
            {msg.message_type === 'attachment' && msg.message_data?.files?.map((file, index) => (
              <div key={index} className="attachment-preview">
                {file.type?.startsWith('image/') ? (
                  <img src={file.url} alt="attachment" style={{ maxWidth: '200px' }} />
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
          <Text type="secondary" className="message-time">{messageTime}</Text>
        </div>
      </div>
    );
  };

  const renderTimeline = () => (
    <Card title="PROJECT TIMELINE" className="timeline-card">
      <ProjectTimeline 
        contract={contractInfo}
        onTimelineUpdate={() => {
          // Trigger parent component to refresh contract info
          if (contractInfo.onRefresh) {
            contractInfo.onRefresh();
          }
        }}
      />
    </Card>
  );

  return (
    <Layout className="chat-layout">
      <Content style={{ padding: '24px', background: '#fff' }}>
        <div className="chat-container" ref={chatContainerRef}>
          {messages.map(renderMessage)}
        </div>
        <div className="chat-input">
          <TextArea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            autoSize={{ minRows: 1, maxRows: 4 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
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
            <Button 
              icon={<SendOutlined />} 
              onClick={sendMessage}
              disabled={loading}
            />
          </div>
        </div>
      </Content>
      <Sider width={400} theme="light" style={{ padding: '24px' }}>
        {renderTimeline()}
      </Sider>
    </Layout>
  );
};

const ViewProject = () => {
  const [tabKey, setTabKey] = useState(1);
  const [contractInfo, setContractInfo] = useState({});
  const { id } = useParams();

  const getContractDetails = async (payload) => {
    const CampaignResp = await api.getSingle(`Contracts`, payload);

    if (CampaignResp) {
      setContractInfo(CampaignResp.data);
    }
  }

  useEffect(() => {
    if (id) {
      getContractDetails({
        _id: id
      })
    }
  }, [id])
  const cardStyle = {
    border: '1px dashed #d3d3d3',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '250px',
  };

  const sectionStyle = {
    marginBottom: '12px',
  };

  return (
    <div className="project-container">
      <Title level={2}>
        {contractInfo?.campaign?.campaign_name}
      </Title>
      <Card className="header-card">
        <Row align="middle" justify="space-between">
          <Col>
            <div
              className="project-card"
              style={{ display: "flex", padding: 0, border: 'none', background: 'transparent' }}
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
          <span className={`${tabKey == 1 ? "active" : ""}`} onClick={() => setTabKey(1)}>Overview</span>
          <span className={`${tabKey == 2 ? "active" : ""}`} onClick={() => setTabKey(2)}>Messages</span>
          <span className={`${tabKey == 3 ? "active" : ""}`} onClick={() => setTabKey(3)}>Project Details</span>
        </div>
      </Card>

      {tabKey == 1 && <Row gutter={24} className="content-section">
        <Col span={16}>
          <Card >
            <div style={{    display: 'flex',    justifyContent: 'space-between'}}>
            <div>
            <Title level={4} className='mb-4'>Project Timeline</Title>

            {contractInfo.timeline ? <ProjectTimeline 
              contract={contractInfo}
              onTimelineUpdate={() => {
                getContractDetails({
                  _id: id
                });
              }}
            /> : <div>No timeline data available</div>}
            </div>
            <div>
            <Title level={4} className='mb-4'></Title>
            <div style={cardStyle}>
      <div style={sectionStyle}>
        <Text type="secondary">Contract Started</Text><br/>
        <Text strong>26 Jul 2022 5:00 AM</Text>
      </div>
      <div style={sectionStyle}>
        <Text type="secondary">Payment Status</Text><br/>
        <Text strong>Payment Held In Escrow</Text>
      </div>
      <div style={sectionStyle}>
        <Text type="secondary">Project Status</Text><br/>
        <Text strong>Awaiting Brand Feedback</Text>
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
                  <div>Date Posted:</div>
                  <strong> 02 May 2023</strong>
                </Paragraph>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div><BagIcon /></div>
              <div>
                <Paragraph>
                  <div>Type:</div>
                  <strong> Physical Product – Video Ad</strong>
                </Paragraph>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div><VideoCamIcon /></div>
              <div>
                <Paragraph>
                  <div>Videos Required:</div> <strong>15s x2, 60s x1</strong>
                </Paragraph>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div><MonitorPlatformIcon /></div>
              <div>
                <Paragraph>
                  <div>Platform & Ratio:</div>
                  <strong> Instagram, TikTok. Aspect ratio: 4:5</strong>
                </Paragraph>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div><BudgetIcon /></div>
              <div>
                <Paragraph>
                  <div>Budget:</div> <strong>$500</strong>
                </Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>}

      {tabKey == 2 && contractInfo?.timeline?.length > 0 && <ChatInterface 
            contractInfo={contractInfo}
            onTimelineUpdate={() => {
              getContractDetails({
                _id: id
              });
            }}
          />}

      {tabKey == 3 && <CampaignInfo id={contractInfo.campaign_id} />}
    </div>
  );
};

export default ViewProject;


const ProjectTimeline = ({ contract, onTimelineUpdate }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("main_user"));
  const isBrand = user.role === 'Brand';

  const handleUpload = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api.uploadFile("Users", {
        file: reader.result,
        extension: info.file.name.split(".").pop(),
      }).then((res) => {
        if (res.success) {
          setUploadedFiles([...uploadedFiles, res.url]);
          setLoading(false);
          info.onSuccess();
        }
      });
    };
  };

  const updateTimeline = async (newTimelineItem) => {
    try {
      // Get latest contract data
      const latestContract = await api.getSingle('Contracts', { _id: contract._id });
      
      // Append new timeline item
      const updatedTimeline = [...latestContract.data.timeline, newTimelineItem];
      
      // Update contract
      await api.update('Contracts', {
        _id: contract._id,
        timeline: updatedTimeline
      });

      onTimelineUpdate();
      message.success('Timeline updated successfully');
    } catch (error) {
      message.error('Failed to update timeline');
    }
  };

  const handleProductReceived = async () => {
    const timelineItem = {
      type: 'product_received',
      data: {
        brand_text: 'Creator received products',
        creator_text: 'You received products',
        date: new Date()
      }
    };
    await updateTimeline(timelineItem);
  };

  const handleContentSubmit = async () => {
    const timelineItem = {
      type: 'content_delivered',
      data: {
        brand_text: 'Content delivered by creator',
        creator_text: 'You delivered content',
        date: new Date(),
        files: uploadedFiles
      }
    };
    await updateTimeline(timelineItem);
    setIsModalVisible(false);
    setUploadedFiles([]);
  };

  const handleRevisionRequest = async () => {
    const timelineItem = {
      type: 'revision_requested',
      data: {
        brand_text: 'Revision requested by you',
        creator_text: `Revision requested by ${contract.created_by.name}`,
        date: new Date(),
        feedback
      }
    };
    await updateTimeline(timelineItem);
    setIsModalVisible(false);
    setFeedback('');
  };

  const handleMarkComplete = async () => {
    const timelineItem = {
      type: 'project_completed',
      data: {
        brand_text: 'Project marked as complete',
        creator_text: `Project completed by ${contract.created_by.name}`,
        date: new Date(),
        status: 'Completed'
      }
    };
    await updateTimeline(timelineItem);
  };

  const renderTimelineItem = (item) => {
    const text = isBrand ? item.data.brand_text : item.data.creator_text;
    const date = new Date(item.data.date).toLocaleString();

    return (
      <Timeline.Item 
        key={item.data.date}
        dot={item.type === 'content_delivered' ? <PaperClipOutlined /> : <ClockCircleOutlined />}
      >
        <div className="timeline-item">
          <div className="timeline-header">
            <div className="font-weight-bold">{text}</div>
            <div className="text-sm text-gray-500">{date}</div>
          </div>

          {item.data.amount && (
            <div className="timeline-amount">
              ${item.data.amount}
            </div>
          )}

          {item.data.files && item.data.files.length > 0 && (
            <div className="timeline-files">
              {item.data.files.map((file, index) => (
                <Image
                  key={index}
                  width={200}
                  preview={{
                    destroyOnClose: true,
                    imageRender: () => (
                      file.endsWith('.mp4') || file.endsWith('.mov') ? (
                        <video
                          muted
                          width="100%"
                          controls
                          src={file}
                        />
                      ) : (
                        <img src={file} alt="content" />
                      )
                    ),
                    toolbarRender: () => null,
                  }}
                  src={file}
                />
              ))}
            </div>
          )}

          {item.data.feedback && (
            <div className="timeline-feedback mt-2">
              <div className="text-gray-600">Feedback:</div>
              <div>{item.data.feedback}</div>
            </div>
          )}

          {item.type === 'content_delivered' && isBrand && (
            <div className="timeline-actions mt-4 space-x-4">
              <Button 
                className='secondary-color-btn'
                onClick={() => {
                  setIsModalVisible(true);
                }}
              >
                Request Revision
              </Button>
              <Button 
                className='primary-solid-button'
                onClick={handleMarkComplete}
              >
                Mark Complete
              </Button>
            </div>
          )}
        </div>
      </Timeline.Item>
    );
  };

  const renderActionButton = () => {
    const lastItem = contract.timeline[contract.timeline.length - 1];
    if (!lastItem) return null;

    if (!isBrand && lastItem.type === 'product_shipped' && !contract.timeline.find(t => t.type === 'product_received')) {
      return (
        <Button onClick={handleProductReceived}>
          Mark as Received
        </Button>
      );
    }

    if (!isBrand && lastItem.type === 'product_received' && !contract.timeline.find(t => t.type === 'content_delivered')) {
      return (
        <Button onClick={() => setIsModalVisible(true)}>
          Submit Content
        </Button>
      );
    }

    return null;
  };

  return (
    <div>
      <Timeline>
        {contract.timeline.map(renderTimelineItem)}
      </Timeline>

      {renderActionButton()}

      <Modal
        title={isBrand ? "Request Revision" : "Submit Content"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={isBrand ? handleRevisionRequest : handleContentSubmit}
      >
        {isBrand ? (
          <TextArea
            rows={4}
            placeholder="Enter revision feedback..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        ) : (
          <Upload
            customRequest={handleUpload}
            multiple={true}
            showUploadList={true}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              Upload Files
            </Button>
          </Upload>
        )}
      </Modal>
    </div>
  );
};