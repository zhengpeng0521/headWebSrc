import React from 'react';
import { Router, Route, IndexRoute,IndexRedirect } from 'dva/router';
import RegisteredPage         from '../../pages/saasRegisteredPage/registeredPage';

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={RegisteredPage}></Route>
      <Route path="/*" component={RegisteredPage}>
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
}
