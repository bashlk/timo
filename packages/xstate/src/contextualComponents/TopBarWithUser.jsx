import PropTypes from 'prop-types';
import TopBar from '@timo/common/components/TopBar';
import useMachineState from '../hooks/useMachineState';

const TopBarWithUser = ({ history }) => {
    const userData = useMachineState('root', (state) => state.context.userData);

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
