// AllCampaigns.js
import React from 'react';
import { Input, Card, Button, Space, Select, Pagination } from 'antd';
import { SearchOutlined, MoreOutlined, TeamOutlined } from '@ant-design/icons';
import { HangerIcon, ImageIcon, PlatformIcon, UserIcon } from 'components/icons';
import { Link } from 'react-router-dom/cjs/react-router-dom';

const { Option } = Select;

const AllCampaigns = () => {
  const campaigns = Array(9).fill({
    title: 'North Face Jacket Campaign',
    img:'https://s3-alpha-sig.figma.com/img/9d96/bacf/2a6f28b430ffaf604168175af023db31?Expires=1737936000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=PeDj2yC-tvh24feMQ4S9jpdP0blvaaugI8UN8DK6W4Njm2mGf26e7dcwlJtks64I0AylK6BRnSOltari4H2r7dQaOJHskcviVI0TqIFHBoMut1Ue~BqHxlmVAKz6rV1fCxED5vA8QP6CL2inZgwlWkRDNM8uPbt-4bVhXMQjW3HVzBMLI6nn6n1Kf4ZYe1K0gx6Dq1BUoe1uJw-QYqsLPZQx3e~al1M3Jfyfi~xyHjkIOLEQlrsAUxTmeyCcbxqkoeZsKz6g-eNq7K9hDDf0eaJSvjgf9lbpA566hopqRDypAlLnwrAkooV7XWeCCbaGSSEDh7LxHpmlPhy~CZGbug__',
    date: '12 Jul 2022',
    proposals: 23,
    type: 'Product',
    style: 'Reel Style',
    platforms: ['Instagram', 'TikTok'],
    creators: 3
  });

  return (
    <div className="allCamp-container">
      <div className="allCamp-header">
        <div className="allCamp-title-section">
          <h1>All Campaigns</h1>
          <div className="allCamp-breadcrumb">
            <span>Campaigns</span>
            <span className="allCamp-separator">•</span>
            <span className="allCamp-active">All Campaigns</span>
          </div>
        </div>
        <Link to={'order-form'}>
        <Button type="primary" className="allCamp-new-campaign-btn">
          + New Campaign (Order Form)
        </Button>
        </Link>
      </div>

      <div className="allCamp-filters">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          className="allCamp-search-input"
        />
        <Select defaultValue="Featured" className="allCamp-sort-select">
          <Option value="Featured">Sort By: Featured</Option>
          <Option value="date">Date</Option>
          <Option value="name">Name</Option>
        </Select>
      </div>

      <div className="allCamp-campaign-grid">
        {campaigns.map((campaign, index) => (
          <Link to={`campaign-detail/${index}`}>
          <Card key={index} className="allCamp-campaign-card">
            <div style={{padding:'20px'}}>

            <div className="allCamp-card-header">
              <div className="allCamp-logo-container">
                <img src={campaign.img} alt="North Face Logo" className="allCamp-company-logo" />
              </div>
              <Button type="text" icon={<MoreOutlined />} className="allCamp-more-btn" />
            </div>
            <h3>{campaign.title}</h3>
            <p className="allCamp-date">Posted date: {campaign.date}</p>
            <p className="allCamp-proposals"><TeamOutlined /> {campaign.proposals} Proposals</p>
            
            </div>
            <div className="allCamp-card-details" style={{padding:'20px'}}>
              <Space direction="vertical" size="small" className="allCamp-details-space">
                <div className="allCamp-detail-item">
                  <span className="allCamp-detail-label"><HangerIcon/> Product</span>
                 
                </div>
                <div className="allCamp-detail-item">
                  <span className="allCamp-detail-label"><ImageIcon/> Reel Style</span>
                </div>
              </Space>
              <Space direction="vertical" size="small" className="allCamp-details-space">
                <div className="allCamp-detail-item">
                  <div className="allCamp-platform-tags">
                    <PlatformIcon/> {campaign.platforms.map(platform => (
                      <span key={platform} className="allCamp-platform-tag">{platform}</span>
                    ))}
                  </div>
                </div>
                <div className="allCamp-detail-item">
                  <span className="allCamp-creators-needed"><UserIcon/> {campaign.creators} creators needed</span>
                </div>
              </Space>
            </div>
          </Card>
          </Link>
        ))}
      </div>

      <Pagination
        defaultCurrent={1}
        total={50}
        className="allCamp-pagination"
      />
    </div>
  );
};

export default AllCampaigns;