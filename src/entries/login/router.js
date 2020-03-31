import React from 'react';
import { Router, Route, IndexRoute,IndexRedirect } from 'dva/router';

import LoginPage from '../../pages/login/login-page/LoginPage';

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={LoginPage}></Route>
      <Route path="/*" component={LoginPage}>
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
}
