import React, { Component } from 'react';
import {Pie} from 'react-chartjs';
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
            sumHeader: ['Total', 'Value'],
            sumData: {}
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
    }
    async componentDidMount() {
        window.addEventListener('load', this.initialize);
        
    }
    async getPortData(){
        let response = await fetch(BACKEND_API_URL + '/portfolio/' + this.state.user);
        let json = await response.json();
        let chartData = [];
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
        this.setState({ 
            sumData: json.summary,
            chartData: chartData
        });
        return json;
    }
    render() {
        
        return (
            <div>
                <Pie data={this.state.chartData} options={this.state.chartOptions} width="600" height="250"/>
                <PlainTable 
                    header={this.state.sumHeader}
                    data={this.state.sumData}
                />
            </div>
        );
    }
}
export default SummaryContainer;