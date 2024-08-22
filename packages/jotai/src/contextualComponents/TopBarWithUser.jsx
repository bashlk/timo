import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import { useAtomValue } from 'jotai';
import userAtom from '../atoms/userAtom';

const TopBarWithUser = ({ history }) => {
    const user = useAtomValue(userAtom);

    return (
        <TopBar
            avatar={{
                character: user?.data?.avatar_character,
                background: user?.data?.avatar_background
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
