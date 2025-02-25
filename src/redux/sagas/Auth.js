import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import {
	AUTH_TOKEN,
	SIGNIN,
	SIGNOUT,
	SIGNUP,
	SIGNIN_WITH_GOOGLE,
	SIGNIN_WITH_FACEBOOK
} from '../constants/Auth';
import {
	showAuthMessage,
	authenticated,
	signOutSuccess,
	signUpSuccess,
	signInWithGoogleAuthenticated,
	signInWithFacebookAuthenticated
} from "../actions/Auth";

import FirebaseService from 'services/FirebaseService'
import axios from 'axios';
import { API_BASE_URL } from 'configs/AppConfig';

export function* signInWithFBEmail() {
  yield takeEvery(SIGNIN, function* ({payload}) {
		const {email, password} = payload;
		console.log('email:', email, 'password:', password);

		try {
			const firebase_user = yield call(FirebaseService.signInEmailRequest, email, password);
			if (firebase_user.message) {
				yield put(showAuthMessage(firebase_user.message));
			} else {
				// Then call your own API using call effect
				const response = yield call(axios.post, `${API_BASE_URL}/api/login`, {
					email,
					uid: firebase_user.user.uid
				});
				
				// Extract data from response
				const { token, user, success, message } = response.data;

				if(!success) {
					yield put(showAuthMessage(message));
					return
				}
				
				// Store in localStorage
				localStorage.setItem(AUTH_TOKEN, token);
				localStorage.setItem('main_user', JSON.stringify(user));
				
				// Dispatch success action
				yield put(authenticated(token, user));
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export function* signOut() {
  yield takeEvery(SIGNOUT, function* () {
		try {
			const signOutUser = yield call(FirebaseService.signOutRequest);
			if (signOutUser === undefined) {
				localStorage.removeItem(AUTH_TOKEN);
				yield put(signOutSuccess(signOutUser));
			} else {
				yield put(showAuthMessage(signOutUser.message));
			}
		} catch (err) {
			yield put(showAuthMessage(err));
		}
	});
}

export function* signUpWithFBEmail() {
  yield takeEvery(SIGNUP, function* ({payload}) {
		const {email, password} = payload;
		console.log('email:', email, 'password:', password);
		
		try {
			const firebase_user = yield call(FirebaseService.signUpEmailRequest, email, password);
			console.log('user:', firebase_user);
			
			if (firebase_user.message) {
				yield put(showAuthMessage(firebase_user.message));
			} else {
				// Then call your own API using call effect
				const response = yield call(axios.post, `${API_BASE_URL}/api/login`, {
					email,
					uid: firebase_user.user.uid
				});
				
				// Extract data from response
				const { token, user, success, message } = response.data;

				if(!success) {
					yield put(showAuthMessage(message));
					return
				}
				
				// Store in localStorage
				localStorage.setItem(AUTH_TOKEN, token);
				localStorage.setItem('main_user', JSON.stringify(user));
					
				// Dispatch success action
				yield put(authenticated(token, user));
			}
		} catch (error) {
			console.log('error:', error);
			
			yield put(showAuthMessage(error));
		}
	}
	);
}

export function* signInWithFBGoogle() {
  yield takeEvery(SIGNIN_WITH_GOOGLE, function* () {
		try {
			const user = yield call(FirebaseService.signInGoogleRequest);
			if (user.message) {
				yield put(showAuthMessage(user.message));
			} else {
				localStorage.setItem(AUTH_TOKEN, user.user.uid);
				yield put(signInWithGoogleAuthenticated(user.user.uid));
			}
		} catch (error) {
			yield put(showAuthMessage(error));
		}
	});
}

export function* signInWithFacebook() {
  yield takeEvery(SIGNIN_WITH_FACEBOOK, function* () {
		try {
			const user = yield call(FirebaseService.signInFacebookRequest);
			if (user.message) {
				yield put(showAuthMessage(user.message));
			} else {
				localStorage.setItem(AUTH_TOKEN, user.user.uid);
				yield put(signInWithFacebookAuthenticated(user.user.uid));
			}
		} catch (error) {
			yield put(showAuthMessage(error));
		}
	});
}

export default function* rootSaga() {
  yield all([
		fork(signInWithFBEmail),
		fork(signOut),
		fork(signUpWithFBEmail),
		fork(signInWithFBGoogle),
		fork(signInWithFacebook)
  ]);
}
