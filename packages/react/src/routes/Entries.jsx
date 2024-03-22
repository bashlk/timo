import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { listEntries } from '@timer-app/common/api';
import Tabs from '@timer-app/common/components/Tabs';
import { TABS } from '../constants';

const Entries = ({ history }) => {
    const [entries, setEntries] = useState(null);

    useEffect(() => {
        listEntries().then((entries) => {
            setEntries(entries);
        });
    }, []);

    return (
        <div>
            <h1>Entries</h1>
            {entries ? (
                <ul>
                    {entries.map((entry) => (
                        <li key={entry.id}>
                            <span>{entry.description}</span>
                            <span>{entry.start_time}</span>
                            <span>{entry.end_time}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading...</p>
            )}
            <Tabs tabs={TABS} history={history} />
        </div>
    );
};

Entries.propTypes = {
    history: PropTypes.object.isRequired
};

export default Entries;
