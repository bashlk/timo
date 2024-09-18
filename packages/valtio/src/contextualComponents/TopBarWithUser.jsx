import PropTypes from 'prop-types';
import { useSnapshot } from 'valtio';
import TopBar from '@timo/common/components/TopBar';
import userStore from '../../store/userStore';

const TopBarWithUser = ({ history }) => {
    const user = useSnapshot(userStore);
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
