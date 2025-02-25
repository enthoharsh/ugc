import React, { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loading from 'components/shared-components/Loading';
import { APP_PREFIX_PATH } from 'configs/AppConfig';
import { VerifiedRoute } from "../../components/VerificationRoutes";

export const AppViews = () => {
  const user = JSON.parse(localStorage.getItem('main_user') || '{}');
  const isCreator = user.role === 'Creator';
  const isVerified = user.verified !== false;

  return (
    <Suspense fallback={<Loading cover="content"/>}>
      <Switch>
        {/* VERIFICATION ROUTE - handled separately in Views.js */}

        {/* BRANDS ROUTES */}
        <VerifiedRoute path={`${APP_PREFIX_PATH}/brands/dashboard`} component={lazy(() => import(`./brands-dashboard`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/all-contracts`} component={lazy(() => import(`../../pages/AllContracts`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/campaigns/order-form`} component={lazy(() => import(`../../pages/OrderCampaigns`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/campaigns/all-campaigns`} component={lazy(() => import(`../../pages/AllCampaigns`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/campaigns/campaign-detail/:id`} component={lazy(() => import(`../../pages/CampaignDetail`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/campaigns/campaign-detail/view-project/:id`} component={lazy(() => import(`../../pages/ViewProject`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/portfolio/:id`} component={lazy(() => import(`../../pages/Profile`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/brands/campaigns/campaign-detail/campaign-info/:id`} component={lazy(() => import(`../../pages/CampaignInfo`))} />
        <VerifiedRoute path={`${APP_PREFIX_PATH}/brands/account-settings`} component={lazy(() => import(`../../pages/AccountSettings`))} />

        {/* CREATORS ROUTES */}
        <VerifiedRoute path={`${APP_PREFIX_PATH}/creators/dashboard`} component={lazy(() => import(`./creators-dashboard`))} />
        <VerifiedRoute path={`${APP_PREFIX_PATH}/creators/account-settings`} component={lazy(() => import(`../../pages/AccountSettings`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/creators/all-contracts`} component={lazy(() => import(`../../pages/AllContracts`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/creators/view-contract/:id`} component={lazy(() => import(`../../pages/ViewProject`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/creators/marketplace`} component={lazy(() => import(`../../pages/MarketPlace`))} />
        <VerifiedRoute exact path={`${APP_PREFIX_PATH}/creators/marketplace/view-project/:id`} component={lazy(() => import(`../../pages/CampaignInfo`))} />
        <VerifiedRoute path={`${APP_PREFIX_PATH}/creators/portfolio`} component={lazy(() => import(`../../pages/Profile`))} />

      </Switch>
    </Suspense>
  );
};

export default React.memo(AppViews);