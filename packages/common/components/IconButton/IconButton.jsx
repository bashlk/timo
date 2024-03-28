import { IconPencil, IconX, IconCheck, IconArrowBackUp } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import styles from './IconButton.module.css';

export const Icons = {
    'EDIT': IconPencil,
    'DELETE': IconX,
    'SAVE': IconCheck,
    'UNDO': IconArrowBackUp
};

const IconButton = ({ icon: IconComponent, ...buttonProps }) => {
    return (
        <button className={styles['icon-button']} {...buttonProps}>
            <IconComponent className={styles['icon-button__icon']} size={24} />
        </button>
    );
};

IconButton.propTypes = {
    icon: PropTypes.object.isRequired
};

export default IconButton;