import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Modal } from 'react-bootstrap';


class ActionModal extends React.Component {
    
    render() {
        return <div className="static-modal">
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header>
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
            
                <Modal.Body>{this.props.content}</Modal.Body>
            
                <Modal.Footer>
                    <button className='btn btn-default' onClick={this.props.onClose}>
                        Close
                    </button>
                    <button className='btn btn-primary' onClick={this.props.onSubmit}>
                        Save changes
                    </button>
                </Modal.Footer>
            </Modal>
        </div>;
    }
}
ActionModal.propTypes = {
    onSubmit : PropTypes.func.isRequired,
    onClose : PropTypes.func.isRequired,
    title : PropTypes.string.isRequired,
    content : PropTypes.string.isRequired,
    show : PropTypes.bool.isRequired
};

export default ActionModal;