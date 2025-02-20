// AllCampaigns.js
import React, { useEffect } from 'react';
import { Input, Card, Button, Space, Select, Pagination, Dropdown, Menu } from 'antd';
import { SearchOutlined, MoreOutlined,EyeOutlined, TeamOutlined } from '@ant-design/icons';
import { HangerIcon, ImageIcon, PlatformIcon, UserIcon } from 'components/icons';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { api } from 'auth/FetchInterceptor';
import DropdownButton from 'antd/lib/dropdown/dropdown-button';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown';

const { Option } = Select;

const AllCampaigns = () => {

  const [campaigns, setCampaigns] = React.useState([]);
  const [sortBy, setSortBy] = React.useState('Name');
  const [search, setSearch] = React.useState('');

  useEffect(() => {
    api.get("Campaigns", {
      sortColumn: sortBy === 'Date' ? 'createdAt' : 'campaign_name',
      sortDirection: sortBy === 'Date' ? 'desc' : 'asc',
      search
    }).then((res) => {
      setCampaigns(res.data.data.map((campaign) => ({
        title: campaign.campaign_name,
        img: campaign.product_brand_logo,
        date: campaign.createdAt,
        proposals: campaign.proposal_count || 0,
        type: campaign.video_type,
        style: campaign.what_are_you_promoting,
        platforms: campaign.what_platforms_is_it_for,
        creators: campaign.proposal_count || 0,
        _id: campaign._id,
        ...campaign
      })));
    });
  }, [sortBy, search]);

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select defaultValue="name" className="allCamp-sort-select" style={{ width: 180 }} value={sortBy} onChange={(value) => setSortBy(value)}>
          <Option value="Date">Sort By: Date</Option>
          <Option value="Name">Sort By: Name</Option>
        </Select>
      </div>

      <div className="allCamp-campaign-grid">
        {campaigns.map((campaign, index) => (
          // <Link to={`campaign-detail/${campaign._id}`} key={index}>
          <Card key={index} className="allCamp-campaign-card">
            <div style={{padding:'20px'}}>

            <div className="allCamp-card-header">
              <div className="allCamp-logo-container">
                <img src={campaign.img} alt="North Face Logo" className="allCamp-company-logo" />
              </div>
              <EllipsisDropdown menu={
			<Menu>
				<Menu.Item>
        <Link to={`campaign-detail/${campaign._id}`} key={index}><EyeOutlined/> View Campaign</Link>
				</Menu.Item>
				<Menu.Item>
        <Link to={`campaign-detail/campaign-info/${campaign._id}`} key={index}><EyeOutlined/> Campaign Info</Link>
				</Menu.Item>
			</Menu>}/>
              {/*  <Button type="text" icon={<MoreOutlined />} className="allCamp-more-btn" /> */}
            </div>
            <h3>{campaign.title}</h3>
            <p className="allCamp-date">Posted date: {new Date(campaign.createdAt).toDateString()}</p>
            <p className="allCamp-proposals"><TeamOutlined /> {campaign.proposals} Proposals</p>
            
            </div>
            <div className="allCamp-card-details" style={{padding:'20px'}}>
              <Space direction="vertical" size="small" className="allCamp-details-space">
                <div className="allCamp-detail-item">
                  <span className="allCamp-detail-label"><HangerIcon/> {campaign.video_type}</span>
                 
                </div>
                <div className="allCamp-detail-item">
                  <span className="allCamp-detail-label"><ImageIcon/> {campaign.what_are_you_promoting}</span>
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
          // </Link>
        ))}
      </div>

      {/* <Pagination
        defaultCurrent={1}
        total={50}
        className="allCamp-pagination"
      /> */}
    </div>
  );
};

export default AllCampaigns;