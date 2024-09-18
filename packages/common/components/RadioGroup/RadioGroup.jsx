import PropTypes from 'prop-types';
import styles from './RadioGroup.module.css';

const RadioGroup = ({ name, label, items, defaultValue, onChange }) => {
    return (
        <fieldset>
            <legend className={styles['label']}>{label}</legend>
            <div className={styles['radio-group']}>
                {items.map(
                    (item) => (
                        <span key={item.value} className={styles['radio-item']}>
                            <input
                                id={`${name}-${item.value}`}
                                className={styles['radio']}
                                type="radio"
                                name={name}
                                value={item.value}
                                defaultChecked={defaultValue ? item.value === defaultValue : undefined}
                                onChange={onChange}
                            />
                            <label htmlFor={`${name}-${item.value}`}>{item.label}</label>
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
    defaultValue: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })).isRequired,
    onChange: PropTypes.func
};

export default RadioGroup;
