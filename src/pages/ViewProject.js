import React, { useEffect, useState } from 'react';
import { Timeline, Card, Row, Col, Typography, Tag, Avatar } from 'antd';
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
  DownloadOutlined,
} from '@ant-design/icons';
import CampaignInfo from './CampaignInfo';
import { useParams, useHistory } from 'react-router-dom';
import { api } from 'auth/FetchInterceptor';

const { Paragraph } = Typography;
const { Content, Sider } = Layout;
const { Text, Title } = Typography;
const { TextArea } = Input;

const ChatInterface = () => {
  const messages = [
    {
      time: '4:02 PM',
      content: 'Hey John, I am looking for the best admin template. Could you please help me to find it out? 😃',
      sender: 'user'
    },
    {
      time: '4:02 PM',
      content: 'Stack admin is the responsive bootstrap 4 admin template.',
      sender: 'other'
    },
    {
      time: '4:02 PM',
      content: 'Looks clean and fresh UI. 😃',
      sender: 'user'
    }
  ];

  const timelineItems = [
    {
      title: 'You started the contract',
      date: '2024-02-21',
      amount: '$300'
    },
    {
      title: 'You shipped products',
      date: '2024-02-22',
      trackingId: '1232132lasdsda213'
    },
    {
      title: 'Creator received products',
      date: '2024-02-25'
    },
    {
      title: 'Content delivered by creator',
      date: '2024-02-27',
      hasAttachment: true
    },
    {
      title: 'Revision requested by brand',
      date: '2024-02-27',
      hasNotes: true,
      notes: 'Please change the cta to this that lorem ipsum. Please change the cta to this that lorem ipsum. Please change the cta to this that lorem ipsum'
    }
  ];

  return (
    <Layout className="chat-layout">
      <Content style={{ padding: '24px', background: '#fff' }}>
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.sender === 'user' ? 'user-message' : ''}`}>
              <Avatar size="small" src="https://via.placeholder.com/32" />
              <div className="message-content">
                <div className="message-bubble">
                  {msg.content}
                </div>
                <Text type="secondary" className="message-time">{msg.time}</Text>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <TextArea
            placeholder="Type a message"
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <div className="input-actions">
            <Upload>
              <Button type="text" icon={<PaperClipOutlined />} />
            </Upload>
            <Button icon={<SendOutlined />} />
          </div>
        </div>
      </Content>
      <Sider width={400} theme="light" style={{ padding: '24px' }}>
        <Card title="PROJECT TIMELINE" className="timeline-card">
          <Timeline>
            {timelineItems.map((item, index) => (
              <Timeline.Item
                key={index}
                dot={item.hasAttachment ? <PaperClipOutlined /> : <ClockCircleOutlined />}
              >
                <div className="timeline-item">
                  <div className="timeline-header">
                    <Text strong>{item.title}</Text>
                    <Text type="secondary">{item.date}</Text>
                  </div>

                  {item.amount && (
                    <Text strong className="timeline-amount">{item.amount}</Text>
                  )}

                  {item.trackingId && (
                    <div className="timeline-tracking">
                      <Text>Tracking ID</Text>
                      <Text code>{item.trackingId}</Text>
                    </div>
                  )}

                  {item.hasAttachment && (
                    <div className="timeline-attachment">
                      <Text>1 attachment</Text>
                      <Button type="link" icon={<DownloadOutlined />}>
                        Download
                      </Button>
                    </div>
                  )}

                  {item.hasNotes && (
                    <div className="timeline-notes">
                      <Text type="secondary">{item.notes}</Text>
                    </div>
                  )}

                  {item.hasAttachment && (
                    <div className="timeline-actions">
                      <Button className='secondary-color-btn'>Request Revision</Button>
                      <Button className='primary-solid-button'>Mark Complete</Button>
                    </div>
                  )}
                </div>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
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
          <Card>
            <Title level={4} className='mb-4'>Project Timeline</Title>
            <Timeline>
              <Timeline.Item color="orange">
                <div className="timeline-item">
                  <Text strong>Project completed</Text>
                  <Text type="secondary">2 hours ago</Text>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="timeline-item">
                  <Text strong>Revision requested</Text>
                  <Text type="secondary">6 hours ago</Text>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="timeline-item">
                  <Text strong>Creator submitted content</Text>
                  <Text type="secondary">25 Jul 2020</Text>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="timeline-item">
                  <Text strong>Product Shipped</Text>
                  <Text type="secondary">22 Nov 2020</Text>
                </div>
              </Timeline.Item>
              <Timeline.Item>
                <div className="timeline-item">
                  <Text strong>Contract started</Text>
                  <Text type="secondary">24 Sep 2020</Text>
                </div>
              </Timeline.Item>
            </Timeline>
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
      {
        tabKey == 2 && <ChatInterface />
      }
      {tabKey == 3 && <CampaignInfo id={contractInfo.campaign_id} />}
    </div>
  );
};

export default ViewProject;