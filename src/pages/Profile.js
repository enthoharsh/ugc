import data from "../assets/Videos.json";

import React from "react";
import { Avatar, Card, Image, Space, Switch, Typography } from "antd";
import { FacebookOutlined, InstagramOutlined, LinkedinOutlined, TwitterOutlined } from "@ant-design/icons";
import { FacebookColorIcon, InstaColorIcon, LinkedInColorIcon, TweeterColorIcon } from "components/icons";

const { Title, Text } = Typography;

const ProfileCard = () => {
  return (
    <>
    <div className="profile-card">
      <div className="background-image" style={{background:"url(https://images.unsplash.com/photo-1736254329261-5595925b7e25?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)"}}>
      </div>
      <div className="content">
        <div className="profile-header">
          <Avatar size={100} style={{border:'1px solid white'}} src="https://i.pravatar.cc/101" />
          <div className="profile-info">
            <Title style={{color:'white',marginBottom: 0}} level={3}>Mireya Conner</Title>
            <Text style={{color:'white',marginBottom:'6px'}}>Canada</Text>
          </div>
        </div>
        <div className="availability">
          <Text>Are you available for new projects?</Text>
          <Switch defaultChecked />
        </div>
        <div style={{display:'flex',gap:'28px'}}>

        <div className="bio-section" style={{width:'50%'}}>
          <Title level={4}>Creator Bio</Title>
          <Text>
          Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer. Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer. Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer. Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer. Tart I love sugar plum I love oat cake. Sweet roll caramels I love jujubes. Topping cake wafer.
          </Text>
        </div>
        <div className="social-links">
          <Title level={4}>Social Links</Title>
          <div title="Social Links" className="social-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <a href="https://www.facebook.com/name" className="social-link">
              <FacebookColorIcon /> https://www.facebook.com/name
            </a>
            <a href="https://www.instagram.com/name" className="social-link">
              <InstaColorIcon /> https://www.instagram.com/name
            </a>
            <a href="https://linkedin.com/in/name" className="social-link">
              <LinkedInColorIcon /> linkedin.com/in/name
            </a>
            <a href="https://www.twitter.com/name" className="social-link">
              <TweeterColorIcon /> https://www.twitter.com/name
            </a>
          </Space>
        </div>
        </div>
        </div>
      </div>
    <div className="portfolio-grid" style={{padding:'20px'}}>
     {data.map((item) => (
       <Card key={item} className="portfolio-item">
         <div className="video-container">
           <img src={item.thumbnailUrl} alt="North Face Video" />
           <div className="play-button">▶</div>
         </div>
         <div className="video-info">
           <h5>North Face Video</h5>
           <p>28 Nov 2024</p>
         </div>
       </Card>
     ))}
   </div>
    </div>
    </>
  );
};

export default ProfileCard;
