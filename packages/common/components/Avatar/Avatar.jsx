import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Avatar.module.css';

const Avatar = ({ className, character, background, large, onClick = () => {} }) => (
    <div
        className={
            clsx(styles['avatar'],
                {
                    [styles['avatar--dark']]: background === 'dark',
                    [styles['avatar--light']]: background === 'light',
                    [styles['avatar--large']]: large
                },
                className
            )}
        onClick={onClick}
    >
        <div className={styles['emoji']}>
            {character}
        </div>
    </div>
);

Avatar.propTypes = {
    className: PropTypes.string,
    character: PropTypes.string.isRequired,
    background: PropTypes.oneOf([
        'dark',
        'light'
    ]),
    large: PropTypes.bool,
    onClick: PropTypes.func
};

export default Avatar;