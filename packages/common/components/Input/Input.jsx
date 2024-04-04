import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = ({ className, label, ...inputProps }) => (
    <input
        className={clsx(styles.input, className)}
        aria-label={label}
        {...inputProps}
    />
);

Input.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired
};

export default Input;