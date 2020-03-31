import React from 'react';
import { Router, Route, IndexRoute,IndexRedirect,Redirect, } from 'dva/router';
import TenantLoginPage from '../../pages/koubei-org-map/TenantLoginPage';
import OrgMapPage from '../../pages/koubei-org-map/OrgMapPage';

export default function ({ history }) {
  let indexStep = (window.initStep == '1') ? 1 : 0;
  return (
    <Router history={history}>
      <Route path="/tenant_login" component={TenantLoginPage} />
      <Route path="/org_map" component={OrgMapPage} />
      <Redirect from="/" to={indexStep == '0' ? '/tenant_login' : '/org_map'} />
    </Router>
  );
}
