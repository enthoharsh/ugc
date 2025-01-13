import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import Loading from 'components/shared-components/Loading';
const Chats = ({ match }) => {
  return (
    <Suspense fallback={<Loading cover="content"/>}>
    <Switch>
      <Route path={`${match.url}/chat`} component={lazy(() => import(`./chat`))} />
      <Redirect from={`${match.url}`} to={`${match.url}/chat`} />
    </Switch>
  </Suspense>
  )
}

export default Chats

