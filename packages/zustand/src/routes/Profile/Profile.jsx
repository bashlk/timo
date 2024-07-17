import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Title from '@timo/common/components/Title';
import Avatar from '@timo/common/components/Avatar';
import Input from '@timo/common/components/Input';
import Button, { ButtonVariants } from '@timo/common/components/Button';
import StatusMessage from '@timo/common/components/StatusMessage';
import RadioGroup from '@timo/common/components/RadioGroup';
import useUser from '@timo/common/hooks/useUser';
import { updateUser, updatePassword, logout } from '@timo/common/api';
import styles from './Profile.module.css';

const Profile = () => {
    const user = useUser();
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

    const { mutate: updateUserM, error: updateUserError, isPending: isUpdatingUser, isSuccess: userUpdated } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            // Clear the user in context and force refetch
            user.clearUser();
        }
    });
    const updateUserStatus =
        updateUserError ? updateUserError.message :
            isUpdatingUser ? 'Loading...' :
                userUpdated ? 'Profile updated' : '';
    const handleCustomizeFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const avatarCharacter = formData.get('avatar-character');
        const avatarBackground = formData.get('avatar-background');
        updateUserM({
            id: user?.data?.id,
            username,
            avatar_character: avatarCharacter,
            avatar_background: avatarBackground
        });
    };

    const { mutate: updatePasswordM , error: updatePasswordError, isPending: isUpdatingPassword, isSuccess: passwordUpdated } = useMutation({
        mutationFn: updatePassword
    });
    const updatePasswordStatus =
        updatePasswordError ? updatePasswordError.message :
            isUpdatingPassword ? 'Loading...' :
                passwordUpdated ? 'Password updated' : '';
    const handlePasswordFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const password = formData.get('password');
        const newPassword = formData.get('newPassword');
        updatePasswordM({
            username: user?.data?.username,
            password,
            newPassword
        });
    };

    const { mutate: logoutM } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            user.clearUser();
        }
    });

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
                    {updateUserStatus && <StatusMessage className={styles['status']} message={updateUserStatus} />}
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
                    {updatePasswordStatus && <StatusMessage className={styles['status']} message={updatePasswordStatus} />}
                    <div className={styles['button']}>
                        <Button value="login" type="submit">Change password</Button>
                    </div>
                </div>
            </form>
            <Button
                className={styles['sign-out']}
                value="login"
                variant={ButtonVariants.SECONDARY}
                onClick={logoutM}
            >
                Sign out
            </Button>
        </div>
    );
};

export default Profile;
