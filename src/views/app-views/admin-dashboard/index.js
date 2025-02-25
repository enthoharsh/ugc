import React from 'react';
import { Typography, Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, FileProtectOutlined } from '@ant-design/icons';

const { Title } = Typography;

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="welcome-section" style={{ marginBottom: 24 }}>
        <Title level={3}>Admin Dashboard</Title>
        <Typography.Text type="secondary">Manage users and payments</Typography.Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card>
            <Statistic
              title="Total Users"
              value={0}
              prefix={<UserOutlined />}
              loading={true}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={12} lg={12}>
          <Card>
            <Statistic
              title="Pending Payments"
              value={0}
              prefix={<FileProtectOutlined />}
              loading={true}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <Card>
          <Title level={4}>Quick Links</Title>
          <ul style={{ paddingLeft: 20 }}>
            <li>
              <a href="/app/admin/users">Manage Users</a> - Approve or reject user accounts
            </li>
            <li>
              <a href="/app/admin/contracts">Manage Contracts</a> - Process payments for completed contracts
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;