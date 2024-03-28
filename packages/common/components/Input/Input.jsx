import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = ({ className, ...inputProps }) => (
    <input className={clsx(styles.input, className)} {...inputProps} />
);

Input.propTypes = {
    className: PropTypes.string
};

export default Input;