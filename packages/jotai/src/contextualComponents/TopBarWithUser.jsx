import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import { useAtomValue, useSetAtom } from 'jotai';
import { userAvatarAtom } from '../atoms/userAtoms';

const TopBarWithUser = ({ locationAtom }) => {
    const userAvatar = useAtomValue(userAvatarAtom);
    const setLocation = useSetAtom(locationAtom);

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

TopBarWithUser.propTypes = {
    locationAtom: PropTypes.object.isRequired
};

export default TopBarWithUser;
