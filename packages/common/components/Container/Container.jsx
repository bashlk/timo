import PropTypes from 'prop-types';
import TopBar from '../TopBar/TopBar';
import styles from './Container.module.css';

const Container = ({ children, onTopBarIconClick }) => (
    <div className={styles.container}>
        <TopBar onIconClick={onTopBarIconClick} />
        {children}
    </div>
);

Container.propTypes = {
    children: PropTypes.node.isRequired,
    onTopBarIconClick: PropTypes.func
};

export default Container;