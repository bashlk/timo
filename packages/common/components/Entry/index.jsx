import { useState } from 'react';
import PropTypes from 'prop-types';

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
            <div>
                <span>{description} {start_time.slice(11, 19)} - {end_time.slice(11, 19)}</span>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
            </div>
        );
    }

    return (
        <div>
            <form action="" onSubmit={handleSaveClick}>
                <input name="description" type="text" defaultValue={description} />
                <input name="start_time" type="datetime-local" defaultValue={start_time} />
                <input name="end_time" type="datetime-local" defaultValue={end_time} />
                <button type="submit">Save</button>
                <button onClick={handleCancelClick}>Cancel</button>
            </form>
        </div>
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

