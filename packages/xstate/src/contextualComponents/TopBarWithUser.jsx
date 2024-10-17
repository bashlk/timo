import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import UserMachineContext from '../context/UserMachineContext';

const TopBarWithUser = ({ history }) => {
    const userData = UserMachineContext.useSelector((state) => state.context.data);

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
