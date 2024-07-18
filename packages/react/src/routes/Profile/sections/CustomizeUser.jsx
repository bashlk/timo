import { useEffect, useState } from 'react';
import Avatar from '@timo/common/components/Avatar';
import RadioGroup from '@timo/common/components/RadioGroup';
import Input from '@timo/common/components/Input';
import useUser from '@timo/common/hooks/useUser';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import { updateUser } from '@timo/common/api';
import styles from '../Profile.module.css';

const CustomizeUser = () => {
    const user = useUser();
    const [customizeStatus, setCustomizeStatus] = useState(null);
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
            setCustomizeStatus(error.message);
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
        <>
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
        </>
    );
};

export default CustomizeUser;
