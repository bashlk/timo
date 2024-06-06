import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Avatar.module.css';

const Avatar = ({ className, character, background }) => (
    <div
        className={
            clsx(styles['avatar'],
                {
                    [styles['avatar--dark']]: background === 'dark',
                    [styles['avatar--light']]: background === 'light'
                },
                className
            )}
    >
        <div className={styles['emoji']}>
            {character}
        </div>
    </div>
);

Avatar.propTypes = {
    className: PropTypes.string,
    character: PropTypes.string.isRequired,
    background: PropTypes.oneOf(
        'dark',
        'light'
    )
};

export default Avatar;