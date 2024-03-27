import styles from './Input.module.css';

const Input = ({ ...inputProps }) => (
    <input className={styles.input} {...inputProps} />
);

export default Input;