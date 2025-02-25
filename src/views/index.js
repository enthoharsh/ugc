import React, { useEffect } from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import AppLocale from "lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
import useBodyClass from 'hooks/useBodyClass';
import VerificationPending from "./app-views/verification-pending";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
function RouteInterceptor({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: AUTH_PREFIX_PATH,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
export const Views = (props) => {
  const { locale, token, location, direction } = props;

  const history = useHistory();

  useEffect(() => {
    if (token) {
      const user = JSON.parse(localStorage.getItem('main_user'));
      if (user && user.role === 'Creator' && !user.verified) {
        // Redirect unverified creators to the verification pending page
        history.push(`${APP_PREFIX_PATH}/creators/verification-pending`);
      }
    }
  }, [token]);

  const currentAppLocale = AppLocale[locale];
  useBodyClass(`dir-${direction}`);

  if(token) {
    return (
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}>
        <ConfigProvider locale={currentAppLocale.antd} direction={direction}>
          <AppLayout direction={direction} location={location}/>
        </ConfigProvider>
      </IntlProvider>
    );
  }

  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}>
      <ConfigProvider locale={currentAppLocale.antd} direction={direction}>
        <Switch>
          <Route exact path={`${APP_PREFIX_PATH}`} render={() => {
            const user = JSON.parse(localStorage.getItem('main_user'));
            if (!user) return <Redirect to={`${AUTH_PREFIX_PATH}/login`} />;
            
            if (user.role === 'Creator') {
              if (!user.verified) {
                return <Redirect to={`${APP_PREFIX_PATH}/creators/verification-pending`} />;
              }
              return <Redirect to={`${APP_PREFIX_PATH}/creators/dashboard`} />;
            }
            
            return <Redirect to={`${APP_PREFIX_PATH}/brands/dashboard`} />;
          }} />
          <Route path={AUTH_PREFIX_PATH}>
            <AuthLayout direction={direction} />
          </Route>
          <RouteInterceptor path={APP_PREFIX_PATH} isAuthenticated={token}>
            <AppLayout direction={direction} location={location}/>
          </RouteInterceptor>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  )
}

const mapStateToProps = ({ theme, auth }) => {
  const { locale, direction } =  theme;
  const { token } = auth;
  return { locale, token, direction }
};

export default withRouter(connect(mapStateToProps)(Views));