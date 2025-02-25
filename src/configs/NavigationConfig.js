import {
  BellOutlined,
  DashboardOutlined, DollarOutlined, IdcardOutlined, MessageOutlined, SafetyOutlined, ShopOutlined, TeamOutlined, UserOutlined
} from '@ant-design/icons';
import { UserPortfolio, Campaign, DashboardIcon, ProjectMarketIcon, ContractIcon, SettingIcon } from 'components/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

let dashBoardNavTree = [
  {
    key: 'a-home',
    path: `${APP_PREFIX_PATH}/admin/dashboard`,
    title: 'Admin',
    icon: SafetyOutlined,
    breadcrumb: false,
    submenu: [
      {
        key: 'a-dashboard',
        path: `${APP_PREFIX_PATH}/admin/dashboard`,
        title: 'Dashboard',
        icon: DashboardIcon,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'a-users',
        path: `${APP_PREFIX_PATH}/admin/users`,
        title: 'Users Management',
        icon: TeamOutlined,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'a-contracts',
        path: `${APP_PREFIX_PATH}/admin/contracts`,
        title: 'Payments Management',
        icon: DollarOutlined,
        breadcrumb: false,
        submenu: []
      }
    ]
  },

  {
    key: 'b-home',
    path: `${APP_PREFIX_PATH}/brands/dashboard`,
    title: 'Brand',
    icon: DashboardIcon,
    breadcrumb: false,
    submenu: [{
      key: 'dashboard',
      path: `${APP_PREFIX_PATH}/brands/dashboard`,
      title: 'Dashboard',
      icon: DashboardIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'b-campaigns',
      path: `${APP_PREFIX_PATH}/brands/campaigns`,
      title: 'Campaigns',
      icon: Campaign,
      breadcrumb: false,
      submenu: [
        {
          key: 'b-all-campaign',
          path: `${APP_PREFIX_PATH}/brands/campaigns/all-campaigns`,
          title: 'All Campaigns',
          // icon: Campaign ,
          breadcrumb: false,
          submenu: []
        },
        {
          key: 'b-order-form',
          path: `${APP_PREFIX_PATH}/brands/campaigns/order-form`,
          title: 'New Campaign',
          // icon: Campaign ,
          breadcrumb: false,
          submenu: []
        },
      ]
    },
    {
      key: 'b-contracts',
      path: `${APP_PREFIX_PATH}/brands/all-contracts`,
      title: 'Contracts',
      icon: ProjectMarketIcon,
      breadcrumb: false,
      submenu: []
    },
    //   {
    //   key: 'marketplace',
    //   path: `${APP_PREFIX_PATH}/marketplace`,
    //   title: 'Marketplace',
    //   icon: ShopOutlined ,
    //   breadcrumb: false,
    //   submenu: []
    // },
    {
      key: 'b-account-settings',
      path: `${APP_PREFIX_PATH}/brands/account-settings`,
      title: 'Account & Settings',
      icon: SettingIcon,
      breadcrumb: false,
      submenu: []
    },
      //   {
      //   key: 'notification',
      //   path: `${APP_PREFIX_PATH}/notification`,
      //   title: 'Notification',
      //   icon: BellOutlined,
      //   breadcrumb: false,
      //   submenu: []
      // },
      //   {
      //   key: 'chats',
      //   path: `${APP_PREFIX_PATH}/chats`,
      //   title: 'Chats',
      //   icon: MessageOutlined,
      //   breadcrumb: false,
      //   submenu: []
      // },
      //   {
      //   key: 'profile',
      //   path: `${APP_PREFIX_PATH}/profile`,
      //   title: 'Profile',
      //   icon: UserOutlined,
      //   breadcrumb: false,
      //   submenu: []
      // },
    ]
  },
  {
    key: 'c-home',
    path: `${APP_PREFIX_PATH}/creators/dashboard`,
    title: 'Creators',
    icon: DashboardIcon,
    breadcrumb: false,
    submenu: [{
      key: 'c-dashboard',
      path: `${APP_PREFIX_PATH}/creators/dashboard`,
      title: 'Dashboard',
      icon: DashboardIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'c-portfolio',
      path: `${APP_PREFIX_PATH}/creators/portfolio`,
      title: 'Portfolio',
      icon: UserPortfolio,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'c-marketplace',
      path: `${APP_PREFIX_PATH}/creators/marketplace`,
      title: 'Project Marketplace',
      icon: ProjectMarketIcon,
      breadcrumb: false,
      submenu: []
    },
    {
      key: 'c-all-contracts',
      path: `${APP_PREFIX_PATH}/creators/all-contracts`,
      title: 'Contracts',
      icon: ContractIcon,
      breadcrumb: false,
      submenu: []
    },
    //   {
    //   key: 'marketplace',
    //   path: `${APP_PREFIX_PATH}/marketplace`,
    //   title: 'Marketplace',
    //   icon: ShopOutlined ,
    //   breadcrumb: false,
    //   submenu: []
    // },
    {
      key: 'c-account-settings',
      path: `${APP_PREFIX_PATH}/creators/account-settings`,
      title: 'Account & Settings',
      icon: SettingIcon,
      breadcrumb: false,
      submenu: []
    },
      //   {
      //   key: 'notification',
      //   path: `${APP_PREFIX_PATH}/notification`,
      //   title: 'Notification',
      //   icon: BellOutlined,
      //   breadcrumb: false,
      //   submenu: []
      // },
      //   {
      //   key: 'chats',
      //   path: `${APP_PREFIX_PATH}/chats`,
      //   title: 'Chats',
      //   icon: MessageOutlined,
      //   breadcrumb: false,
      //   submenu: []
      // },
    ]
  },
]

const navigationConfig = [
  ...dashBoardNavTree
]

export default navigationConfig;
