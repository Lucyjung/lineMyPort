import React, { Component } from 'react';
import ActionModal from '../components/ActionModal';
import Table from '../components/Table';
import Button from '../components/LargeButton';
import PlainTable from '../components/PlainTable';
import moment from 'moment';
import { Col, Row} from 'react-bootstrap';
import config from '../config/interface';

const BACKEND_API_URL = config.backendURL;
const liff = window.liff; 

class MainContainer extends Component{
    constructor(props, context) {
        super(props, context);
    
        this.initialize = this.initialize.bind(this);
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleTableButtonClick = this.handleTableButtonClick.bind(this);
        this.handleMainButtonClick = this.handleMainButtonClick.bind(this);
        this.handleSymbolChange = this.handleSymbolChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleVolChange = this.handleVolChange.bind(this); 
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleActionChange = this.handleActionChange.bind(this);

        this.state = {
            show: false,
            data: [],
            modalTitle : 'Buy/Sell/Dividend',
            action: 'buy',
            symbol: '',
            type: '',
            volume: 0,
            amount: 0,
            date: moment().format('DD/MM/YYYY'),
            user: '',
            isExist: false,
            warningMsg: '',
            sumHeader: ['Total', 'Value'],
            sumData: {}
        };
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
    async getPortData(){
        let response = await fetch(BACKEND_API_URL + '/portfolio/' + this.state.user);
        let json = await response.json();
        this.setState({ 
            data: json.data,
            sumData: json.summary
        });
        return json;
    }
    componentDidMount() {
        window.addEventListener('load', this.initialize);
        
    }
    handleTableButtonClick(e, props){
        
        this.setState(() => ({
            symbol: props.original.symbol,
            type: props.original.type,
            volume: props.original.volume,
            amount: props.original.cost,
            show: true,
            isExist: true
        }));

        if (props.original.type == 'Cash'){
            this.setState(() => ({
                action: 'update'
            }));
        }
    }
    handleMainButtonClick(){
        this.setState(() => ({
            symbol: '',
            type: 'Stock',
            action: 'buy',
            volume: 0,
            amount: 0,
            show: true,
            date: moment().format('DD/MM/YYYY'),
            isExist: false
        }));
    }
    async handleModalSubmit(){
        let isValidate = true;
        if (this.state.type == 'Stock'){
            let response = await fetch(BACKEND_API_URL + '/support/?name=' + this.state.symbol);
            let json = await response.json();
            if(json.status == false ){
                isValidate = false;
            }
        }
        let volume = parseFloat(this.state.volume);
        let amount = parseFloat(this.state.amount);
        if (isNaN(volume) || isNaN(amount)){
            isValidate = false;
        }
        if (isValidate){
            let data = {
                'symbol': this.state.symbol,
                'type': this.state.type,
                'volume': this.state.volume,
                'amount': this.state.amount,
                'date': this.state.date
            };
            let response = await fetch(BACKEND_API_URL + '/portfolio/' + this.state.action + '/' + this.state.user, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:  JSON.stringify(data)
            });
            let json = await response.json();
            if (json.status){
                await this.getPortData();
                this.setState({ 
                    show: false
                });
            }
            else{
                this.setState({ 
                    warningMsg: json.msg
                });
            }
            
        }
        else{
            this.setState({ 
                warningMsg:  this.state.symbol + ' Not Support'
            });
           
        }
        
    }
    handleModalClose(){
        this.setState({ show: false });
    }
    handleActionChange(action){
        this.setState({action : action.toLowerCase()});
    }
    handleSymbolChange(e){
        this.setState({symbol : e.target.value});
    }
    handleTypeChange(type){
        this.setState({type : type});
    }
    handleVolChange(e){
        let vol = e.target.value.replace(new RegExp(',', 'g'), '');
        this.setState({volume : vol});
    }
    handleAmountChange(e){
        let amount = e.target.value.replace(new RegExp(',', 'g'), '');
        this.setState({amount : amount});
    }
    handleDateChange(e){
        this.setState({date : e.target.value});
    }

    render() {
        
        return (
            <div>
                <ActionModal
                    show={this.state.show}
                    onSubmit={this.handleModalSubmit}
                    onClose={this.handleModalClose}
                    title = {this.state.modalTitle}
                    symbol = {this.state.symbol}
                    type = {this.state.type}
                    volume = {this.state.volume}
                    amount = {this.state.amount}
                    date = {this.state.date}
                    action = {this.state.action}
                    onGrpChange = {this.handleActionChange}
                    onSymbolChange = {this.handleSymbolChange}
                    onTypeChange = {this.handleTypeChange}
                    onVolChange = {this.handleVolChange}
                    onAmountChange = {this.handleAmountChange}
                    onDateChange = {this.handleDateChange}
                    isExist = {this.state.isExist}
                    warningMsg = {this.state.warningMsg}
                />
                <Button 
                    onSubmit={this.handleMainButtonClick} 
                    label={'+ New Asset'}
                />
                <Table 
                    data={this.state.data}
                    onAction={this.handleTableButtonClick}
                />
                <PlainTable 
                    header={this.state.sumHeader}
                    data={this.state.sumData}
                />
            </div>
        );
    }
}
export default MainContainer;