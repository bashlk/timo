import Avatar from '@timo/common/components/Avatar';
import RadioGroup from '@timo/common/components/RadioGroup';
import Input from '@timo/common/components/Input';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import styles from '../Profile.module.css';
import UserMachineContext from '../../../context/UserMachineContext';
import { useActor } from '@xstate/react';
import customizeUserMachine, { CUSTOMIZE_USER_EVENTS } from '../../../machines/customizeUserMachine';

const CustomizeUser = () => {
    const userMachine = UserMachineContext.useActorRef();
    const updatedMachine = customizeUserMachine.provide({
        actors: {
            userMachine
        }
    });
    const [state, send] = useActor(updatedMachine);

    const handleAvatarBackgroundChange = (e) => {
        send({
            type: CUSTOMIZE_USER_EVENTS.CHANGE_AVATAR_BACKGROUND,
            background: e.target.value
        });
    };

    const handleAvatarCharacterChange = (e) => {
        send({
            type: CUSTOMIZE_USER_EVENTS.CHANGE_AVATAR_CHARACTER,
            character: e.target.value
        });
    };

    const handleCustomizeFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const avatarCharacter = formData.get('avatar-character');
        const avatarBackground = formData.get('avatar-background');

        send({
            type: CUSTOMIZE_USER_EVENTS.SAVE,
            username,
            avatarCharacter,
            avatarBackground
        });
    };

    return (
        <>
            <Avatar
                className={styles['avatar']}
                character={state.context.avatar.character}
                background={state.context.avatar.background}
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
                        defaultValue={userData?.avatar_background}
                        onChange={handleAvatarBackgroundChange}
                    />
                    <Input
                        name="avatar-character"
                        label="Avatar character"
                        type="text"
                        maxLength={1}
                        pattern="[A-Za-z]"
                        defaultValue={userData?.avatar_character}
                        onChange={handleAvatarCharacterChange}
                        labelVisible
                        required
                    />
                    <Input
                        name="username"
                        label="Username"
                        type="text"
                        defaultValue={userData?.username}
                        labelVisible
                        required
                    />
                    {customizeStatus && <StatusMessage className={styles['status']} message={customizeStatus} />}
                    <div className={styles['button']}>
                        <Button type="submit">Save</Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CustomizeUser;
