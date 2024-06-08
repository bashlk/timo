import { forwardRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './Input.module.css';

const Input = forwardRef(({ className, label, labelVisible, ...inputProps }, ref) => (
    <div>
        {labelVisible && <label className={styles.label}>{label}</label>}
        <input
            ref={ref}
            className={clsx(styles.input, className)}
            aria-label={label}
            {...inputProps}
        />
    </div>
));

Input.displayName = 'Input';

Input.propTypes = {
    className: PropTypes.string,
    label: PropTypes.string.isRequired,
    labelVisible: PropTypes.bool
};

export default Input;