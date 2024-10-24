import Avatar from '@timo/common/components/Avatar';
import RadioGroup from '@timo/common/components/RadioGroup';
import Input from '@timo/common/components/Input';
import StatusMessage from '@timo/common/components/StatusMessage';
import Button from '@timo/common/components/Button';
import useSystemMachineState from '../../../hooks/useSystemMachineState';
import useSystemMachine from '../../../hooks/useSystemMachine';
import styles from '../Profile.module.css';

const CustomizeUser = () => {
    const customizeUserMachine = useSystemMachine('customizeUser');
    const {
        username,
        avatar_character,
        avatar_background,
        statusMessage
    } = useSystemMachineState('customizeUser', state => state.context);

    const handleCustomizeFormSubmit = (e) => {
        e.preventDefault();
        customizeUserMachine.send({ type: 'save' });
    };

    const handleAvatarBackgroundChange = (e) => {
        customizeUserMachine.send({
            type: 'changeAvatarBackground',
            value: e.target.value
        });
    };

    const handleAvatarCharacterChange = (e) => {
        customizeUserMachine.send({
            type: 'changeAvatarCharacter',
            value: e.target.value
        });
    };

    const handleUsernameChange = (e) => {
        customizeUserMachine.send({
            type: 'changeUsername',
            value: e.target.value
        });
    };

    return (
        <>
            <Avatar
                className={styles['avatar']}
                character={avatar_character}
                background={avatar_background}
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
                        defaultValue={avatar_background}
                        onChange={handleAvatarBackgroundChange}
                    />
                    <Input
                        name="avatar-character"
                        label="Avatar character"
                        type="text"
                        maxLength={1}
                        pattern="[A-Za-z]"
                        defaultValue={avatar_character}
                        onChange={handleAvatarCharacterChange}
                        labelVisible
                        required
                    />
                    <Input
                        name="username"
                        label="Username"
                        type="text"
                        defaultValue={username}
                        onChange={handleUsernameChange}
                        labelVisible
                        required
                    />
                    {statusMessage && <StatusMessage className={styles['status']} message={statusMessage} />}
                    <div className={styles['button']}>
                        <Button type="submit">Save</Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CustomizeUser;
