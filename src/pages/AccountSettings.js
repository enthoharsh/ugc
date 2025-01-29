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
const { Title, Text } = Typography;

const { TabPane } = Tabs;

const AccountSettings = () => {
  const [form] = Form.useForm();

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
      key: "1",
      label: (
        <>
          <span className="mr-2">
            <IdcardOutlined />
          </span>
          About
        </>
      ),
      children: <AccountProfile />, // Replace with actual content
    },
    {
      key: "2",
      label: (
        <>
          <span className="mr-2">
            <FileTextOutlined />
          </span>
          Billing
        </>
      ),
      children: <Billing />, // Replace with actual content
    },
    {
      key: "3",
      label: (
        <>
          <span className="mr-2">
            <DollarOutlined />
          </span>
          Payment History
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
      <Tabs
        defaultActiveKey="1"
        onChange={(key) => console.log("Selected tab:", key)}
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
