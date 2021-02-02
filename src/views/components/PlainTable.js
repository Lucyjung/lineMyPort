import React, { Component } from 'react';
import { Table} from 'react-bootstrap';
import PropTypes from 'prop-types'; // ES6

class PlainTable extends Component{
    render() {


        return (
            <Table>
                <thead>
                    <tr>
                        {this.props.header.map( header => 
                            <th key={header}>
                                {header}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(this.props.data).map( (value) =>
                        <tr key={value}>
                            <td >
                                {value}
                            </td>
                            <td >
                                {this.props.data[value]}
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        );
    }
}

PlainTable.propTypes = {
    header : PropTypes.array,
    data : PropTypes.object,

};

export default PlainTable;