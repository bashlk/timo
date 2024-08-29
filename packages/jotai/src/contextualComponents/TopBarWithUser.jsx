import TopBar from '@timo/common/components/TopBar';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAvatarAtom } from '../atoms/userAtoms';
import { baseAwareLocationAtom } from '../atoms/locationAtoms';

const TopBarWithUser = () => {
    const userAvatar = useAtomValue(userAvatarAtom);
    const setLocation = useSetAtom(baseAwareLocationAtom);

    return (
        <TopBar
            avatar={{
                character: userAvatar?.character,
                background: userAvatar?.background
            }}
            onIconClick={() => setLocation({ pathname: '/' })}
            onAvatarClick={() => setLocation({ pathname: '/profile' })}
        />
    );
};

export default TopBarWithUser;
