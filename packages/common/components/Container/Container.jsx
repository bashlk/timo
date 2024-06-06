import PropTypes from 'prop-types';
import TopBar from '../TopBar/TopBar';
import styles from './Container.module.css';

const Container = ({ children, onTopBarIconClick, onAvatarClick }) => (
    <div className={styles.container}>
        <TopBar onIconClick={onTopBarIconClick} onAvatarClick={onAvatarClick} />
        {children}
    </div>
);

Container.propTypes = {
    children: PropTypes.node.isRequired,
    onTopBarIconClick: PropTypes.func,
    onAvatarClick: PropTypes.func
};

export default Container;