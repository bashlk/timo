import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import TopBar from '@timo/common/components/TopBar';
import UserSingleton from '../store/User';

const TopBarWithUser = observer(({ history }) => {
    return (
        <TopBar
            avatar={{
                character: UserSingleton.instance.data?.avatar_character,
                background: UserSingleton.instance.data?.avatar_background
            }}
            onIconClick={() => history.push('./')}
            onAvatarClick={() => history.push('./profile')}
        />
    );
});

TopBarWithUser.propTypes = {
    history: PropTypes.object.isRequired
};

export default TopBarWithUser;
