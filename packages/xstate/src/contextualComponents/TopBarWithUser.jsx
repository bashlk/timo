import TopBar from '@timo/common/components/TopBar';
import useSystemMachine from '../hooks/useSystemMachine';
import useSystemMachineState from '../hooks/useSystemMachineState';

const TopBarWithUser = () => {
    const userData = useSystemMachineState('root', (state) => state.context.userData);
    const rootMachine = useSystemMachine('root');

    return (
        <TopBar
            avatar={{
                character: userData?.avatar_character,
                background: userData?.avatar_background
            }}
            onIconClick={() => rootMachine.send({ type: 'pushLocation', location: './' })}
            onAvatarClick={() => rootMachine.send({ type: 'pushLocation', location: './profile' })}
        />
    );
};

export default TopBarWithUser;
