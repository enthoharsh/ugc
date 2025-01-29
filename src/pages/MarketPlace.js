import { Input, Select } from 'antd';
import MarketPlaceCard from 'components/MarketplaceCard'
import React, { useEffect } from 'react'
import {SearchOutlined} from '@ant-design/icons'
import { api } from 'auth/FetchInterceptor';
const { Option } = Select;

const MarketPlace = () => {
  const [campaigns, setCampaigns] = React.useState([]);

  useEffect(() => {
    api.get("Campaigns").then((res) => {
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
  }, []);

  return (
    <>
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

    <div className='d-flex' style={{gap:'10px',flexWrap:'wrap'}}>
        {campaigns.map((elm,i)=> <MarketPlaceCard campaign={elm} key={i}/>)}
    </div>
    </>
  )
}

export default MarketPlace
