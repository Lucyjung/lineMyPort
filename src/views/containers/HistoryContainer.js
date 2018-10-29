import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
import { Table} from 'react-bootstrap';
import moment from 'moment';
class HistoryContainer extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            header: ['Action', 'Volume', 'Amount', 'Date'],
            data: props.location.state.data,
            symbol: props.location.state.name
        };

    }


    render() {
        
        return (
            <div>
                <h2>{this.state.symbol}</h2>
                <Table striped>
                    <thead>
                        <tr>
                            {this.state.header.map( header => 
                                <th key={header}>
                                    {header}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.map( (value, index) =>
                            <tr key={index}>
                                <td >
                                    {value.action}
                                </td>
                                <td >
                                    {value.volume}
                                </td>
                                <td >
                                    {value.amount}
                                </td>
                                <td >
                                    {moment(value.date).format('DD/MM/YYYY')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        );
    }
}

HistoryContainer.propTypes = {
    location: PropTypes.object,
    data : PropTypes.array,

};

export default HistoryContainer;