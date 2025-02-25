import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Modal, Switch, message, Input, Select } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { api } from 'auth/FetchInterceptor';

const { Option } = Select;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('Users', {});
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      message.error('Failed to fetch users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle user verification
  const handleVerificationChange = async (verified) => {
    try {
      if (!currentUser) return;
      
      const response = await api.update('Users', {
        _id: currentUser._id,
        verified: verified
      }, currentUser._id);
      
      if (response.success) {
        message.success(`User ${verified ? 'verified' : 'unverified'} successfully`);
        fetchUsers(); // Refresh the list
      } else {
        message.error('Failed to update user verification status');
      }
    } catch (error) {
      message.error('An error occurred');
      console.error('Error updating user:', error);
    } finally {
      setEditModalVisible(false);
    }
  };

  // Open edit modal
  const showEditModal = (user) => {
    setCurrentUser(user);
    setEditModalVisible(true);
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = search === '' || 
      user.name?.toLowerCase().includes(search.toLowerCase()) || 
      user.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <span>{text} {record.last_name || ''}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: role => (
        <Tag color={role === 'Brand' ? 'blue' : role === 'Creator' ? 'green' : 'purple'}>
          {role}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'verified',
      dataIndex: 'verified',
      render: (verified) => (
        <Tag color={verified ? 'green' : 'red'}>
          {verified ? 'Verified' : 'Unverified'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small" 
            onClick={() => showEditModal(record)}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-users">
      <h2>User Management</h2>

      {/* Filters */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Input
          placeholder="Search by name or email"
          prefix={<SearchOutlined />}
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: 300 }}
        />

        <Select 
          defaultValue="All" 
          style={{ width: 200 }} 
          onChange={value => setRoleFilter(value)}
        >
          <Option value="All">All Roles</Option>
          <Option value="Brand">Brand</Option>
          <Option value="Creator">Creator</Option>
          <Option value="Admin">Admin</Option>
        </Select>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredUsers} 
        rowKey="_id"
        loading={loading}
      />

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setEditModalVisible(false)}>
            Cancel
          </Button>,
        ]}
      >
        {currentUser && (
          <div>
            <p><strong>Name:</strong> {currentUser.name} {currentUser.last_name || ''}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Role:</strong> {currentUser.role}</p>
            
            <div style={{ marginTop: 20 }}>
              <p><strong>Verification Status:</strong></p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                <Button 
                  type={currentUser.verified ? "primary" : "default"}
                  onClick={() => handleVerificationChange(true)}
                >
                  Verify User
                </Button>
                <Button 
                  type={!currentUser.verified ? "primary" : "default"}
                  onClick={() => handleVerificationChange(false)}
                  danger
                >
                  Unverify User
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;