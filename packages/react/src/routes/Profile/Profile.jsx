import { useEffect, useState } from 'react';
import Title from '@timo/common/components/Title';
import Avatar from '@timo/common/components/Avatar';
import Input from '@timo/common/components/Input';
import Button from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import RadioGroup from '@timo/common/components/RadioGroup';
import useUser from '@timo/common/hooks/useUser';
import { updateUser, updatePassword } from '@timo/common/api';
import styles from './Profile.module.css';

const Profile = () => {
    const user = useUser();
    const [customizeStatus, setCustomizeStatus] = useState(null);
    const [passwordStatus, setPasswordStatus] = useState(null);
    const [avatar, setAvatar] = useState({
        character: undefined,
        background: undefined
    });

    useEffect(() => {
        if (user?.data) {
            setAvatar({
                character: user.data.avatar_character,
                background: user.data.avatar_background
            });
        }
    }, [user]);

    const handleCustomizeFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const avatarCharacter = formData.get('avatar-character');
        const avatarBackground = formData.get('avatar-background');

        setCustomizeStatus('Loading...');

        updateUser({
            id: user?.data?.id,
            username,
            avatar_character: avatarCharacter,
            avatar_background: avatarBackground
        }).then(() => {
            setCustomizeStatus('Profile updated');
            // Clear the user in context and force refetch
            user.clearUser();
        }).catch((error) => {
            if (error instanceof TypeError) {
                setCustomizeStatus('Failed to connect to server. Please try again later.');
            } else {
                error.response.json().then((data) => {
                    setCustomizeStatus(data.message);
                });
            }
        });
    };

    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const password = formData.get('password');
        const newPassword = formData.get('newPassword');

        setPasswordStatus('Loading...');

        updatePassword({
            username: user?.data?.username,
            password,
            newPassword
        }).then(() => {
            setPasswordStatus('Password updated');
        }).catch((error) => {
            if (error instanceof TypeError) {
                setPasswordStatus('Failed to connect to server. Please try again later.');
            } else {
                error.response.json().then((data) => {
                    setPasswordStatus(data.message);
                });
            }
        });
    };

    const handleAvatarBackgroundChange = (e) => {
        setAvatar({
            ...avatar,
            background: e.target.value
        });
    };

    const handleAvatarCharacterChange = (e) => {
        setAvatar({
            ...avatar,
            character: e.target.value
        });
    };

    return (
        <div className={styles['profile']}>
            <Title>My profile</Title>
            <Avatar
                className={styles['avatar']}
                character={avatar.character}
                background={avatar.background}
                large
            />
            <form className={styles['form']} action="" onSubmit={handleCustomizeFormSubmit}>
                <h2 className={styles['subheading']}>Customize</h2>
                <div className={styles['form-controls']}>
                    <RadioGroup
                        name="avatar-background"
                        label="Avatar background"
                        items={[
                            { value: 'light', label: 'Light' },
                            { value: 'dark', label: 'Dark' }
                        ]}
                        defaultValue={user?.data?.avatar_background}
                        onChange={handleAvatarBackgroundChange}
                    />
                    <Input
                        name="avatar-character"
                        label="Avatar character"
                        type="text"
                        maxLength={1}
                        pattern="[A-Za-z]"
                        defaultValue={user?.data?.avatar_character}
                        onChange={handleAvatarCharacterChange}
                        labelVisible
                        required
                    />
                    <Input
                        name="username"
                        label="Username"
                        type="text"
                        defaultValue={user?.data?.username}
                        labelVisible
                        required
                    />
                    {customizeStatus && <StatusMessage className={styles['status']} message={customizeStatus} />}
                    <div className={styles['button']}>
                        <Button value="login" type="submit">Save</Button>
                    </div>
                </div>
            </form>
            <form className={styles['form']} action="" onSubmit={handlePasswordFormSubmit}>
                <h2 className={styles['subheading']}>Change password</h2>
                <div className={styles['form-controls']}>
                    <Input
                        label="Old password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        labelVisible
                        required
                    />
                    <Input
                        label="New password"
                        name="newPassword"
                        type="password"
                        autoComplete="new-password"
                        labelVisible
                        required
                    />
                    {passwordStatus && <StatusMessage className={styles['status']} message={passwordStatus} />}
                    <div className={styles['button']}>
                        <Button value="login" type="submit">Change password</Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Profile;
