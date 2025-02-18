import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  Image,
  Space,
  Switch,
  Typography,
  Button,
  Input,
  Upload,
  message,
} from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  TwitterOutlined,
  EditOutlined,
  SaveOutlined,
  UploadOutlined,
  PlusOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import {
  FacebookColorIcon,
  InstaColorIcon,
  LinkedInColorIcon,
  TweeterColorIcon,
} from "components/icons";
import { api } from "auth/FetchInterceptor";
import Dragger from "antd/lib/upload/Dragger";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ProfileCard = () => {
  const [editMode, setEditMode] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const user = JSON.parse(localStorage.getItem("main_user"));
  const isCreator = user.role === "Creator";

  // Form states
  const [formData, setFormData] = useState({
    cover_image: "",
    available: true,
    bio: "",
    social_links: [
      { platform: "facebook", url: "" },
      { platform: "instagram", url: "" },
      { platform: "linkedin", url: "" },
      { platform: "twitter", url: "" },
    ],
    videos: [],
  });

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await api.get("Portfolios", {
        tabFilter: { user_id: user._id },
      });

      console.log(response);

      if (response.data.data.length > 0) {
        const portfolioData = response.data.data[0];
        console.log(portfolioData);

        setPortfolio(portfolioData);
        setFormData({
          cover_image: portfolioData.cover_image || "",
          available: portfolioData.available ?? true,
          bio: portfolioData.bio || "",
          social_links: portfolioData.social_links?.length
            ? portfolioData.social_links
            : [
                { platform: "facebook", url: "" },
                { platform: "instagram", url: "" },
                { platform: "linkedin", url: "" },
                { platform: "twitter", url: "" },
              ],
          videos: portfolioData.videos || [],
        });
      }
      setLoading(false);
    } catch (error) {
      message.error("Failed to fetch portfolio");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const portfolioData = {
        user_id: user._id,
        ...formData,
      };

      if (portfolio) {
        await api.update("Portfolios", {
          _id: portfolio._id,
          ...portfolioData,
        }, portfolio._id);
      } else {
        await api.save("Portfolios", portfolioData);
      }

      message.success("Portfolio saved successfully");
      setEditMode(false);
      fetchPortfolio();
    } catch (error) {
      message.error("Failed to save portfolio");
    }
  };

  const handleUploadCover = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api
        .uploadFile("Users", {
          file: reader.result,
          extension: info.file.name.split(".").pop(),
        })
        .then((res) => {
          if (res.success) {
            setFormData((prev) => ({
              ...prev,
              cover_image: res.url,
            }));
            info.onSuccess();
          }
        });
    };
  };

  const handleUploadVideos = async (info) => {
    if (info.file.status === "uploading") {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api
        .uploadFile("Users", {
          file: reader.result,
          extension: info.file.name.split(".").pop(),
        })
        .then((res) => {
          if (res.success) {
            setFormData((prev) => ({
              ...prev,
              videos: [
                ...prev.videos,
                {
                  url: res.url,
                  title: info.file.name,
                  date: new Date().toISOString(),
                },
              ],
            }));
          }
        });
    };
  };

  const renderSocialLinks = () => {
    const iconMap = {
      facebook: <FacebookColorIcon />,
      instagram: <InstaColorIcon />,
      linkedin: <LinkedInColorIcon />,
      twitter: <TweeterColorIcon />,
    };

    return (
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {formData.social_links.map((link, index) =>
          editMode ? (
            <Input
              key={index}
              prefix={iconMap[link.platform]}
              value={link.url}
              onChange={(e) => {
                const newLinks = [...formData.social_links];
                newLinks[index].url = e.target.value;
                setFormData((prev) => ({ ...prev, social_links: newLinks }));
              }}
              placeholder={`Enter your ${link.platform} URL`}
            />
          ) : (
            <a
              key={index}
              href={link.url}
              className="social-link"
              target="_blank"
            >
              {iconMap[link.platform]}{" "}
              {link.url || `https://www.${link.platform}.com/name`}
            </a>
          )
        )}
      </Space>
    );
  };

  return (
    <div className="profile-card">
      <div
        className="background-image"
        style={{
          background: `url(${
            formData.cover_image ||
            "https://images.unsplash.com/photo-1736254329261-5595925b7e25?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          })`,
          position: "relative",
        }}
      >
        {editMode && (
          <Upload
            customRequest={handleUploadCover}
            showUploadList={false}
            accept="image/*"
          >
            <Button
              icon={<UploadOutlined />}
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
              }}
            >
              Change Cover
            </Button>
          </Upload>
        )}
      </div>
      <div className="content">
        <div className="profile-header">
          <Avatar
            size={100}
            style={{ border: "1px solid white" }}
            src={user.profile_picture}
          />
          <div className="profile-info">
            <Title style={{ color: "white", marginBottom: 0 }} level={3}>
              {user.name}
            </Title>
            <Text style={{ color: "white", marginBottom: "6px" }}>
              {user.country}
            </Text>
          </div>
        </div>
        <div className="availability">
          <Text>Are you available for new projects?</Text>
          {editMode ? (
            <Switch
              checked={formData.available}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, available: checked }))
              }
            />
          ) : (
            <Switch checked={formData.available} disabled />
          )}
        </div>
        <div style={{ display: "flex", gap: "28px" }}>
          <div className="bio-section" style={{ width: "50%" }}>
            <Title level={4}>Creator Bio</Title>
            {editMode ? (
              <TextArea
                value={formData.bio}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, bio: e.target.value }))
                }
                rows={6}
                placeholder="Enter your bio..."
              />
            ) : (
              <Text>{formData.bio}</Text>
            )}
          </div>
          <div className="social-links">
            <Title level={4}>Social Links</Title>
            <div title="Social Links" className="social-card">
              {renderSocialLinks()}
            </div>
          </div>
        </div>
      </div>
      <div className="portfolio-grid" style={{ padding: "20px" }}>
        {formData.videos.map((video, index) => (
          <Card key={index} className="portfolio-item">
            <div className="video-container">
              <video
                src={video.url}
                controls
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div className="video-info">
              {editMode ? (
                <Input
                  value={video.title}
                  onChange={(e) => {
                    const newVideos = [...formData.videos];
                    newVideos[index].title = e.target.value;
                    setFormData((prev) => ({ ...prev, videos: newVideos }));
                  }}
                />
              ) : (
                <h5>{video.title}</h5>
              )}
              <p>{new Date(video.date).toLocaleDateString()}</p>
            </div>
          </Card>
        ))}
      </div>

      <div style={{
        padding: 20,
        width: '100%',
      }}>
      {editMode && (
          <Dragger 
            customRequest={handleUploadVideos}
            showUploadList={false}
            accept="video/*"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Please upload your videos here
            </p>
          </Dragger>
        )}
      </div>



      {isCreator && (
        <Button
          type="primary"
          icon={editMode ? <SaveOutlined /> : <EditOutlined />}
          style={{ position: "absolute", top: 20, right: 20 }}
          onClick={editMode ? handleSave : () => setEditMode(true)}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
      )}
    </div>
  );
};

export default ProfileCard;
