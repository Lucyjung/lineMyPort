import React from 'react';

class Main extends React.Component{
    render () {
        return (
        
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <ul className="nav nav-tabs">
                            <li>
                                Home
                            </li>
                            <li>
                                Summary
                            </li>
                            <li className="dropdown pull-right">
                                <a href="#" data-toggle="dropdown" className="dropdown-toggle">Setting<strong className="caret"></strong></a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <a href="#">Profile</a>
                                    </li>
                                    <li>
                                        <a href="#">Logout</a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;