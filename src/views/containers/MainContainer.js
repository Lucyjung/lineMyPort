import React, { Component } from 'react';
import ActionModal from '../components/ActionModal';
import Table from '../components/Table';
import * as API from '../utils/api';
let data = [];
class MainContainer extends Component{
    constructor(props, context) {
        super(props, context);
    
        this.handleModalSubmit = this.handleModalSubmit.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    
        this.state = {
            show: false
        };
        data = API.getUserAsset('U28bae1ada29dcce79109253c7083afd3');
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