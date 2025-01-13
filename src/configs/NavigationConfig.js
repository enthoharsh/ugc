import { 
  BellOutlined,
  DashboardOutlined, IdcardOutlined, MessageOutlined, ShopOutlined, UserOutlined
} from '@ant-design/icons';
import { Campaign } from 'components/icons';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

const dashBoardNavTree = [
  {
  key: 'home',
  path: `${APP_PREFIX_PATH}/home`,
  title: 'home',
  icon: DashboardOutlined,
  breadcrumb: false,
  submenu: []
},
  {
  key: 'campaigns',
  path: `${APP_PREFIX_PATH}/campaigns`,
  title: 'Campaigns',
  icon: Campaign ,
  breadcrumb: false,
  submenu: []
},
  {
  key: 'marketplace',
  path: `${APP_PREFIX_PATH}/marketplace`,
  title: 'Marketplace',
  icon: ShopOutlined ,
  breadcrumb: false,
  submenu: []
},
  {
  key: 'jobs',
  path: `${APP_PREFIX_PATH}/jobs`,
  title: 'Jobs',
  icon: IdcardOutlined,
  breadcrumb: false,
  submenu: []
},
  {
  key: 'notification',
  path: `${APP_PREFIX_PATH}/notification`,
  title: 'Notification',
  icon: BellOutlined,
  breadcrumb: false,
  submenu: []
},
  {
  key: 'chats',
  path: `${APP_PREFIX_PATH}/chats`,
  title: 'Chats',
  icon: MessageOutlined,
  breadcrumb: false,
  submenu: []
},
  {
  key: 'profile',
  path: `${APP_PREFIX_PATH}/profile`,
  title: 'Profile',
  icon: UserOutlined,
  breadcrumb: false,
  submenu: []
},

]

const navigationConfig = [
  ...dashBoardNavTree
]

export default navigationConfig;
