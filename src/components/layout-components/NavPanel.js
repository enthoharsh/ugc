import React, { Component } from 'react';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Drawer, Menu } from 'antd';
import ThemeConfigurator from './ThemeConfigurator';
import { connect } from "react-redux";
import { DIR_RTL } from 'constants/ThemeConstant';

export class NavPanel extends Component {
	state = { visible: false };

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
	};
	
	render() {
		return (
      <>
        <Menu mode="horizontal">
          <Menu.Item onClick={() => {
            localStorage.clear();
            window.location.href = '/auth/login';
          }}>
            {/* <SettingOutlined className="nav-icon mr-0" /> */}
            <LogoutOutlined className="nav-icon mr-0" />
          </Menu.Item>
        </Menu>
      </>
    );
	}
}

const mapStateToProps = ({ theme }) => {
  const { locale } =  theme;
  return { locale }
};

export default connect(mapStateToProps)(NavPanel);