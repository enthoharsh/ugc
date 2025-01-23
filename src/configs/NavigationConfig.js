import { 
  BellOutlined,
  DashboardOutlined, IdcardOutlined, MessageOutlined, ShopOutlined, UserOutlined
} from '@ant-design/icons';
import { AllContractIcon, Campaign } from 'components/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

const dashBoardNavTree = [
  {
  key: 'b-home',
  path: `${APP_PREFIX_PATH}/brands/dashboard`,
  title: 'Brand',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [ {
    key: 'dashboard',
  path: `${APP_PREFIX_PATH}/brands/dashboard`,
  title: 'Dashboard',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: []
  }, 
  {
    key: 'b-campaigns',
    path: `${APP_PREFIX_PATH}/brands/campaigns`,
    title: 'Campaigns',
    icon: Campaign ,
    breadcrumb: false,
    submenu: [
      {
        key: 'b-all-campaign',
        path: `${APP_PREFIX_PATH}/brands/campaigns/all-campaigns`,
        title: 'All Campaign',
        // icon: Campaign ,
        breadcrumb: false,
        submenu: []
      },
      {
        key: 'b-order-form',
        path: `${APP_PREFIX_PATH}/brands/campaigns/order-form`,
        title: 'Order Form',
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
    icon: AllContractIcon ,
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
    title: 'Account Settings',
    icon: IdcardOutlined,
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
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: [ {
    key: 'c-dashboard',
  path: `${APP_PREFIX_PATH}/creators/dashboard`,
  title: 'Dashboard',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: []
  }, 
  {
    key: 'c-portfolio',
    path: `${APP_PREFIX_PATH}/creators/portfolio`,
    title: 'Portfolio',
    icon: UserOutlined,
    breadcrumb: false,
    submenu: []
  },
      {
    key: 'c-marketplace',
    path: `${APP_PREFIX_PATH}/creators/marketplace`,
    title: 'Project Marketplace',
    icon: ShopOutlined ,
    breadcrumb: false,
    submenu: []
  },
    {
    key: 'c-all-contracts',
    path: `${APP_PREFIX_PATH}/creators/all-contracts`,
    title: 'Contracts',
    icon: AllContractIcon ,
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
    title: 'Account Settings',
    icon: IdcardOutlined,
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
