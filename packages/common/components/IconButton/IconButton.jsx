import { IconPencil, IconX, IconCheck, IconArrowBackUp } from '@tabler/icons-react';
import PropTypes from 'prop-types';
import styles from './IconButton.module.css';

export const Icons = {
    'EDIT': IconPencil,
    'DELETE': IconX,
    'SAVE': IconCheck,
    'UNDO': IconArrowBackUp
};

const IconButton = ({ icon: IconComponent, label, ...buttonProps }) => {
    return (
        <button className={styles['icon-button']} aria-label={label} {...buttonProps}>
            <IconComponent className={styles['icon']} size={24} />
        </button>
    );
};

IconButton.propTypes = {
    icon: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
};

export default IconButton;