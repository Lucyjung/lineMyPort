import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import ReactTable from 'react-table';
import PropTypes from 'prop-types'; // ES6

import '../styles/style.css';
class Table extends Component{
 
    render() {
        
        const columns = [{
            Header: 'Symbol',
            Cell: props => <Link to={{ pathname: '/history', state: { data: props.original.history, name: props.original.symbol} }}>{props.original.symbol}</Link> // Custom cell components!
        }, {
            Header: 'Type',
            accessor: 'type',
        },  {
            Header: 'Volume',
            accessor: 'volume',
        },  {
            Header: 'Holding Year',
            accessor: 'holdingYear',
        },{
            Header: 'Actual Cost',
            accessor: 'cost',
        },{
            Header: 'Average Cost',
            accessor: 'totalAvgCost',
        }, {
            Header: 'Market Value',
            accessor: 'marketValue',
        }, {
            Header: 'Average Cost/Share',
            accessor: 'avgCost',
        } ,{
            Header: 'Price/ Share',
            accessor: 'marketPrice',
        } ,{
            Header: 'P&L',
            accessor: 'PL',
            Cell: props => <span style={{
                color: props.value > 0 ? props.value == 0?'#CDFF00': '#57d500': '#ff2e00'
            }}>{props.value} % </span>// Custom cell components!
        }
        ,{
            Header: 'Avg P&L',
            accessor: 'avgPL',
            Cell: props => <span style={{
                color: props.value > 0 ? props.value == 0?'#CDFF00': '#57d500': '#ff2e00'
            }}>{props.value} % </span>// Custom cell components!
        }, {
            Header: 'Action',
            Cell: props => <button className='btn btn-lg btn-tran' onClick={(e) => this.props.onAction(e, props)}><i className="fas fa-edit"></i></button> // Custom cell components!
        }];
        return (
            <ReactTable
                data={this.props.data}
                columns={columns}
                defaultPageSize={50}
            />
        );
    }
}
Table.propTypes = {
    data : PropTypes.func.isRequired,
    onAction : PropTypes.func.isRequired,
};
export default Table;