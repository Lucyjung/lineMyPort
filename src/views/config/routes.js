import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import HistoryContainer from '../containers/HistoryContainer';

const routes = (
    <Router>
        <Switch>
            <Route exact path='/' component={MainContainer} />
            <Route path='/history' component={HistoryContainer} />
        </Switch>
    </Router>
);

export default routes;