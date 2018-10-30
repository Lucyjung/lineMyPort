import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MainContainer from '../containers/MainContainer';
import HistoryContainer from '../containers/HistoryContainer';
import SummaryContainer from '../containers/SummaryContainer';

const routes = (
    <Router>
        <Switch>
            <Route exact path='/' component={MainContainer} />
            <Route path='/history' component={HistoryContainer} />
            <Route path='/summary' component={SummaryContainer} />
        </Switch>
    </Router>
);

export default routes;