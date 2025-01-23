// AllCampaigns.js
import React, { useEffect } from 'react';
import { Input, Card, Button, Space, Select, Pagination } from 'antd';
import { SearchOutlined, MoreOutlined, TeamOutlined } from '@ant-design/icons';
import { HangerIcon, ImageIcon, PlatformIcon, UserIcon } from 'components/icons';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { api } from 'auth/FetchInterceptor';

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

  useEffect(() => {
    api.get("Campaigns").then((res) => {
      console.log(res);
    });
  }, []);

  const createCampaign = () => {
    api.save("Campaigns", {
      what_are_you_promoting: "Promoting",
      video_type: "Video Type",
      videos_from_creator: "Videos From Creator",
      what_platforms_is_it_for: "Platforms",
      video_aspect_ratio: "Aspect Ratio",
      genders: ["Male", "Female"],
      ages: ["18-24", "25-34"],
      distinctives: ["Distinctive"],
      languages: ["English"],
      accents: ["Accent"],
      includings: ["Including"],
      settings: ["Setting"],
      any_other_specific_criteria: "Specific Criteria",
      product_name: "Product Name",
      brand_name: "Brand Name",
      product_brand_logo: "Brand Logo",
      categories: ["Category"],
      campaign_budget: 1000,
      target_audience: "Target Audience",
      what_do_you_want_to_see_in_the_video: "Video Details",
      what_do_you_want_them_to_say: "Video Details",
      what_is_the_call_to_action: "Call To Action",
      will_the_product_be_gifted_to_the_creator: true,
      brand_website_social_platforms: ["Website", "Social Platform"],
      do_you_need_to_ship_your_product_to_the_creators: true,
      upload_script_or_other_assets: ["Script", "Assets"],
    }).then((res) => {
      console.log(res);
    });
  };

  const updateCampaign = () => {
    api.update("Campaigns", {
      _id: "67924abd5d6bf8bbb283f2d5",
      what_are_you_promoting: "Promoting",
      video_type: "Video Type",
      videos_from_creator: "Videos From Creator",
      what_platforms_is_it_for: "Platforms",
      video_aspect_ratio: "Aspect Ratio",
      genders: ["Male", "Female"],
      ages: ["18-24", "25-34"],
      distinctives: ["Distinctive"],
      languages: ["English"],
      accents: ["Accent"],
      includings: ["Including"],
      settings: ["Setting"],
      any_other_specific_criteria: "Specific Criteria",
      product_name: "Product Name",
      brand_name: "Brand Name",
      product_brand_logo: "Brand Logo",
      categories: ["Category"],
      campaign_budget: 1000,
      target_audience: "Target Audience",
      what_do_you_want_to_see_in_the_video: "Video Details",
      what_do_you_want_them_to_say: "Video Details",
      what_is_the_call_to_action: "Call To Action",
      will_the_product_be_gifted_to_the_creator: true,
      brand_website_social_platforms: ["Website", "Social Platform"],
      do_you_need_to_ship_your_product_to_the_creators: true,
      upload_script_or_other_assets: ["Script", "Assets"],
    },
    "67924abd5d6bf8bbb283f2d5"
    ).then((res) => {
      console.log(res);
    });
  };

  const deleteCampaign = () => {
    api.delete("Campaigns", "67924abd5d6bf8bbb283f2d5").then((res) => {
      console.log(res);
    });
  };

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
        <Button type="primary" className="allCamp-new-campaign-btn" onClick={createCampaign}>
          + New Campaign (Order Form)
        </Button>
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