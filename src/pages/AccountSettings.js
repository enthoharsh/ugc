import React, { useEffect, useState } from "react";
import { Table, Typography, Tabs } from "antd";
import {
  IdcardOutlined,
  FileTextOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { Form, Input, Button, Upload, message } from "antd";
import {
  UploadOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";
import { ArrowRightOutlined } from "@ant-design/icons";
import { api } from "auth/FetchInterceptor";
import PayPalSettings from "components/PayPalSettings";
const { Title, Text } = Typography;

const { TabPane } = Tabs;

const AccountSettings = () => {
  const [form] = Form.useForm();
  const [ActKey, setActKey] = useState('About')
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState();
  const [imageUrl, setImageUrl] = useState();

  const handleImageUploadChange = (info) => {
    const reader = new FileReader();
    reader.readAsDataURL(info.file);
    reader.onload = () => {
      api.uploadFile("Users", {
        file: reader.result,
        extension: info.file.name.split(".").pop(),
      }).then((res) => {
        if (res.success) {
        
          form.setFieldsValue({
            profile_picture: res.url,
          });

          setImageUrl(res.url);

          message.success("Image uploaded successfully!");
        } else {
          message.error("Error uploading image!");
        }
      });
    };
  };

  const getUserDetails = () => {
    api.customRoute("getUserDetails", {}).then((res) => {

      form.setFieldsValue({
        name: res.user.name,
        last_name: res.user.last_name,
        email: res.user.email,
        phone: res.user.phone,
        brand_name: res.user.brand_name,
        website: res.user.website,

        street: res.user.street,
        address_line_1: res.user.address_line_1,
        city: res.user.city,
        state: res.user.state,
        postal_code: res.user.postal_code,
        country: res.user.country,
        abn: res.user.abn,
      });

      setImageUrl(res.user.profile_picture);
    });
  }

  const handleFinish = (values) => {
    const data = {
      ...values,
      profile_picture: imageUrl,
    }

    api.customRoute("updateProfile", data).then((res) => {
      if(res.success) {
        message.success("Profile updated successfully!");
      } else {
        message.error("Error updating profile!");
      }
    });
  };

  useEffect(() => {
    console.log("AccountSettings.js: useEffect");
    
    getUserDetails();
  }, []);

  const AccountProfile = () => (

    <div className="account-set" style={{ margin: "0 auto", padding: 20 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          firstName: "",
          lastName: "",
          contactEmail: "",
          phone: "",
          brandName: "",
          website: "",
        }}
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ width: "30%" }}>
            <Form.Item label="" valuePropName="fileList">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                maxCount={1}
                //onChange={handleImageUploadChange}
                //action={handleImageUploadChange}
                customRequest={handleImageUploadChange}
                //beforeUpload={() => false} 
              >
                {(imageUrl) ? (
                  <img
                    src={imageUrl}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  (
                    <div>
                      {loading ? <LoadingOutlined /> : <PlusOutlined />}
                
                      <div
                        style={{
                          marginTop: 8,
                        }}
                      >
                        Upload
                      </div>
                    </div>
                  )
                )}
              </Upload>
              <p style={{ fontSize: 12, textAlign: "center" }}>
                Allowed: *.jpeg, *.jpg, *.png, *.gif <br />
                Max size: 3.1MB
              </p>
            </Form.Item>
          </div>
          <div style={{ width: "70%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="First Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input placeholder="Your first name" />
                </Form.Item>
              </div>
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Last Name"
                  name="last_name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your last name!",
                    },
                  ]}
                >
                  <Input placeholder="Your Last name" />
                </Form.Item>
              </div>
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Contact Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                    { type: "email", message: "Please enter a valid email!" },
                  ]}
                >
                  <Input placeholder="Your email" />
                </Form.Item>
              </div>
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    {
                      required: true,
                      message: "Please input your phone number!",
                    },
                  ]}
                >
                  <Input placeholder="Your phone number" />
                </Form.Item>
              </div>
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Change Password"
                  name="change_password"
                  rules={[
                    { required: false,  },
                  ]}
                >
                  <Input.Password placeholder="Enter password" />
                </Form.Item>
              </div>
              <div style={{ width: "48%" }}>
                <Form.Item
                  label="Brand Name"
                  name="brand_name"
                  rules={[
                    { required: true, message: "Please input your brand name!" },
                  ]}
                >
                  <Input placeholder="Name of your brand" />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              label="Website"
              name="website"
              rules={[
                { required: true, message: "Please input your website!" },
                { type: "url", message: "Please enter a valid URL!" },
              ]}
            >
              <Input placeholder="https://yourwebsite.com" />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Button
            style={{ display: "block", width: "150px", marginLeft: "auto" }}
            className="primary-solid-button"
            htmlType="submit"
            block
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>

      <PayPalSettings 
        userData={form.getFieldsValue(true)}
        loading={loading}
        onDisconnect={() => {
          // Refresh user data after disconnecting
          getUserDetails();
        }}
      />
    </div>
  );

  const Billing = () => (
    <>
      <div className="account-set" style={{ margin: "0 auto", padding: 30 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            street: "",
            address_line_1: "",
            city: "",
            state: "",
            postal_code: "",
            country: "",
            abn: "",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Form.Item
                    label="Street"
                    name="street"
                    rules={[
                      {
                        required: true,
                        message: "Please input your street!",
                      },
                    ]}
                  >
                    <Input placeholder="Your street" />
                  </Form.Item>
                </div>
                <div style={{ width: "48%" }}>
                  <Form.Item
                    label="Address Line 1"
                    name="address_line_1"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Address Line 1!",
                      },
                    ]}
                  >
                    <Input placeholder="Your Address Line 1" />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Form.Item
                    label="City"
                    name="city"
                    rules={[{ required: true, message: "Please enter city" }]}
                  >
                    <Input placeholder="Your city" />
                  </Form.Item>
                </div>
                <div style={{ width: "48%" }}>
                  <Form.Item
                    label="State"
                    name="state"
                    rules={[
                      {
                        required: true,
                        message: "Please enter state!",
                      },
                    ]}
                  >
                    <Input placeholder="state" />
                  </Form.Item>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <Form.Item
                    label="Postal Code"
                    name="postal_code"
                    rules={[
                      { required: true, message: "Please enter Postal Code!" },
                    ]}
                  >
                    <Input placeholder="Postal Code" />
                  </Form.Item>
                </div>
                <div style={{ width: "48%" }}>
                  <Form.Item
                    label="Country"
                    name="country"
                    rules={[
                      { required: true, message: "Please enter Country!" },
                    ]}
                  >
                    <Input placeholder="Country" />
                  </Form.Item>
                </div>
              </div>

              <Form.Item
                label="ABN"
                name="abn"
                rules={[{ required: true, message: "Please enter Country!" }]}
              >
                <Input placeholder="ABN" />
              </Form.Item>
            </div>
          </div>

          <Form.Item>
            <Button
              style={{ display: "block", width: "150px", marginLeft: "auto" }}
              className="primary-solid-button"
              htmlType="submit"
              block
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );

  const PaymentHistory = () => {
    const dataSource = [
      {
        key: "1",
        campaign: "Demir campaign",
        transactionId: "12387523",
        date: "07 Aug 2025",
        amount: "$87.55",
      },
      {
        key: "2",
        campaign: "Demir campaign",
        transactionId: "12387523",
        date: "07 Aug 2025",
        amount: "$87.55",
      },
      {
        key: "3",
        campaign: "Demir campaign",
        transactionId: "12387523",
        date: "07 Aug 2025",
        amount: "$87.55",
      },
      {
        key: "4",
        campaign: "Demir campaign",
        transactionId: "12387523",
        date: "07 Aug 2025",
        amount: "$87.55",
      },
      {
        key: "5",
        campaign: "Demir campaign",
        transactionId: "12387523",
        date: "07 Aug 2025",
        amount: "$87.55",
      },
    ];

    const columns = [
      {
        title: "Campaign",
        dataIndex: "campaign",
        key: "campaign",
      },
      {
        title: "Transaction ID",
        dataIndex: "transactionId",
        key: "transactionId",
      },
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Amount",
        dataIndex: "amount",
        key: "amount",
      },
    ];

    return (
      <>
        <Button
          type="link"
          href="https://stripe.com"
          target="_blank"
          icon={<ArrowRightOutlined />}
          className="secondary-color-btn mb-3"
          style={{
            color: "#EB2F96",
          }}
        >
          Manage payment details (Stripe)
        </Button>
        <div className="account-set" style={{ padding: 20, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              Payment history
            </Title>
          </div>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            //   bordered
            //   style={{ borderRadius: "8px", overflow: "hidden" }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </div>
      </>
    );
  };

  const tabItems = [
    {
      key: "About",
      label: (
        <>
        
          <span className="mr-2 mt-1">
            <svg
              width={20}
              height={12}
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                fill="#454F5B"
                fillRule="evenodd"
                d="M8 0h4c3.771 0 5.657 0 6.828 1.172C20 2.343 20 4.229 20 8c0 3.771 0 5.657-1.172 6.828C17.657 16 15.771 16 12 16H8c-3.771 0-5.657 0-6.828-1.172C0 13.657 0 11.771 0 8c0-3.771 0-5.657 1.172-6.828C2.343 0 4.229 0 8 0Zm3.25 5a.75.75 0 0 1 .75-.75h5a.75.75 0 1 1 0 1.5h-5a.75.75 0 0 1-.75-.75Zm1 3a.75.75 0 0 1 .75-.75h4a.75.75 0 1 1 0 1.5h-4a.75.75 0 0 1-.75-.75Zm1 3a.75.75 0 0 1 .75-.75h3a.75.75 0 1 1 0 1.5h-3a.75.75 0 0 1-.75-.75ZM9 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-2 8c4 0 4-.895 4-2S9.21 9 7 9s-4 .895-4 2 0 2 4 2Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span style={{ fontWeight: "500" }}>
            About
          </span>
        </>
      ),
      children: <AccountProfile />, // Replace with actual content
    },
    {
      key: "Billing",
      label: (
        <>
          <span className="mr-2 mt-1">
            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={12} fill="none" viewBox="0 0 18 20">
              <path
                fill="#454F5B"
                fillRule="evenodd"
                d="M4.245-.01h9.51c1.159 0 1.738 0 2.206.163a3.044 3.044 0 0 1 1.881 1.936C18 2.571 18 3.167 18 4.36v14.004c0 .858-.985 1.314-1.608.744a.946.946 0 0 0-1.284 0l-.483.442a1.657 1.657 0 0 1-2.25 0 1.657 1.657 0 0 0-2.25 0 1.657 1.657 0 0 1-2.25 0 1.657 1.657 0 0 0-2.25 0 1.657 1.657 0 0 1-2.25 0l-.483-.442a.946.946 0 0 0-1.284 0c-.623.57-1.608.114-1.608-.744V4.36c0-1.193 0-1.79.158-2.27.3-.913.995-1.629 1.881-1.937C2.507-.01 3.086-.01 4.245-.01ZM4 4.74a.75.75 0 0 0 0 1.5h.5a.75.75 0 1 0 0-1.5H4Zm3.5 0a.75.75 0 0 0 0 1.5H14a.75.75 0 1 0 0-1.5H7.5ZM4 8.24a.75.75 0 0 0 0 1.5h.5a.75.75 0 1 0 0-1.5H4Zm3.5 0a.75.75 0 0 0 0 1.5H14a.75.75 0 1 0 0-1.5H7.5ZM4 11.74a.75.75 0 0 0 0 1.5h.5a.75.75 0 1 0 0-1.5H4Zm3.5 0a.75.75 0 0 0 0 1.5H14a.75.75 0 1 0 0-1.5H7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <span style={{ fontWeight: "500" }}>
            Billing
          </span>
        </>
      ),
      children: <Billing />, // Replace with actual content
    },
    {
      key: "Payment History",
      label: (
        <>
          <span className="mr-2 mt-1">
            <svg width="20" height="12" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.25 0C3.933 0.006 2.693 0.0629998 1.778 0.674C1.34106 0.965911 0.965911 1.34106 0.674 1.778C0 2.787 0 4.19 0 7C0 9.809 0 11.213 0.674 12.222C0.965911 12.6589 1.34106 13.0341 1.778 13.326C2.693 13.937 3.933 13.994 6.25 14V9.905C5.60644 9.73819 5.03649 9.3624 4.62962 8.83662C4.22274 8.31083 4.00198 7.66483 4.00198 7C4.00198 6.33517 4.22274 5.68917 4.62962 5.16338C5.03649 4.6376 5.60644 4.26181 6.25 4.095V0ZM7.75 14H12.25V0H7.75V14ZM13.75 0V4.095C14.3936 4.26181 14.9635 4.6376 15.3704 5.16338C15.7773 5.68917 15.998 6.33517 15.998 7C15.998 7.66483 15.7773 8.31083 15.3704 8.83662C14.9635 9.3624 14.3936 9.73819 13.75 9.905V14C16.067 13.994 17.308 13.937 18.222 13.326C18.6589 13.034 19.034 12.6589 19.326 12.222C20 11.213 20 9.81 20 7C20 4.191 20 2.787 19.326 1.778C19.034 1.34109 18.6589 0.965951 18.222 0.674C17.307 0.0629998 16.067 0.005 13.75 0Z" fill="#454F5B"/>
            </svg>
          </span>
          <span style={{ fontWeight: "500" }}>
            Payment History
          </span>
        </>
      ),
      children: <PaymentHistory />, // Replace with actual content
    },
  ];

  return (
    <div className="account-settings">
      <Title level={3} className="campaign-title">
        Account Settings
      </Title>
      <Title level={5} style={{fontWeight:'400',fontSize:'14px', margin:'5px 0', marginBottom:'40px', fontWeight: '500'}} >
        Account <span className="mr-3 ml-3">&#183;</span>  <span style={{color:'#fe5c02'}} >{ActKey}</span>
      </Title>
      <Tabs
        defaultActiveKey="About"
        onChange={(key) => setActKey(key)}
      >
        {tabItems.map((item, i) => {
          return (
            <TabPane tab={item.label} key={item.key}>
              {item.children}
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
};

export default AccountSettings;
