import React, { Component } from 'react';
import ActionModal from '../components/ActionModal';
import Table from '../components/Table';

class MainContainer extends Component{
    constructor(props, context) {
        super(props, context);
    
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    
        this.state = {
            show: false
        };
    }
    handleButtonClick(e, props){
        console.log(props);
        this.setState(() => ({
            show: true
        }));
    }
    handleModalSubmit(){
        this.setState({ show: false });
    }
    handleModalClose(){
        this.setState({ show: false });
    }
    render() {
        const data = [{
            'symbol': 'K-VALUE',
            'type': 'Fund',
            'cost': 31262.609999999993,
            'volume': 6828.642,
            'avgCost': 4.578159171325718,
            'marketPrice': '7.0735',
            'PL': 50
        },
        {
            'symbol': 'BTS',
            'type': 'Stock',
            'cost': 74906.9,
            'volume': 10000,
            'avgCost': 7.49069,
            'marketPrice': 0,
            'PL': -10
        },];
        
        return (
            <div>
                <ActionModal
                    show={this.state.show}
                    onSubmit={this.handleModalSubmit}
                    onClose={this.handleModalClose}
                    title = 'test title'
                    content = 'test cpontent'
                />

                <Table 
                    data={data}
                    onAction={this.handleButtonClick}
                />
            </div>
        );
    }
}
export default MainContainer;