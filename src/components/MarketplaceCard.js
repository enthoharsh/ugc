import React from 'react';
import { Card, Typography, Badge, Button, Space } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';
import { HangerIcon, ImageIcon, PlatformIcon, UserIcon } from './icons';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const { Title, Text } = Typography;

const MarketPlaceCard = ({ product }) => {

  return (
    <Card
    // hoverable
    cover={<img alt={product.title} src={product.imageUrl} />}
    bordered={false}
    className='allCamp-campaign-card'
    style={{ borderRadius: '12px', overflow: 'hidden',width:'360px',border:'1px solid #8080802b' ,position:'relative',boxShadow:'0 0 0 '}}
  >
        {/* <button className='cardFloatButton'>How to video</button> */}
    {/* <Badge.Ribbon text="How-to video" color="#6b5bfc" icon={<VideoCameraOutlined />}> */}
      <div>
        <div style={{padding:'20px'}}>
        <h3>{product.title}</h3>
            <p className="allCamp-date m-0">2024 campaign for our new jackets</p>
            <p className="allCamp-date m-0">Posted date: 12-03-2025</p>
        </div>
        {/* <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Jobs available</Text>
          <Text>{product.jobs}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Product value</Text>
          <Text>{product.value}</Text>
        </div> */}
        <div className="allCamp-card-details" style={{padding:'20px',paddingBottom:'10px'}}>
              <Space direction="vertical" size="small" className="allCamp-details-space">
                <div className="allCamp-detail-item">
                  <span className="allCamp-detail-label"><HangerIcon style={{color: "#EB2F96"}}/> Product</span>
                 
                </div>
                <div className="allCamp-detail-item">
                  <span className="allCamp-detail-label"><ImageIcon style={{color: "#EB2F96"}}/> Reel Style</span>
                </div>
              </Space>
              <Space direction="vertical" size="small" className="allCamp-details-space">
                <div className="allCamp-detail-item">
                  <div className="allCamp-platform-tags">
                    <PlatformIcon style={{color: "#EB2F96"}}/> 
                    {/* {product.platforms.map(platform => (
                      ))} */}
                      <span className="allCamp-platform-tag">Instagram</span>
                      <span className="allCamp-platform-tag">TikTok</span>
                  </div>
                </div>
                <div className="allCamp-detail-item">
                  <span className="allCamp-creators-needed"><UserIcon style={{color: "#EB2F96"}}/> 3 creators needed</span>
                </div>
              </Space>
            </div>
            <Link
            to={`marketplace/view-project/${7}`}
            style={{
                color: "#EB2F96",
                margin:'0 20px 20px 20px',
                display:'block'
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
