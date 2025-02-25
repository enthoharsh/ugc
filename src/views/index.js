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
import { VerifiedRoute, VerificationPendingRoute } from "../components/VerificationRoutes";
import VerificationPending from "components/VerificationPending";

// Regular authentication route interceptor
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
  const currentAppLocale = AppLocale[locale];
  useBodyClass(`dir-${direction}`);

  if (!token) {
    // User not authenticated, show auth layout
    return (
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}>
        <ConfigProvider locale={currentAppLocale.antd} direction={direction}>
          <Switch>
            <Route path={AUTH_PREFIX_PATH}>
              <AuthLayout direction={direction} />
            </Route>
            <Redirect to={AUTH_PREFIX_PATH} />
          </Switch>
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
          {/* Route for verification pending page - no layout */}
          <VerificationPendingRoute path={`${APP_PREFIX_PATH}/creators/verification-pending`}>
            <VerificationPending />
          </VerificationPendingRoute>

          {/* Default redirect based on user role */}
          <Route exact path={`${APP_PREFIX_PATH}`} render={() => {
            const user = JSON.parse(localStorage.getItem('main_user') || '{}');
            
            if (user.role === 'Creator') {
              if (!user.verified) {
                return <Redirect to={`${APP_PREFIX_PATH}/creators/verification-pending`} />;
              }
              return <Redirect to={`${APP_PREFIX_PATH}/creators/dashboard`} />;
            }
            
            return <Redirect to={`${APP_PREFIX_PATH}/brands/dashboard`} />;
          }} />

          {/* Main app routes with verification check */}
          <RouteInterceptor path={APP_PREFIX_PATH} isAuthenticated={token}>
            <VerifiedRoute path={APP_PREFIX_PATH}>
              <AppLayout direction={direction} location={location} />
            </VerifiedRoute>
          </RouteInterceptor>
        </Switch>
      </ConfigProvider>
    </IntlProvider>
  );
};

const mapStateToProps = ({ theme, auth }) => {
  const { locale, direction } = theme;
  const { token } = auth;
  return { locale, token, direction };
};

export default withRouter(connect(mapStateToProps)(Views));