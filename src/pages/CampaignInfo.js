// import "./css/campainInfo.css";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from 'react-router-dom';
import { Row, Col, Card, Typography, Button, InputNumber, message, Checkbox, Divider, Tag } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BagIcon, BudgetIcon, CalenderIcon, MonitorPlatformIcon, VideoCamIcon } from "components/icons";
import { Modal, Form, Input, DatePicker } from "antd";
import { api } from 'auth/FetchInterceptor';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const CampaignInfo = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  let { id } = useParams();

  if (props.id) {
    id = props.id
  }

  console.log(id);


  const history = useHistory();
  const [campaignInfo, setCampaignInfo] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    console.log(values);

    const data = {
      ...values,
      campaign_id: id,
      user_id: JSON.parse(localStorage.getItem("main_user"))._id
    }

    const resp = await api.save('Applications', data);

    if (resp.success) {
      message.success(resp.message)
      setIsModalOpen(false);
      form.resetFields()
    } else {
      console.log(resp.error);
      form.resetFields()
      message.error(resp.message)
    }
  };

  const getCampaignDetails = async (payload) => {
    const CampaignResp = await api.getSingle(`Campaigns`, payload);
    setCampaignInfo(CampaignResp.data)
  }

  useEffect(() => {
    if (id) {
      getCampaignDetails({
        _id: id
      })
    } else {
      history.goBack()
    }
  }, [id])

  return (
    <>
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
            ]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="What is the price that you want to pitch for this project?" />
          </Form.Item>

          <Form.Item
            label="Cover Letter"
            name="cover_letter"
            rules={[
              { required: true, message: "Please write a cover letter!" },
            ]}
          >
            <TextArea rows={4} placeholder="Write your cover letter here..." />
          </Form.Item>

          <Form.Item
            label="Criteria You Meet"
            name="criterias"
            rules={[
              { required: true, message: "Please select the criteria you meet!" },
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
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <p>
            <i>
              We will include your portfolio/profile and other details added on
              your profile by default with this application.
            </i>
          </p>

          <Form.Item>
            <Button htmlType="submit" className="primary-solid-button" style={{ marginRight: 8 }}>
              Submit Application
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {campaignInfo ? <div className="campaign-container">
        <Title level={2}>Project Details</Title>
        <div className="campaign-header">
          <div className="back-button" style={{ fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'black' }} onClick={() => history.goBack()}>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
              marginRight: '15px'
            }}>
              <path d="M5.52473 11.8333C5.27257 11.8341 5.03359 11.7208 4.87473 11.5249L0.849729 6.52492C0.596965 6.21742 0.596965 5.77409 0.849729 5.46659L5.0164 0.46659C5.31095 0.112207 5.83701 0.0637046 6.1914 0.358257C6.54578 0.652808 6.59428 1.17887 6.29973 1.53326L2.57473 5.99992L6.17473 10.4666C6.38281 10.7164 6.42664 11.0643 6.28702 11.3579C6.14739 11.6515 5.84979 11.8371 5.52473 11.8333Z" fill="initial" />
              </svg>
            Back
          </div>
          <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
            {window.location.href.includes("creator") && <Button className="primary-color-btn" onClick={showModal}>
              Submit Application
            </Button>}
            {/* <Link to={`#`}>
          <Button className="secondary-color-btn">
            <span>View Application</span> <EyeOutlined />
          </Button>
        </Link> */}
          </div>
        </div>

        <Row gutter={24}>
          {/* Main Content */}
          <Col span={16}>
            <Card className="main-card">
              <Title level={3} className="campaign-title">
                {campaignInfo.campaign_name}
              </Title>

              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>
                  <strong>Product</strong>{" "}
                </div>
                <div style={{ width: "80%" }}>
                  {campaignInfo.product_name}
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>
                  <strong>Brand</strong>{" "}
                </div>
                <div style={{ width: "80%" }}>
                  {campaignInfo.brand_name}
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>
                  <strong>Category</strong>{" "}
                </div>
                <div style={{ width: "80%" }}>
                  {(campaignInfo.categories || []).join(", ")}
                </div>
              </div>
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div style={{ width: "20%" }}>
                  <strong>Creator Criteria</strong>{" "}
                </div>
              </div>
              <div className="criteria-tags">
                {[...campaignInfo.genders, ...campaignInfo.ages, ...campaignInfo.distinctives, ...campaignInfo.languages, ...campaignInfo.accents, ...campaignInfo.includings, ...campaignInfo.settings].map((item, index) => (
                  <span key={index} className="mr-2 status-badge status-criteria mb-2">{item}</span>
                ))}
              </div>

              <Paragraph>
                <strong>What brand wants to see in the video:</strong>
              </Paragraph>
              <Paragraph>
                {campaignInfo.what_do_you_want_to_see_in_the_video}
              </Paragraph>

              <Paragraph>
                <strong>What brand wants creators to say:</strong>
              </Paragraph>
              <Paragraph>
                {campaignInfo.what_do_you_want_them_to_say}
              </Paragraph>

              <Paragraph>
                <strong>Other Criteria:</strong> {campaignInfo.any_other_specific_criteria}
              </Paragraph>
              <Paragraph>
                <strong>Brand Links:</strong> {(campaignInfo.brand_website_social_platforms || []).filter((item) => item).join(", ")}
              </Paragraph>
              <Paragraph>
                <strong>Product Gifted:</strong> {campaignInfo.will_the_product_be_gifted_to_the_creator ? "Yes" : "No"}
              </Paragraph>
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
                      {new Date(campaignInfo.createdAt).toLocaleDateString()}
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
                      {campaignInfo.video_type}
                    </strong>
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
                    <div>Budget:</div>
                    <strong>${campaignInfo.campaign_budget}</strong>
                  </Paragraph>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div> : <div>Loading...</div>}
    </>
  );
};

export default CampaignInfo;

const CriteriaSelection = ({ campaignInfo, value = [], onChange }) => {
  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...value, tag]
      : value.filter(t => t !== tag);
    onChange?.(nextSelectedTags);
  };

  // Group definitions
  const groups = [
    { title: 'Gender', items: campaignInfo.genders || [] },
    { title: 'Age', items: campaignInfo.ages || [] },
    { title: 'Distinctives', items: campaignInfo.distinctives || [] },
    { title: 'Language', items: campaignInfo.languages || [] },
    { title: 'Accent', items: campaignInfo.accents || [] },
    { title: 'Including', items: campaignInfo.includings || [] },
    { title: 'Settings', items: campaignInfo.settings || [] }
  ];

  return (
    <div className="space-y-6 creator-criteria-container">
      {groups.map(group => (
        group.items.length > 0 && (
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
                // className={`radio-option-box ${value.includes(tag) ? 'selected' : ''}`}
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