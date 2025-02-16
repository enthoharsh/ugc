import React, { Component } from "react";
import { LogoutOutlined, SettingOutlined, BellOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import { Drawer, Menu, Dropdown, Avatar, Badge, List, Button, Typography, Divider } from "antd";
import ThemeConfigurator from "./ThemeConfigurator";
import { connect } from "react-redux";

const { Title, Text } = Typography;

export class NavPanel extends Component {
  state = { 
    visible: false,
    notifications: [
      { id: 1, title: "New Message", description: "You have a new message from John.", read: false },
      { id: 2, title: "Booking Confirmed", description: "Your appointment has been confirmed.", read: false },
      { id: 3, title: "System Update", description: "Scheduled maintenance at midnight.", read: true },
      { id: 4, title: "System Update", description: "Scheduled maintenance at midnight.", read: true },
      { id: 5, title: "System Update", description: "Scheduled maintenance at midnight.", read: true },
      { id: 6, title: "System Update", description: "Scheduled maintenance at midnight.", read: true },
    ]
  };

  showDrawer = () => {
    this.setState({ visible: true });
  };

  onClose = () => {
    this.setState({ visible: false });
  };

  markAllAsRead = () => {
    this.setState({
      notifications: this.state.notifications.map((notif) => ({ ...notif, read: true }))
    });
  };

  render() {
    const { notifications } = this.state;
    const unreadCount = notifications.filter((n) => !n.read).length;

    const notificationMenu = (
      <div style={{ width: 350, maxHeight: 400, overflowY: "auto", background: "#fff", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: 8 }}>
        {/* Header with "Notifications" and "Mark All as Read" */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid #f0f0f0" }}>
          <Title level={5} style={{ margin: 0 }}>Notifications</Title>
          <span  onClick={this.markAllAsRead} style={{ fontSize: 12 ,cursor:'pointer',textDecoration:'underline',color:'black'}}>Mark All as Read</span>
        </div>

        {/* Notification List */}
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item style={{ background: item.read ? "#fff" : "#ffccb842", padding: 12, borderBottom: "1px solid #f0f0f0" }}>
              <List.Item.Meta 
                title={<strong>{item.title}</strong>} 
                description={<Text type={item.read ? "secondary" : "default"}>{item.description}</Text>} 
              />
            </List.Item>
          )}
        />
      </div>
    );

    const profileMenu = (
      <Menu>
        <Menu.Item key="edit-profile">
          <EditOutlined /> Edit Profile
        </Menu.Item>
        <Menu.Item key="sign-out" onClick={() => {
          localStorage.clear();
          window.location.href = "/auth/login";
        }}>
          <LogoutOutlined /> Sign Out
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <Menu mode="horizontal">
          {/* Settings Panel */}
          {/* <Menu.Item key="panel" onClick={this.showDrawer}>
            <SettingOutlined className="nav-icon mr-0" />
          </Menu.Item> */}

          {/* Notifications */}
          <Menu.Item key="notifications">
            <Dropdown overlay={notificationMenu} trigger={["click"]} placement="bottomRight">
              <Badge count={unreadCount} offset={[-10, 0]}>
                <BellOutlined className="nav-icon" style={{ cursor: "pointer", fontSize: 20 }} />
              </Badge>
            </Dropdown>
          </Menu.Item>

          {/* Profile Dropdown */}
          <Menu.Item key="profile">
            <Dropdown overlay={profileMenu} trigger={["click"]}>
              <Avatar icon={<UserOutlined />} className="nav-icon" style={{ cursor: "pointer" }} />
            </Dropdown>
          </Menu.Item>
        </Menu>

        {/* Theme Config Drawer */}
        <Drawer title="Theme Configurator" placement="right" closable={true} onClose={this.onClose} visible={this.state.visible}>
          <ThemeConfigurator />
        </Drawer>
      </>
    );
  }
}

const mapStateToProps = ({ theme }) => {
  const { locale } = theme;
  return { locale };
};

export default connect(mapStateToProps)(NavPanel);
