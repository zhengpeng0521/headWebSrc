import React from 'react';
import { Router, Route, IndexRoute,IndexRedirect } from 'dva/router';
import RegisteredH5Page         from '../../pages/saasRegisteredH5Page/RegisteredH5Page';

export default function ({ history }) {
  return (
    <Router history={history}>
      <Route path="/" component={RegisteredH5Page}></Route>
      <Route path="/*" component={RegisteredH5Page}>
        <IndexRedirect to="/" />
      </Route>
    </Router>
  );
}
