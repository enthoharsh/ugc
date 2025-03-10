import { APP_PREFIX_PATH } from 'configs/AppConfig';
import {
	AUTH_TOKEN,
	AUTHENTICATED,
	SHOW_AUTH_MESSAGE,
	HIDE_AUTH_MESSAGE,
	SIGNOUT_SUCCESS,
	SIGNUP_SUCCESS,
	SHOW_LOADING,
	SIGNIN_WITH_GOOGLE_AUTHENTICATED,
  SIGNIN_WITH_FACEBOOK_AUTHENTICATED
} from '../constants/Auth';

const initState = {
  loading: false,
  message: '',
  showMessage: false,
  redirect: '',
  token: localStorage.getItem(AUTH_TOKEN),
}

const auth = (state = initState, action) => {
	switch (action.type) {
		case AUTHENTICATED:
			const userData = action.user || state.userData;
			let redirectPath = '/';

			if (userData) {
			  if (userData.role === 'Brand') {
				redirectPath = `${APP_PREFIX_PATH}/brands/dashboard`;
			  } else if (userData.role === 'Creator') {
				if (userData.verified === false) {
				  redirectPath = `${APP_PREFIX_PATH}/verification-pending`;
				} else {
				  redirectPath = `${APP_PREFIX_PATH}/creators/dashboard`;
				}
			  }
			}
			
			return {
			  ...state,
			  loading: false,
			  redirect: redirectPath,
			  token: action.token,
			  userData: userData
			}
		case SHOW_AUTH_MESSAGE: 
			return {
				...state,
				message: action.message,
				showMessage: true,
				loading: false
			}
		case HIDE_AUTH_MESSAGE: 
			return {
				...state,
				message: '',
				showMessage: false,
			}
		case SIGNOUT_SUCCESS: {
			return {
				...state,
				token: null,
				redirect: '/',
				loading: false
			}
		}
		case SIGNUP_SUCCESS: {
			return {
			  ...state,
			  loading: false,
			  token: action.token
			}
		}
		case SHOW_LOADING: {
			return {
				...state,
				loading: true
			}
		}
		case SIGNIN_WITH_GOOGLE_AUTHENTICATED: {
			return {
				...state,
				loading: false,
				token: action.token
			}
		}
		case SIGNIN_WITH_FACEBOOK_AUTHENTICATED: {
			return {
				...state,
				loading: false,
				token: action.token
			}
		}
		default:
			return state;
	}
}

export default auth