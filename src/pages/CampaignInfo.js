// import "./css/campainInfo.css";
import React, { useEffect, useState } from "react";
import { useParams,useHistory } from 'react-router-dom';
import { Row, Col, Card, Typography, Button, InputNumber, message } from "antd";
import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { BagIcon, BudgetIcon, CalenderIcon, MonitorPlatformIcon, VideoCamIcon } from "components/icons";
import { Modal, Form, Input, DatePicker } from "antd";
import { api } from 'auth/FetchInterceptor';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const CampaignInfo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams(); 
  const history = useHistory();
    const showModal = () => {
        setIsModalOpen(true);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
      const onFinish = async (values) => {
        console.log("Form Values: ", values);
        const data = {
          ...values,
          campaign_id:id,
          user_id:localStorage.getItem('user_id') || 1
        }
        const resp = await api.save('Applications',data);
        console.log("res",resp);
        if (resp.statusCode==200) {
          message.success(resp.message)
          setIsModalOpen(false);
          form.resetFields()
        } else {
          console.log(resp.error);
          form.resetFields()
          message.error(resp.message)
        }
      };
      const getCampaignInfo =()=>{

      }
  useEffect(() => {
    if (id) {
      getCampaignInfo({})
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
            <InputNumber style={{width:'100%'}} placeholder="What is the price that you want to pitch for this project?" />
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
    <div className="campaign-container">
    <Title level={2}>Project Details</Title>
      <div className="campaign-header">
        {/* Back Button */}

        {/* <Button type="link" className="back-button">
          &lt; Back
        </Button> */}
        <div style={{display:'flex',gap:'8px',marginLeft:'auto'}}>
        <Button className="primary-color-btn" onClick={showModal}>
            Submit Application
        </Button>
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
              North Face Jacket Campaign
            </Title>

            <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "20%" }}>
                <strong>Product</strong>{" "}
              </div>
              <div style={{ width: "80%" }}>North Face Jacket</div>
            </div>
            <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "20%" }}>
                <strong>Brand</strong>{" "}
              </div>
              <div style={{ width: "80%" }}>North Face</div>
            </div>
            <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "20%" }}>
                <strong>Category</strong>{" "}
              </div>
              <div style={{ width: "80%" }}>Style, Beauty</div>
            </div>
            <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
              <div style={{ width: "20%" }}>
                <strong>Creator Criteria</strong>{" "}
              </div>
            </div>
            <div className="criteria-tags">
              <span className="mr-2 status-badge status-criteria">Male</span>
              <span className="mr-2 status-badge status-criteria">Asian</span>
              <span className="mr-2 status-badge status-criteria">18-30</span>
              <span className="mr-2 status-badge status-criteria">English</span>
              <span className="mr-2 status-badge status-criteria">Baby</span>
            </div>

            <Paragraph>
              <strong>What brand wants to see in the video:</strong>
            </Paragraph>
            <ul>
              <li>
                Working with agency for design drawing detail, quotation and
                local production.
              </li>
              <li>
                Produce window displays, signs, interior displays, floor plans
                and special promotions displays.
              </li>
              <li>
                Change displays to promote new product launches and reflect
                festive or seasonal themes.
              </li>
              <li>
                Planning and executing the open/renovation/closing store
                procedure.
              </li>
              <li>
                Follow-up store maintenance procedure and keep updating SKU In &
                Out.
              </li>
              <li>Monitor costs and work within budget.</li>
              <li>Liaise with suppliers and source elements.</li>
            </ul>

            <Paragraph>
              <strong>What brand wants creators to say:</strong>
            </Paragraph>
            <ul>
              <li>
                Working with agency for design drawing detail, quotation and
                local production.
              </li>
              <li>
                Produce window displays, signs, interior displays, floor plans
                and special promotions displays.
              </li>
              <li>
                Change displays to promote new product launches and reflect
                festive or seasonal themes.
              </li>
              <li>
                Planning and executing the open/renovation/closing store
                procedure.
              </li>
              <li>
                Follow-up store maintenance procedure and keep updating SKU In &
                Out.
              </li>
              <li>Monitor costs and work within budget.</li>
              <li>Liaise with suppliers and source elements.</li>
            </ul>

            <Paragraph>
              <strong>Other Criteria:</strong> Should have lorem ipsum dolor
            </Paragraph>
            <Paragraph>
              <strong>Brand Links:</strong> www.abc.com, www.123.com
            </Paragraph>
            <Paragraph>
              <strong>Product Gifted:</strong> Not Gifted
            </Paragraph>

            {/* Attachment */}
            <div className="attachment-section">
              <Button type="default" icon={<DownloadOutlined />} size="middle">
                1 Attachment
              </Button>
            </div>
          </Card>
        </Col>

        {/* Side Panel */}
        <Col span={8}>
          <Card className="side-card">
            <div style={{display:'flex',gap:'10px'}}>
              <div><CalenderIcon/></div>
              <div>
                <Paragraph>
                  <div>Date Posted:</div>
                  <strong> 02 May 2023</strong>
                </Paragraph>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <div><BagIcon/></div>
              <div>
                <Paragraph>
                  <div>Type:</div>
                  <strong> Physical Product – Video Ad</strong>
                </Paragraph>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <div><VideoCamIcon/></div>
              <div>
              <Paragraph>
              <div>Videos Required:</div> <strong>15s x2, 60s x1</strong>
            </Paragraph>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <div><MonitorPlatformIcon/></div>
              <div>
              <Paragraph>
              <div>Platform & Ratio:</div>
              <strong> Instagram, TikTok. Aspect ratio: 4:5</strong>
            </Paragraph>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px'}}>
              <div><BudgetIcon/></div>
              <div>
              <Paragraph>
              <div>Budget:</div> <strong>$500</strong>
            </Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
    </>
  );
};

export default CampaignInfo;
