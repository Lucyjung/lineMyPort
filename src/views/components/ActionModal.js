import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Modal, InputGroup , FormControl, DropdownButton, MenuItem, Col, Row, ButtonToolbar, ToggleButtonGroup, ToggleButton, Alert} from 'react-bootstrap';
import '../styles/style.css';

class ActionModal extends React.Component {
    
    render() {
        let readonly = true;
        
        let supportAsset = [
            {type: 'Stock'},
            {type: 'Fund'},
            {type: 'Cash'},
            {type: 'FX'},
            {type: 'Gold'},
            {type: 'Insure'}
        ];
        let menuItems = [];
        let type = this.props.type;
        let isCash = (type.toUpperCase() == 'CASH');
        if (!this.props.isExist){
            readonly = false;
        }
        
        for (let asset of supportAsset){
            if (type == asset.type){
                menuItems.push(<MenuItem eventKey={asset.type} active={true}>{asset.type}</MenuItem>)
            } else {
                menuItems.push(<MenuItem eventKey={asset.type} active={false}>{asset.type}</MenuItem>)
            }
        }

        let typeDropDown = <DropdownButton 
            bsStyle="primary"
            title={type} 
            onSelect={this.props.onTypeChange}
            disabled={readonly}>
            {menuItems}
        </DropdownButton>;
        let actionTitle = this.props.action.charAt(0).toUpperCase() + this.props.action.substr(1);
        let buttonGrp = <Row className="show-grid">
            <Col xs={12} md={10}>
                <DropdownButton 
                    bsStyle="primary"
                    title={actionTitle} 
                    onSelect={this.props.onGrpChange}>
                    <MenuItem eventKey="Buy" active={this.props.action == 'buy'}>Buy</MenuItem>
                    <MenuItem eventKey="Sell" active={this.props.action == 'sell'}>Sell</MenuItem>
                    <MenuItem eventKey="Dividend" active={this.props.action == 'dividend'}>Dividend</MenuItem>
                    <MenuItem eventKey="Update" active={this.props.action == 'update'}>Update</MenuItem>
                </DropdownButton>;
            </Col>
            <Col xs={6} md={2}>
                {typeDropDown}
            </Col></Row>;

        
        
        let symbolContent = <InputGroup>
            <InputGroup.Addon>Symbol</InputGroup.Addon>
            <FormControl type="text" readOnly={readonly} value={this.props.symbol} onChange={this.props.onSymbolChange}/>
        </InputGroup>;
        let volumeContent = <InputGroup>
            <InputGroup.Addon>Volume</InputGroup.Addon>
            <FormControl type="text" readOnly={isCash} value={this.props.volume} onChange={this.props.onVolChange}/>
        </InputGroup>;
        
        let amountContent = <InputGroup>
            <InputGroup.Addon>Amount</InputGroup.Addon>
            <FormControl type="text" placeholder={this.props.amount} onChange={this.props.onAmountChange}/>
        </InputGroup>;
        
        let dateContent = <InputGroup>
            <InputGroup.Addon>Date&nbsp;&nbsp;&nbsp;&nbsp;</InputGroup.Addon>
            <FormControl type="text" value={this.props.date} onChange={this.props.onDateChange}/>
        </InputGroup>;

        let alartContent = '';
        if (this.props.warningMsg != ''){
            alartContent = <Alert bsStyle="warning">
                <strong>{this.props.warningMsg}</strong> 
            </Alert>;
        }
        return <div className="static-modal">
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>{buttonGrp}{symbolContent}{volumeContent}{amountContent}{dateContent}{alartContent}</Modal.Body>
            
                <Modal.Footer>
                    <button className='btn btn-default' onClick={this.props.onClose}>
                        Close
                    </button>
                    <button className='btn btn-primary' onClick={this.props.onSubmit}>
                        Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </div>;
    }
}
ActionModal.propTypes = {
    onSubmit : PropTypes.func.isRequired,
    onClose : PropTypes.func.isRequired,
    onGrpChange: PropTypes.func.isRequired,
    onSymbolChange: PropTypes.func.isRequired,
    onTypeChange: PropTypes.func.isRequired,
    onVolChange: PropTypes.func.isRequired,
    onAmountChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    title : PropTypes.string.isRequired,
    action : PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    show : PropTypes.bool.isRequired,
    isExist: PropTypes.bool.isRequired,
    warningMsg: PropTypes.string
};

export default ActionModal;