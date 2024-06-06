import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = ({ className, label, labelVisible, ...inputProps }) => (
    <div>
        {labelVisible && <label className={styles.label}>{label}</label>}
        <input
            className={clsx(styles.input, className)}
            aria-label={label}
            {...inputProps}
        />
    </div>
);

Input.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelVisible: PropTypes.bool,
};

export default Input;