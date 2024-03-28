import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Entry.module.css';
import IconButton from '../IconButton';
import { Icons } from '../IconButton/IconButton';
import Input from '../Input';
import formatDuration from '../../utils/formatDuration';

const Entry = ({ id, description, start_time, end_time, onEdit = () => {}, onDelete = () => {} }) => {
    const [editable, setEditable] = useState(false);

    const handleSaveClick = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedEntry = {
            id,
            description: formData.get('description'),
            start_time: formData.get('start_time'),
            end_time: formData.get('end_time')
        };
        onEdit(updatedEntry);
        setEditable(false);
    };

    const handleEditClick = () => {
        setEditable(true);
    };

    const handleCancelClick = () => {
        setEditable(false);
    };

    const handleDeleteClick = () => {
        onDelete(id);
    };

    if (!editable) {
        return (
            <div className={styles['entry']}>
                <div className={styles['entry__left']}>
                    <div className={styles['entry__description']}>{description}</div>
                    <div className={styles['entry__dates']}>
                        {start_time.slice(11, 19)}
                        {' - '}
                        {end_time.slice(11, 19)}
                        {' '}
                        ({formatDuration(new Date(new Date(end_time) - new Date(start_time)))})
                    </div>
                </div>
                <div className={styles['entry__right']}>
                    <IconButton icon={Icons.EDIT} onClick={handleEditClick} />
                    <IconButton icon={Icons.DELETE} onClick={handleDeleteClick} />
                </div>
            </div>
        );
    }

    return (
        <form className={styles['entry']} action="" onSubmit={handleSaveClick}>
            <div className={styles['entry__left']}>
                <Input name="description" type="text" defaultValue={description} />
                <div className={styles['entry__date-inputs']}>
                    <Input className={styles['entry__date-input']} name="start_time" type="datetime-local" defaultValue={start_time} />
                    <Input className={styles['entry__date-input']} name="end_time" type="datetime-local" defaultValue={end_time} />
                </div>
            </div>
            <div className={styles['entry__right']}>
                <IconButton type="submit" icon={Icons.SAVE} />
                <IconButton icon={Icons.UNDO} onClick={handleCancelClick} />
            </div>
        </form>
    );
};

Entry.propTypes = {
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
};

export default Entry;

