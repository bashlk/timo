import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import useUserStore from '../zustand/useUserStore';

const TopBarWithUser = ({ history }) => {
    const userData = useUserStore((state) => state.data);
    return (
        <TopBar
            avatar={{
                character: userData?.avatar_character,
                background: userData?.avatar_background
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
