import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Modal, InputGroup , FormControl, DropdownButton, MenuItem, Col, Row, ButtonToolbar, ToggleButtonGroup, ToggleButton} from 'react-bootstrap';
import '../styles/style.css';

class ActionModal extends React.Component {
    
    render() {
        let readonly = true;
        let isStock = true;
        let isFund = false;
        let isCash = false;
        let type = this.props.type;
        if (this.props.symbol == ''){
            readonly = false;
        }
        if (this.props.type == 'Stock'){
            isStock = true;
            isFund = false;
            isCash = false;
        }
        else if (this.props.type == 'Fund'){
            isStock = false;
            isFund = true;
            isCash = false;
        }
        else if (this.props.type == 'Cash'){
            isStock = false;
            isFund = false;
            isCash = true;
        }
        else{
            type = 'Stock';
        }

        let typeDropDown = <DropdownButton 
            bsStyle="primary"
            title={type} 
            onSelect={this.props.onTypeChange}
            disabled={readonly}>
            <MenuItem eventKey="Stock" active={isStock}>Stock</MenuItem>
            <MenuItem eventKey="Fund" active={isFund}>Fund</MenuItem>
            <MenuItem eventKey="Cash" active={isCash}>Cash</MenuItem>
        </DropdownButton>;

        let buttonGrp = <Row className="show-grid">
            <Col xs={12} md={10}>
                <ButtonToolbar>
                    <ToggleButtonGroup type="radio" name="options" defaultValue={"buy"} onChange={this.props.onGrpChange}>
                        <ToggleButton value="buy">Buy</ToggleButton>
                        <ToggleButton value="sell">Sell</ToggleButton>
                        <ToggleButton value="dividend">dividend</ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
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
            <FormControl type="text" value={this.props.volume} onChange={this.props.onVolChange}/>
        </InputGroup>;
        
        let amountContent = <InputGroup>
            <InputGroup.Addon>Amount</InputGroup.Addon>
            <FormControl type="text" value={this.props.amount} onChange={this.props.onAmountChange}/>
        </InputGroup>;
        
        let dateContent = <InputGroup>
            <InputGroup.Addon>Date&nbsp;&nbsp;&nbsp;&nbsp;</InputGroup.Addon>
            <FormControl type="text" value={this.props.date} onChange={this.props.onDateChange}/>
        </InputGroup>;
        return <div className="static-modal">
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>{buttonGrp}{symbolContent}{volumeContent}{amountContent}{dateContent}</Modal.Body>
            
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
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    volume: PropTypes.number.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
    show : PropTypes.bool.isRequired
};

export default ActionModal;