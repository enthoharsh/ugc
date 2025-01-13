import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        <Route path={`${APP_PREFIX_PATH}/home`} component={lazy(() => import(`./home`))} />
        <Route path={`${APP_PREFIX_PATH}/campaigns`} component={lazy(() => import(`../../pages/Campaigns`))} />
        <Route path={`${APP_PREFIX_PATH}/marketplace`} component={lazy(() => import(`../../pages/MarketPlace`))} />
        <Route path={`${APP_PREFIX_PATH}/jobs`} component={lazy(() => import(`../../pages/Jobs`))} />
        <Route path={`${APP_PREFIX_PATH}/notification`} component={lazy(() => import(`../../pages/Notification`))} />
        <Route path={`${APP_PREFIX_PATH}/chats`} component={lazy(() => import(`../../pages/Chats`))} />
        <Route path={`${APP_PREFIX_PATH}/profile`} component={lazy(() => import(`../../pages/Profile`))} />
        <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/home`} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews);