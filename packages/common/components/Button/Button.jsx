import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Button.module.css';

export const ButtonVariants = {
    PRIMARY: 'primary',
    SECONDARY: 'secondary'
};

const Button = ({ children, variant = ButtonVariants.PRIMARY, ...buttonProps }) => (
    <button
        className={(
            clsx(
                styles.button,
                {
                    [styles['button--primary']]: variant === ButtonVariants.PRIMARY,
                    [styles['button--secondary']]: variant === ButtonVariants.SECONDARY
                }
            )
        )}
        {...buttonProps}
    >
        {children}
    </button>
);

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(Object.values(ButtonVariants))
};

export default Button;