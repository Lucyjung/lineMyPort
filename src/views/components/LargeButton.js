import React from 'react';
import PropTypes from 'prop-types'; // ES6

class LargeButton extends React.Component {
    
    render() {
        return <button type="button" className="btn btn-primary btn-lg left-block" onClick={this.props.onSubmit}>
            {this.props.label}
        </button>;
    }
}
LargeButton.propTypes = {
    onSubmit : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired
};

export default LargeButton;