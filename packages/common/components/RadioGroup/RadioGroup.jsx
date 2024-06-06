import PropTypes from 'prop-types';
import styles from './RadioGroup.module.css';

const RadioGroup = ({ name, label, items }) => {
    return (
        <fieldset>
            <legend className={styles['label']}>{label}</legend>
            <div className={styles['radio-group']}>
                {items.map(
                    (item) => (
                        <span key={item.value} className={styles['radio-item']}>
                            <input className={styles['radio']} type="radio" name={name} value={item.value} />
                            <label htmlFor={item.value}>{item.label}</label>
                        </span>
                    )
                )}
            </div>
        </fieldset>
    );
};

RadioGroup.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired
};

export default RadioGroup;
