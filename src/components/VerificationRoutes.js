import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { APP_PREFIX_PATH } from 'configs/AppConfig';

// Custom route component that checks if creator is verified
export const VerifiedRoute = ({ children, ...rest }) => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('main_user') || '{}');
  
  // Check if user is a creator and not verified
  const isUnverifiedCreator = user.role === 'Creator' && !user.verified;
  
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isUnverifiedCreator ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: `${APP_PREFIX_PATH}/creators/verification-pending`,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

// Custom route specifically for the verification pending page
export const VerificationPendingRoute = ({ children, ...rest }) => {
  const user = JSON.parse(localStorage.getItem('main_user') || '{}');
  
  // Allow access to verification page only for unverified creators
  const isUnverifiedCreator = user.role === 'Creator' && !user.verified;
  
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isUnverifiedCreator ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: user.role === 'Creator' 
                ? `${APP_PREFIX_PATH}/creators/dashboard` 
                : `${APP_PREFIX_PATH}/brands/dashboard`,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};