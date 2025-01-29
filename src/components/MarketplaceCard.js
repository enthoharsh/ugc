import React from 'react';
import { Card, Typography, Badge, Button, Space } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { HangerIcon, ImageIcon, PlatformIcon, UserIcon } from './icons';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const { Title, Text } = Typography;

const MarketPlaceCard = ({ campaign }) => {

  return (
    <Card
      cover={<img alt={campaign.campaign_name} src={campaign.product_brand_logo} style={{
        maxHeight: '200px',
        objectFit: 'cover',
      }} />}
      bordered={false}
      className='allCamp-campaign-card'
      style={{ borderRadius: '12px', overflow: 'hidden', width: '360px', border: '1px solid #8080802b', position: 'relative', boxShadow: '0 0 0 ' }}
    >
      <div>
        <div style={{ padding: '20px' }}>
          <h3>{campaign.campaign_name}</h3>
          <p className="allCamp-date m-0">Posted date: {new Date(campaign.createdAt).toDateString()}</p>
        </div>
        <div className="allCamp-card-details" style={{ padding: '20px', paddingBottom: '10px' }}>
          <Space direction="vertical" size="small" className="allCamp-details-space">
            <div className="allCamp-detail-item">
              <span className="allCamp-detail-label"><HangerIcon style={{ color: "#EB2F96" }} /> {campaign.video_type}</span>

            </div>
            <div className="allCamp-detail-item">
              <span className="allCamp-detail-label"><ImageIcon style={{ color: "#EB2F96" }} /> {campaign.what_are_you_promoting}</span>
            </div>
          </Space>
          <Space direction="vertical" size="small" className="allCamp-details-space">
            <div className="allCamp-detail-item">
              <div className="allCamp-platform-tags">
                <PlatformIcon style={{ color: "#EB2F96" }} />
                {campaign.platforms.map(platform => (
                  <span key={platform} className="allCamp-platform-tag">{platform}</span>
                ))}
              </div>
            </div>
            <div className="allCamp-detail-item">
              <span className="allCamp-creators-needed"><UserIcon style={{ color: "#EB2F96" }} /> {campaign.creators} creators needed</span>
            </div>
          </Space>
        </div>
        <Link
          to={`marketplace/view-project/${campaign._id}`}
          style={{
            color: "#EB2F96",
            margin: '0 20px 20px 20px',
            display: 'block'
          }}
        >
          {'View Details >'}
        </Link>
      </div>
      {/* </Badge.Ribbon> */}
    </Card>
  );
};

export default MarketPlaceCard;
