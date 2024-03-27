import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ children, ...buttonProps }) => (
    <button className={styles.button} {...buttonProps}>{children}</button>
);

Button.propTypes = {
    children: PropTypes.node.isRequired
};

export default Button;