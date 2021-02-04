import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import ReactTable from 'react-table';
import PropTypes from 'prop-types'; // ES6
import {isMobile} from 'react-device-detect';

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
            Header: '#Year',
            accessor: 'holdingYear',
            show : !isMobile
        },{
            Header: 'Actual Cost',
            accessor: 'cost',
            show : !isMobile
        },{
            Header: 'Average Cost',
            accessor: 'totalAvgCost',
            show : !isMobile
        }, {
            Header: 'Market Value',
            accessor: 'marketValue',
            show : !isMobile
        }, {
            Header: 'Unrealized P&L',
            accessor: 'unrealizedPL',
            show : !isMobile,
            Cell: props => <span style={{
                color: props.value >= 0 ? props.value == 0?'#FFFF00': '#57d500': '#ff2e00'
            }}>{props.value} </span>// Custom cell components!
        },
        {
            Header: 'Adjusted P&L',
            accessor: 'adjUnrealizedPL',
            show : !isMobile,
            Cell: props => <span style={{
                color: props.value >= 0 ? props.value == 0?'#FFFF00': '#57d500': '#ff2e00'
            }}>{props.value} </span>// Custom cell components!
        },{
            Header: 'Average Cost/Share',
            accessor: 'avgCost',
        } ,{
            Header: 'Price/ Share',
            accessor: 'marketPrice',
        } ,{
            Header: 'P&L',
            accessor: 'PL',
            Cell: props => <span style={{
                color: props.value >= 0 ? props.value == 0?'#FFFF00': '#57d500': '#ff2e00'
            }}>{props.value} % </span>// Custom cell components!
        }
        ,{
            Header: 'Avg P&L',
            accessor: 'avgPL',
            show : !isMobile,
            Cell: props => <span style={{
                color: props.value >= 0 ? props.value == 0?'#FFFF00': '#57d500': '#ff2e00'
            }}>{props.value} % </span>// Custom cell components!
        }, {
            Header: 'Action',
            Cell: props => <button className='btn btn-lg btn-tran' onClick={(e) => this.props.onAction(e, props)}><i className="fas fa-edit"></i></button> // Custom cell components!
        },
        {
            expander: true,
            Header: 'More',
            Expander: ({ isExpanded }) =>
            <button className='btn btn-lg btn-tran'>
                {isExpanded
                ? <i class="fas fa-minus"></i>
                : <i class="fas fa-plus"></i>}
            </button>
        }
    ];
        return (
            <ReactTable
                data={this.props.data}
                columns={columns}
                defaultPageSize={35}
                pageSize={this.props.data.length || 35}
                SubComponent={row => {
                    let infoTbl = [
                        {name : 'ROI' , accessor : 'ROI', unit : '%' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : '#Year' , accessor : 'holdingYear', unit : 'Years' , pos: '#ffffff' , neg : '#ffffff', neutral : '#ffffff'},
                        {name : 'Average Dividend Per Year' , accessor : 'avgDividendPerYear', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Average Dividend' , accessor : 'avgDividendPercent', unit : '%' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Current Year Dividend' , accessor : 'curDividend', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Current Year Dividend' , accessor : 'curDividendPercent', unit : '%' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Last Year Dividend' , accessor : 'prevDividend', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Last Year Dividend' , accessor : 'prevDividendPercent', unit : '%' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Actual Cost' , accessor : 'cost', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Average Cost' , accessor : 'totalAvgCost', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Market Value' , accessor : 'marketValue', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Average P&L' , accessor : 'avgPL', unit : '%' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                        {name : 'Unrealized P&L' , accessor : 'unrealizedPL', unit : '฿' , pos: '#57d500' , neg : '#ff2e00', neutral : '#FFFF00'},
                    ];
                    return (
                        infoTbl.map( (info) =>{
                            let value = row.original[info.accessor]
                            value = parseFloat(String(value).replace(/,/g, ''))
                            let valueStr = value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                            return (<span style={{color : (value >= 0 ? value == 0?'#FFFF00': '#57d500': '#ff2e00')}}> {info.name} : {valueStr} {info.unit}</span>)
                        })
                    )
                  }}
            />
        );
    }
}
Table.propTypes = {
    data : PropTypes.func.isRequired,
    onAction : PropTypes.func.isRequired,
};
export default Table;