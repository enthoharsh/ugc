import React from 'react';
import { Card, Typography, Badge, Button } from 'antd';
import { VideoCameraOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MarketPlaceCard = ({ product }) => {

  return (
    <Card
    hoverable
    cover={<img alt={product.title} src={product.imageUrl} />}
    bordered={false}
    style={{ borderRadius: '12px', overflow: 'hidden',width:'290px',border:'1px solid #8080802b' ,position:'relative'}}
  >
        <button className='cardFloatButton'>How to video</button>
    {/* <Badge.Ribbon text="How-to video" color="#6b5bfc" icon={<VideoCameraOutlined />}> */}
      <div>
        <Title level={4} style={{ margin: '0 0 8px', color: '#333' }}>{product.price}</Title>
        <Text strong>{product.title}</Text>
        <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Jobs available</Text>
          <Text>{product.jobs}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text type="secondary">Product value</Text>
          <Text>{product.value}</Text>
        </div>
      </div>
    {/* </Badge.Ribbon> */}
  </Card>
  );
};

export default MarketPlaceCard;
