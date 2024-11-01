import TopBar from '@timo/common/components/TopBar';
import useRootMachine from '../hooks/useRootMachine';
import useRootMachineState from '../hooks/useRootMachineState';

const TopBarWithUser = () => {
    const rootMachine = useRootMachine();
    const userData = useRootMachineState(state => state.context.userData);

    return (
        <TopBar
            avatar={{
                character: userData?.avatar_character,
                background: userData?.avatar_background
            }}
            onIconClick={() => rootMachine.send({ type: 'pushRoute', route: 'entries' })}
            onAvatarClick={() => rootMachine.send({ type: 'pushRoute', route: 'profile' })}
        />
    );
};

export default TopBarWithUser;
