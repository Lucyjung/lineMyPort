import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import HistoryContainer from '../containers/HistoryContainer';
import SummaryContainer from '../containers/SummaryContainer';
import GraphHistoryContainer from '../containers/GraphHistoryContainer';

const routes = (
    <Router>
        <Switch>
            <Route exact path='/' component={MainContainer} />
            <Route path='/history' component={HistoryContainer} />
            <Route path='/summary' component={SummaryContainer} />
            <Route path='/graph' component={GraphHistoryContainer} />
        </Switch>
    </Router>
);

export default routes;