import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import useSystemMachineState from '../hooks/useSystemMachineState';

const TopBarWithUser = ({ history }) => {
    const userData = useSystemMachineState('root', (state) => state.context.userData);

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
