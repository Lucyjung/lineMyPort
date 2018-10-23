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
            show: false,
            data: []
        };
        //data = API.getUserAsset();
    }
    async componentDidMount() {
        const response = await fetch('https://lineportfolio.herokuapp.com/portfolio/U28bae1ada29dcce79109253c7083afd3');
        const json = await response.json();
        this.setState({ data: json.data });
    }
    handleButtonClick(e, props){
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
                    data={this.state.data}
                    onAction={this.handleButtonClick}
                />
            </div>
        );
    }
}
export default MainContainer;