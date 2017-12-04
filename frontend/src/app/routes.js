import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
import Owner from './components/views/Owner';
import Renter from './components/views/Renter';
import Oracle from './components/views/Oracle';

import NotFound from './components/views/NotFound';

export default (
    <Route path="/" component={App}>
            <IndexRoute component={Renter} />
            <Route path="/owner" component={Owner} />
            <Route path="/oracle" component={Oracle} />
            <Route path="*" component={NotFound} />
    </Route>
);
