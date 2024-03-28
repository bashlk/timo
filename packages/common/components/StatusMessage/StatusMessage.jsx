import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './StatusMessage.module.css';

const StatusMessage = ({ message, className }) => (
    <div className={clsx(styles['status-message'], className)}>
        {message}
    </div>
);

StatusMessage.propTypes = {
    message: PropTypes.string.isRequired
};

export default StatusMessage;