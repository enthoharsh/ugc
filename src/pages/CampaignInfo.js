import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Card, Typography, Button, InputNumber, message, Checkbox, Divider, Tag, Spin, DatePicker } from "antd";
import { DownloadOutlined, EyeOutlined, ArrowLeftOutlined, FileOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BagIcon, BudgetIcon, CalenderIcon, MonitorPlatformIcon, VideoCamIcon } from "components/icons";
import { Modal, Form, Input } from "antd";
import { api } from 'auth/FetchInterceptor';
import moment from 'moment';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const CampaignInfo = (props) => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [campaignInfo, setCampaignInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  let { id } = useParams();
  const history = useHistory();

  // If id comes from props (when used as a component), use that
  if (props.id) {
    id = props.id;
  }

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
  const getVideoRequirements = (videosObj) => {
    if (!videosObj) return "Not specified";
    
    const result = [];
    Object.entries(videosObj).forEach(([duration, details]) => {
      if (details.quantity && details.quantity > 0) {
        result.push(`${duration}s × ${details.quantity}`);
      }
    });
    
    return result.length > 0 ? result.join(", ") : "None";
  };

  // Handle modal visibility
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  // Handle application submission
  const onFinish = async (values) => {
    try {
      // Convert deadline to ISO string if it exists
      const formattedValues = {
        ...values,
        deadline_date: values.deadline_date ? values.deadline_date.toDate() : undefined,
        campaign_id: id,
        user_id: JSON.parse(localStorage.getItem("main_user"))._id
      };

      const resp = await api.save('Applications', formattedValues);

      if (resp.success) {
        message.success(resp.message || 'Application submitted successfully');
        setIsModalOpen(false);
        form.resetFields();
      } else {
        message.error(resp.message || 'Failed to submit application');
        console.error(resp.error);
      }
    } catch (error) {
      console.error('Application submission error:', error);
      message.error('Failed to submit application. Please try again.');
    }
  };

  // Fetch campaign details
  const getCampaignDetails = async (payload) => {
    try {
      setLoading(true);
      const campaignResp = await api.getSingle('Campaigns', payload);
      if (campaignResp && campaignResp.data) {
        setCampaignInfo(campaignResp.data);
      } else {
        message.error('Failed to fetch campaign details');
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
      getCampaignDetails({ _id: id });
    } else if (!props.id) {
      history.goBack();
    }
  }, [id, props.id]);

  // Component to handle criteria selection in the form
  const CriteriaSelection = ({ campaignInfo, value = [], onChange }) => {
    const handleTagChange = (tag, checked) => {
      const nextSelectedTags = checked
        ? [...value, tag]
        : value.filter(t => t !== tag);
      onChange?.(nextSelectedTags);
    };
  
    // Group definitions based on campaign info
    const groups = [
      { title: 'Gender', items: campaignInfo?.genders || [] },
      { title: 'Age', items: campaignInfo?.ages || [] },
      { title: 'Distinctives', items: campaignInfo?.distinctives || [] },
      { title: 'Language', items: campaignInfo?.languages || [] },
      { title: 'Accent', items: campaignInfo?.accents || [] },
      { title: 'Including', items: campaignInfo?.includings || [] },
      { title: 'Settings', items: campaignInfo?.settings || [] }
    ];
  
    return (
      <div className="space-y-6 creator-criteria-container">
        {groups.map(group => (
          group.items && group.items.length > 0 && (
            <div key={group.title} className="space-y-2">
              <div className="text-sm font-semibold text-gray-700 mb-2 mt-2">
                {group.title}
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map(tag => (
                  <Tag.CheckableTag
                    key={tag}
                    checked={value.includes(tag)}
                    onChange={checked => handleTagChange(tag, checked)}
                  >
                    {tag}
                  </Tag.CheckableTag>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  // Render loading state while fetching data
  if (loading && !campaignInfo) {
    return <div className="loading-container"><Spin size="large" /></div>;
  }

  return (
    <>
      {/* Application Modal */}
      <Modal
        title="Submit Project Application"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={'60%'}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            label="Project Amount"
            name="amount"
            rules={[
              { required: true, message: "Please enter the project amount!" },
              { type: 'number', min: 1, message: "Amount must be greater than 0" }
            ]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="What is the price that you want to pitch for this project?"
              formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            label="Cover Letter"
            name="cover_letter"
            rules={[
              { required: true, message: "Please write a cover letter!" },
              { min: 50, message: "Cover letter should be at least 50 characters" }
            ]}
          >
            <TextArea 
              rows={4} 
              placeholder="Write your cover letter here. Explain why you're a good fit for this project and how you plan to approach it." 
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item
            label="Criteria You Meet"
            name="criterias"
            rules={[
              { required: true, message: "Please select at least one criteria you meet!" },
              { type: 'array', min: 1, message: "Please select at least one criteria" }
            ]}
          >
            <CriteriaSelection campaignInfo={campaignInfo} />
          </Form.Item>

          <Form.Item
            label="Project Deadline (from you)"
            name="deadline_date"
            rules={[
              { required: true, message: "Please select a deadline!" },
            ]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              disabledDate={(current) => current && current < moment().endOf('day')}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <p>
            <i>
              We will include your portfolio/profile and other details added on
              your profile by default with this application.
            </i>
          </p>

          <Form.Item>
            <Button 
              type="primary"
              htmlType="submit" 
              className="primary-solid-button" 
              style={{ marginRight: 8 }}
            >
              Submit Application
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Main Content */}
      {campaignInfo ? (
        <div className="campaign-container">
          <Title level={2}>Project Details</Title>
          <div className="campaign-header">
            <div 
              className="back-button" 
              style={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'black' }} 
              onClick={() => history.goBack()}
            >
              <ArrowLeftOutlined style={{ marginRight: '15px' }} />
              Back
            </div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              {/* Only show apply button for creators on the marketplace page */}
              {window.location.href.includes("creator") && (
                <Button className="primary-color-btn" onClick={showModal}>
                  Submit Application
                </Button>
              )}
            </div>
          </div>

          <Row gutter={24}>
            {/* Main Content */}
            <Col span={16}>
              <Card className="main-card">
                <Title level={3} className="campaign-title">
                  {campaignInfo.campaign_name || 'Untitled Campaign'}
                </Title>

                <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                  <div style={{ width: "20%" }}>
                    <strong>Product</strong>
                  </div>
                  <div style={{ width: "80%" }}>
                    {campaignInfo.product_name || 'Not specified'}
                  </div>
                </div>
                <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                  <div style={{ width: "20%" }}>
                    <strong>Brand</strong>
                  </div>
                  <div style={{ width: "80%" }}>
                    {campaignInfo.brand_name || 'Not specified'}
                  </div>
                </div>
                <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                  <div style={{ width: "20%" }}>
                    <strong>Category</strong>
                  </div>
                  <div style={{ width: "80%" }}>
                    {Array.isArray(campaignInfo.categories) && campaignInfo.categories.length > 0 
                      ? campaignInfo.categories.join(", ") 
                      : 'Not specified'}
                  </div>
                </div>
                <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                  <div style={{ width: "20%" }}>
                    <strong>Creator Criteria</strong>
                  </div>
                </div>
                <div className="criteria-tags">
                  {[
                    ...(campaignInfo.genders || []), 
                    ...(campaignInfo.ages || []), 
                    ...(campaignInfo.distinctives || []), 
                    ...(campaignInfo.languages || []), 
                    ...(campaignInfo.accents || []), 
                    ...(campaignInfo.includings || []), 
                    ...(campaignInfo.settings || [])
                  ].map((item, index) => (
                    item && <span key={index} className="mr-2 status-badge status-criteria mb-2">{item}</span>
                  ))}
                </div>

                <Paragraph>
                  <strong>What brand wants to see in the video:</strong>
                </Paragraph>
                <Paragraph>
                  {campaignInfo.what_do_you_want_to_see_in_the_video || 'Not specified'}
                </Paragraph>

                <Paragraph>
                  <strong>What brand wants creators to say:</strong>
                </Paragraph>
                <Paragraph>
                  {campaignInfo.what_do_you_want_them_to_say || 'Not specified'}
                </Paragraph>

                <Paragraph>
                  <strong>Call to Action:</strong>
                </Paragraph>
                <Paragraph>
                  {campaignInfo.what_is_the_call_to_action || 'Not specified'}
                </Paragraph>

                {campaignInfo.any_other_specific_criteria && (
                  <>
                    <Paragraph>
                      <strong>Other Criteria:</strong>
                    </Paragraph>
                    <Paragraph>
                      {campaignInfo.any_other_specific_criteria}
                    </Paragraph>
                  </>
                )}

                <Paragraph>
                  <strong>Brand Links:</strong> {Array.isArray(campaignInfo.brand_website_social_platforms) ? 
                    campaignInfo.brand_website_social_platforms.filter(Boolean).join(", ") || 'None provided' : 
                    'None provided'}
                </Paragraph>
                <Paragraph>
                  <strong>Product Gifted:</strong> {campaignInfo.will_the_product_be_gifted_to_the_creator ? "Yes" : "No"}
                </Paragraph>
                <Paragraph>
                  <strong>Shipping Required:</strong> {campaignInfo.do_you_need_to_ship_your_product_to_the_creators ? "Yes" : "No"}
                </Paragraph>

                {campaignInfo.upload_script_or_other_assets && campaignInfo.upload_script_or_other_assets.length > 0 && (
                  <>
                    <Paragraph>
                      <strong>Uploaded Assets:</strong>
                    </Paragraph>
                    <div className="uploaded-assets">
                      {campaignInfo.upload_script_or_other_assets.map((asset, index) => (
                        <div key={index} className="asset-item">
                          <FileOutlined /> 
                          <a href={asset?.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '5px' }}>
                            {asset?.name || `Asset ${index + 1}`}
                          </a>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </Col>

            {/* Side Panel */}
            <Col span={8}>
              <Card className="side-card">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div><CalenderIcon /></div>
                  <div>
                    <Paragraph>
                      <div>Date Posted:</div>
                      <strong>
                        {formatDate(campaignInfo.createdAt)}
                      </strong>
                    </Paragraph>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div><BagIcon /></div>
                  <div>
                    <Paragraph>
                      <div>Type:</div>
                      <strong>
                        {campaignInfo.video_type || 'Not specified'}
                      </strong>
                    </Paragraph>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div><VideoCamIcon /></div>
                  <div>
                    <Paragraph>
                      <div>Videos Required:</div>
                      <strong>{getVideoRequirements(campaignInfo.videos_from_creator)}</strong>
                    </Paragraph>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div><MonitorPlatformIcon /></div>
                  <div>
                    <Paragraph>
                      <div>Platform & Ratio:</div>
                      <strong>
                        {Array.isArray(campaignInfo.what_platforms_is_it_for) ? 
                          campaignInfo.what_platforms_is_it_for.join(", ") : 'Not specified'}
                        {campaignInfo.video_aspect_ratio ? `. Aspect ratio: ${campaignInfo.video_aspect_ratio}` : ''}
                      </strong>
                    </Paragraph>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div><BudgetIcon /></div>
                  <div>
                    <Paragraph>
                      <div>Budget:</div>
                      <strong>${campaignInfo.campaign_budget || 'Not specified'}</strong>
                    </Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="campaign-not-found">
          <Title level={4}>Campaign not found or you don't have permission to view it.</Title>
          <Button type="primary" onClick={() => history.goBack()}>Go Back</Button>
        </div>
      )}
    </>
  );
};

export default CampaignInfo;