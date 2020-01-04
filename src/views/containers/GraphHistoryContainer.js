import React, { Component } from 'react';
import {Line} from 'react-chartjs';

import config from '../config/interface';
const BACKEND_API_URL = config.backendURL;

const liff = window.liff; 

class SummaryContainer extends Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            user: 'U28bae1ada29dcce79109253c7083afd3',
            selectedPeriod: '',
            selectedTimestamp: 0,
            selectedRange: 'MONTH',
            chartData: [],
            chartOpt : {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines : true,
            
                //String - Colour of the grid lines
                scaleGridLineColor : 'rgba(0,0,0,.05)',
            
                //Number - Width of the grid lines
                scaleGridLineWidth : 1,
            
                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,
            
                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,
            
                //Boolean - Whether the line is curved between points
                bezierCurve : true,
            
                //Number - Tension of the bezier curve between points
                bezierCurveTension : 0.4,
            
                //Boolean - Whether to show a dot for each point
                pointDot : true,
            
                //Number - Radius of each point dot in pixels
                pointDotRadius : 4,
            
                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth : 1,
            
                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius : 20,
            
                //Boolean - Whether to show a stroke for datasets
                datasetStroke : true,
            
                //Number - Pixel width of dataset stroke
                datasetStrokeWidth : 2,
            
                //Boolean - Whether to horizontally center the label and point dot inside the grid
                offsetGridLines : false
            }
        };
        this.initialize = this.initialize.bind(this);
        this.onClickNext = this.onClickNext.bind(this);
        this.onClickPrevious = this.onClickPrevious.bind(this);
    }
    async initialize() {
        
        liff.init({
            liffId: '1616862554-9rx3EYmy' // use own liffId
        }).then(async () => {
            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }
            else{
                let profile = await liff.getProfile();
                this.setState({
                    user : profile.userId
                });
                let start = new Date();
                start.setHours(0,0,0,0);
                start.setDate(1);
                
                let end = new Date();
                end.setHours(23,59,59,0);
                end.setMonth(end.getMonth()+1 , 0);

                let period = start.getFullYear() + '/' + (start.getMonth() + 1);
                this.setState({ 
                    selectedPeriod: period,
                    selectedTimestamp : start.getTime()
                });

                await this.getHistoryData(start.getTime()/1000, end.getTime()/1000);
            }
        });

        
    }
    async componentDidMount() {
        window.addEventListener('load', this.initialize);
        
    }
    async getHistoryData(from, to){
        let response = await fetch(BACKEND_API_URL + '/History/' + this.state.user + '?from='+from + '&to=' + to);
        let json = await response.json();
        if (json.status){
            let raw = json.data;
            let chartData = { labels: [] , datasets : [
                {
                    label: 'Stock',
                    fillColor: 'rgba(0,0,255,0.2)',
                    strokeColor: 'rgba(0,0,255,1)',
                    pointColor: 'rgba(0,0,255,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(0,0,255,1)',
                    data: []
                },
                {
                    label: 'Fund',
                    fillColor: 'rgba(0,255,0,0.2)',
                    strokeColor: 'rgba(0,255,0,1)',
                    pointColor: 'rgba(0,255,0,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(0,255,0,1)',
                    data: []
                },
                {
                    label: 'Cash',
                    fillColor: 'rgba(255,255,0,0.2)',
                    strokeColor: 'rgba(255,255,0,1)',
                    pointColor: 'rgba(255,255,0,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(255,255,0,1)',
                    data: []
                },
                {
                    label: 'Unknown',
                    fillColor: 'rgba(0,0,0,0.2)',
                    strokeColor: 'rgba(255,0,255,1)',
                    pointColor: 'rgba(255,0,255,1)',
                    pointStrokeColor: '#000',
                    pointHighlightFill: '#000',
                    pointHighlightStroke: 'rgba(255,0,255,1)',
                    data: []
                },
                {
                    label: 'Total',
                    fillColor: 'rgba(0,255,255,0.2)',
                    strokeColor: 'rgba(0,255,255,1)',
                    pointColor: 'rgba(0,255,255,1)',
                    pointStrokeColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(0,255,255,1)',
                    data: []
                }
            ]};
            for (let i in raw){
                chartData.labels.push(raw[i].date);
                chartData.datasets[0].data.push(raw[i].market.stock);
                chartData.datasets[1].data.push(raw[i].market.fund);
                chartData.datasets[2].data.push(raw[i].market.cash);
                chartData.datasets[3].data.push(raw[i].market.unknown);
                chartData.datasets[4].data.push(raw[i].market.total);
            }

            
            this.setState({ 
                chartData: chartData
            });
        }
    }
    onClickPrevious(){
        let prev =  new Date(this.state.selectedTimestamp);
        prev.setDate(0);
        this.setPeriodByTime(prev.getTime(), this.state.selectedRange);
        
        
    }
    onClickNext(){
        let next =  new Date(this.state.selectedTimestamp);
        
        if (this.state.selectedRange == 'YEAR'){
            next.setMonth(12);
        } else {
            next.setMonth(next.getMonth() + 1);
        }
        this.setPeriodByTime(next.getTime(), this.state.selectedRange);

    }
    onClickChangePeriod(newRange){
        this.setState({ 
            selectedRange: newRange
        });
        this.setPeriodByTime(this.state.selectedTimestamp, newRange);
    }
    setPeriodByTime(timestamp, range){
        let start = new Date(timestamp);
        start.setHours(0,0,0,0);
        start.setDate(1);
        
        
        let end = new Date(timestamp);
        end.setHours(23,59,59,0);
        end.setMonth(end.getMonth()+1 , 0);

        let period = start.getFullYear() + '/' + (start.getMonth() + 1);

        if (range && range == 'YEAR'){
            start.setMonth(0);
            end.setMonth(12,0);
            period = start.getFullYear();
        }
        this.setState({ 
            selectedPeriod: period,
            selectedTimestamp: start.getTime()
        });
        this.getHistoryData(start.getTime()/1000, end.getTime()/1000);
        
    }
    
    render() {
        
        return (
            <div className="container-fluid">
                <div className="row">
                    <h2> Asset History </h2>
                </div>
                <div className="row">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-secondary" onClick={this.onClickChangePeriod.bind(this, 'MONTH')}>Month</button>
                        <button type="button" className="btn btn-secondary" onClick={this.onClickChangePeriod.bind(this, 'YEAR')}>Year</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-4">
                        <span className="glyphicon glyphicon-chevron-left" aria-hidden="true" onClick={this.onClickPrevious}></span>
                    </div>
                    <div className="col-xs-6 col-md-4">
                        <h5> {this.state.selectedPeriod}</h5>
                    </div>
                    <div className="col-xs-6 col-md-4">
                        <span className="glyphicon glyphicon-chevron-right" aria-hidden="true" onClick={this.onClickNext}></span>
                    </div>
                </div>
                <div className="row">
                    <Line data={this.state.chartData} options={this.state.chartOpt} width="800" height="500" redraw/>
                </div>
            </div>
        );
    }
}
export default SummaryContainer;