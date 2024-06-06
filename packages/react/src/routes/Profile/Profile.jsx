import { useState } from 'react';

import Title from '@timo/common/components/Title';
import Avatar from '@timo/common/components/Avatar';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import RadioGroup from '@timo/common/components/RadioGroup';

import styles from './Profile.module.css';

const Profile = () => {
    const [statusMessage, setStatusMessage] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const action = e.nativeEvent.submitter.value;

        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        setStatusMessage('Loading...');
    };

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <Avatar className={styles['avatar']} character="B" background="light" large />
            <form className={styles['form']} action="" onSubmit={handleFormSubmit}>
                <h2 className={styles['subheading']}>Customize</h2>
                <div className={styles['form-controls']}>
                    <RadioGroup label="Avatar background" name="avatar-background" items={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' }
                    ]} />
                    <Input label="Avatar character" name="avatar-character" type="text" labelVisible required />
                    <Input label="Username" name="username" type="text" labelVisible required />
                    {statusMessage && <StatusMessage className={styles['status']} message={statusMessage} />}
                    <div className={styles['button']}>
                        <Button value="login" type="submit">Save</Button>
                    </div>
                </div>
            </form>
            <form className={styles['form']} action="" onSubmit={handleFormSubmit}>
                <h2 className={styles['subheading']}>Change password</h2>
                <div className={styles['form-controls']}>
                    <Input label="Old password" name="password" type="password" labelVisible required />
                    <Input label="New password" name="newPassword" type="password" labelVisible required />
                    {statusMessage && <StatusMessage className={styles['status']} message={statusMessage} />}
                    <div className={styles['button']}>
                        <Button value="login" type="submit">Change password</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
