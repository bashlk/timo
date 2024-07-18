import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import useUser from '@timo/common/hooks/useUser';

const TopBarWithUser = ({ history }) => {
    const user = useUser();
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
