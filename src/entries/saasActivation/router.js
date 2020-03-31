import React from 'react';
import { Router, Route, IndexRoute,IndexRedirect } from 'dva/router';
import ActivationPage         from '../../pages/saasActivation/ActivationPage';

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={ActivationPage}></Route>
      <Route path="/*" component={ActivationPage}>
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
}
