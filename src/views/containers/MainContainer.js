import React, { Component } from 'react';
import ActionModal from '../components/ActionModal';
import Table from '../components/Table';
import Button from '../components/LargeButton';
import moment from 'moment';
const BACKEND_API_URL = 'https://lineportfolio.herokuapp.com';
class MainContainer extends Component{
    constructor(props, context) {
        super(props, context);
    
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
            user: 'U28bae1ada29dcce79109253c7083afd3'
        };
    }
    async componentDidMount() {
        let response = await fetch(BACKEND_API_URL + '/portfolio/' + this.state.user);
        let json = await response.json();
        this.setState({ data: json.data });
    }
    handleTableButtonClick(e, props){
        
        this.setState(() => ({
            symbol: props.original.symbol,
            type: props.original.type,
            volume: props.original.volume,
            amount: props.original.amount,
            show: true
        }));
    }
    handleMainButtonClick(){
        this.setState(() => ({
            symbol: '',
            type: '',
            volume: 0,
            amount: 0,
            show: true
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
        let amount = parseFloat(this.state.volume);
        if (!isNaN(volume) || !isNaN(amount)){
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
            fetch(BACKEND_API_URL + '/portfolio/' + this.state.action + '/' + this.state.user, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body:  JSON.stringify(data)
            });
        }

        this.setState({ show: false });
    }
    handleModalClose(){
        this.setState({ show: false });
    }
    handleActionChange(e){
        this.setState({action : e.target.value});
    }
    handleSymbolChange(e){
        this.setState({symbol : e.target.value});
    }
    handleTypeChange(type){
        this.setState({type : type});
    }
    handleVolChange(e){
        this.setState({volume : e.target.volume});
    }
    handleAmountChange(e){
        this.setState({amount : e.target.amount});
    }
    handleDateChange(e){
        this.setState({date : e.target.date});
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
                    onGrpChange = {this.handleActionChange}
                    onSymbolChange = {this.handleSymbolChange}
                    onTypeChange = {this.handleTypeChange}
                    onVolChange = {this.handleVolChange}
                    onAmountChange = {this.handleAmountChange}
                    onDateChange = {this.handleDateChange}
                />
                <Button 
                    onSubmit={this.handleMainButtonClick} 
                    label={'+ New Asset'}
                />
                <Table 
                    data={this.state.data}
                    onAction={this.handleTableButtonClick}
                />
            </div>
        );
    }
}
export default MainContainer;