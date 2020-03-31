import React from 'react';
import { Router, Route, IndexRoute,IndexRedirect } from 'dva/router';

import SaasLogin         from '../../pages/saasLoginPage/LoginPage';

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={SaasLogin}></Route>
      <Route path="/*" component={SaasLogin}>
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
}
