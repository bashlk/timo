import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import { useAtomValue } from 'jotai';
import { userAvatarAtom } from '../atoms/userAtoms';

const TopBarWithUser = ({ history }) => {
    const userAvatar = useAtomValue(userAvatarAtom);

    return (
        <TopBar
            avatar={{
                character: userAvatar?.character,
                background: userAvatar?.background
            }}
            onIconClick={() => history.push('./')}
            onAvatarClick={() => history.push('./profile')}
        />
    );
};

TopBarWithUser.propTypes = {
    history: PropTypes.object.isRequired
};

export default TopBarWithUser;
