import React from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types'; // ES6
import 'react-datepicker/dist/react-datepicker.css';
const styles = {
    content: {
        textAlign: 'center',
    }
};

function Calendar (props) {
    return (
        <div className=".col-sm-6 center-block" style={styles.content}>
            <DatePicker
                selected={props.startDate}
                onChange={props.onChange}
            />
        </div>
    );
}

Calendar.propTypes = {
    onChange : PropTypes.func.isRequired,
    startDate : PropTypes.string.isRequired,
};
export default Calendar;