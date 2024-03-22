import { listEntries } from '@timer-app/common/api';
import { useEffect, useState } from 'react';

const Entries = () => {
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
        </div>
    );
};

export default Entries;
