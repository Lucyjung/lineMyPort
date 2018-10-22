import React, { Component } from 'react';

import ReactTable from 'react-table';
import PropTypes from 'prop-types'; // ES6

import '../styles/style.css';
class Table extends Component{
 
    render() {
        
        const columns = [{
            Header: 'Symbol',
            accessor: 'symbol' // String-based value accessors!
        }, {
            Header: 'Type',
            accessor: 'type',
        },  {
            Header: 'Cost',
            accessor: 'cost',
        },  {
            Header: 'Volume',
            accessor: 'volume',
        },{
            Header: 'Average Cost/Share',
            accessor: 'avgCost',
        } ,{
            Header: 'Market Price',
            accessor: 'marketPrice',
        }, {
            Header: 'P&L',
            accessor: 'PL',
            Cell: props => <span style={{
                color: props.value > 0 ? '#57d500': '#ff2e00'
            }}>{props.value} % </span>// Custom cell components!
        }, {
            Header: 'Action',
            Cell: props => <button className='btn btn-lg btn-tran' onClick={(e) => this.props.onAction(e, props)}><i className="fas fa-edit"></i></button> // Custom cell components!
        }];
        return (
            <ReactTable
                data={this.props.data}
                columns={columns}
            />
        );
    }
}
Table.propTypes = {
    data : PropTypes.func.isRequired,
    onAction : PropTypes.func.isRequired,
};
export default Table;