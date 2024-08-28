import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useMutation } from '@tanstack/react-query';
import Avatar from '@timo/common/components/Avatar';
import RadioGroup from '@timo/common/components/RadioGroup';
import Input from '@timo/common/components/Input';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import { updateUser } from '@timo/common/api';
import { userAvatarAtom, userActionAtom, userIdAtom, usernameAtom, UserAtomActions } from '../../../atoms/userAtoms';
import styles from '../Profile.module.css';

const CustomizeUser = () => {
    const userAvatar = useAtomValue(userAvatarAtom);
    const userId = useAtomValue(userIdAtom);
    const username = useAtomValue(usernameAtom);
    const runUserAtomAction = useSetAtom(userActionAtom);
    const [avatar, setAvatar] = useState({
        character: undefined,
        background: undefined
    });

    useEffect(() => {
        if (userAvatar.character && userAvatar.background) {
            setAvatar(userAvatar);
        }
    }, [userAvatar]);

    const { mutate: updateUserM, error: updateUserError, isPending: isUpdatingUser, isSuccess: userUpdated } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            runUserAtomAction({ action: UserAtomActions.Refresh });
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
            id: userId,
            username,
            avatar_character: avatarCharacter,
            avatar_background: avatarBackground
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
                        defaultValue={userAvatar.background}
                        onChange={handleAvatarBackgroundChange}
                    />
                    <Input
                        name="avatar-character"
                        label="Avatar character"
                        type="text"
                        maxLength={1}
                        pattern="[A-Za-z]"
                        defaultValue={userAvatar.character}
                        onChange={handleAvatarCharacterChange}
                        labelVisible
                        required
                    />
                    <Input
                        name="username"
                        label="Username"
                        type="text"
                        defaultValue={username}
                        labelVisible
                        required
                    />
                    {updateUserStatus && <StatusMessage className={styles['status']} message={updateUserStatus} />}
                    <div className={styles['button']}>
                        <Button value="login" type="submit">Save</Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CustomizeUser;