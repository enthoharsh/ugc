import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig'

export const AppViews = () => {
  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>

{/* BRANDS ROUTES */}

        <Route path={`${APP_PREFIX_PATH}/brands/dashboard`} component={lazy(() => import(`./home`))} />
        <Route exact path={`${APP_PREFIX_PATH}/brands/all-contracts`} component={lazy(() => import(`../../pages/AllContracts`))} />
        <Route exact path={`${APP_PREFIX_PATH}/brands/campaigns/order-form`} component={lazy(() => import(`../../pages/OrderCampaigns`))} />
        <Route exact path={`${APP_PREFIX_PATH}/brands/campaigns/all-campaigns`} component={lazy(() => import(`../../pages/AllCampaigns`))} />
        <Route exact path={`${APP_PREFIX_PATH}/brands/campaigns/campaign-detail/:id`} component={lazy(() => import(`../../pages/CampaignDetail`))} />
        <Route exact path={`${APP_PREFIX_PATH}/brands/campaigns/campaign-detail/view-project/:id`} component={lazy(() => import(`../../pages/ViewProject`))} />
        <Route exact path={`${APP_PREFIX_PATH}/brands/campaigns/campaign-detail/campaign-info/:id`} component={lazy(() => import(`../../pages/CampaignInfo`))} />
        <Route path={`${APP_PREFIX_PATH}/brands/account-settings`} component={lazy(() => import(`../../pages/AccountSettings`))} />

{/* BRANDS ROUTES */}


{/* CREATORS ROPUTE */}

        <Route path={`${APP_PREFIX_PATH}/creators/dashboard`} component={lazy(() => import(`./home`))} />
        <Route path={`${APP_PREFIX_PATH}/creators/account-settings`} component={lazy(() => import(`../../pages/AccountSettings`))} />
        <Route exact path={`${APP_PREFIX_PATH}/creators/all-contracts`} component={lazy(() => import(`../../pages/AllContracts`))} />
        <Route path={`${APP_PREFIX_PATH}/creators/marketplace`} component={lazy(() => import(`../../pages/MarketPlace`))} />
        <Route path={`${APP_PREFIX_PATH}/creators/portfolio`} component={lazy(() => import(`../../pages/Profile`))} />
        {/* <Route path={`${APP_PREFIX_PATH}/jobs`} component={lazy(() => import(`../../pages/Jobs`))} />
        <Route path={`${APP_PREFIX_PATH}/notification`} component={lazy(() => import(`../../pages/Notification`))} />
        <Route path={`${APP_PREFIX_PATH}/chats`} component={lazy(() => import(`../../pages/Chats`))} /> */}

{/* CREATORS ROPUTE */}
        <Redirect from={`${APP_PREFIX_PATH}`} to={`${APP_PREFIX_PATH}/home`} />
      </Switch>
    </Suspense>
  )
}

export default React.memo(AppViews);