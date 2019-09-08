import React, { Component } from 'react';
import {Pie, Bar} from 'react-chartjs';
import PlainTable from '../components/PlainTable';

import config from '../config/interface';
const BACKEND_API_URL = config.backendURL;

const liff = window.liff; 

class SummaryContainer extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            chartData: [],
            chartOptions: {
                animateRotate : true ,
                animateScale: true,
            },
            barOptions: {
                responsive: true,
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Dividend Chat'
                }
            },
            sumHeader: ['Total', 'Value'],
            sumData: {},
            dividendChartData : {labels : [] , datasets : [
                {
                    label: 'Dividend',
                    data: []
                }]},
            dividendHeader: ['Year', 'Dividend'],
            dividendData : {},
            profitHeader : ['Symbol', 'Profit/Loss'],
            profitData : {}
        };
        this.initialize = this.initialize.bind(this);
    }
    initialize() {
        
        liff.init(async () => {
            let profile = await liff.getProfile();
            this.setState({
                user : profile.userId
            });
            await this.getPortData();
        }); 
        this.getPortData();
        
    }
    async componentDidMount() {
        window.addEventListener('load', this.initialize);
        
    }
    async getPortData(){
        let response = await fetch(BACKEND_API_URL + '/portfolio/' + this.state.user);
        let json = await response.json();
        let chartData = [];
        let dividendData = {};
        let profitData = {};
        let dividendChartData = {labels : [] , datasets : [
            {
                label: 'Dividend',
                backgroundColor: 'rgba(0,0,205,0.5)',
                data: []
            }]};
        for (let key in json.summary){
            if (key.toUpperCase() == 'CASH'){
                chartData.push({
                    value : json.summary[key],
                    label : 'Cash',
                    color: '#F7464A',
                    highlight: '#FF5A5E',
                });
            }
            else if (key.toUpperCase() == 'FUND'){
                chartData.push({
                    value : json.summary[key],
                    label : 'Fund',
                    color: '#46BFBD',
                    highlight: '#5AD3D1',
                });
            }
            else if (key.toUpperCase() == 'STOCK'){
                chartData.push({
                    value : json.summary[key],
                    label : 'Stock',
                    color: '#FDB45C',
                    highlight: '#FFC870',
                });
            }
            else if (key.toUpperCase() == 'UNKNOWN'){
                chartData.push({
                    value : json.summary[key],
                    label : 'Unknown',
                    color: '#000000',
                    highlight: '#000000',
                });
            }
        }

        for (let key in json.dividendList){
            dividendChartData.labels.push(key);
            dividendChartData.datasets[0].data.push(json.dividendList[key].amount);
            dividendData[key] = json.dividendList[key].amount;
        }

        for (let key in json.profit){
            if (profitData[json.profit[key].symbol]){
                profitData[json.profit[key].symbol] += json.profit[key].profit;
            }
            else{
                profitData[json.profit[key].symbol] = json.profit[key].profit;
            }
            
        }
        this.setState({ 
            sumData: json.summary,
            chartData: chartData,
            dividendChartData: dividendChartData,
            dividendData: dividendData,
            profitData: profitData
        });
    }
    render() {
        
        return (
            <div>
                <h2> Asset Summary </h2>
                <Pie data={this.state.chartData} options={this.state.chartOptions} width="600" height="250"/>
                <PlainTable 
                    header={this.state.sumHeader}
                    data={this.state.sumData}
                />
                <hr />
                
                <h2> Dividend Summary </h2>
                <Bar data={this.state.dividendChartData} options={this.state.barOptions} width="600" height="250"/>
                <PlainTable 
                    header={this.state.dividendHeader}
                    data={this.state.dividendData}
                />
                <hr />
                <h2> Profit/Loss Summary </h2>
                <PlainTable 
                    header={this.state.profitHeader}
                    data={this.state.profitData}
                />
            </div>
        );
    }
}
export default SummaryContainer;