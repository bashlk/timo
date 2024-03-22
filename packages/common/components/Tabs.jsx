import PropTypes from 'prop-types';

const Tabs = ({ tabs, history }) => {
    const currentTab = tabs.find(tab => tab.path === history.location.pathname);

    return (
        <div>
            {tabs.map(tab => (
                <button
                    key={tab.path}
                    onClick={() => history.push(tab.path)}
                    style={{ fontWeight: tab === currentTab ? 'bold' : 'normal' }}
                >
                    {tab.name}
                </button>
            ))}
        </div>
    );
};

Tabs.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ).isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        location: PropTypes.shape({
            pathname: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default Tabs;