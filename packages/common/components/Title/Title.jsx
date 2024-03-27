import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Title.module.css';

const Title = ({ children, className }) => (
    <h1 className={clsx(styles.title, className)}>{children}</h1>
);

Title.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string
};

export default Title;