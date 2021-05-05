import React                                from 'react';
import { LOGOUT }                           from '../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';
import { WButton, WNavItem }                from 'wt-frontend';
import { useHistory }		                from 'react-router-dom'


const LoggedIn = (props) => {
    const client = useApolloClient();
	const [Logout] = useMutation(LOGOUT);

    let history = useHistory();

    const handleLogout = async (e) => {
        Logout();
        const { data } = await props.fetchUser();
        if (data) {
            let reset = await client.resetStore();
            if (reset) history.push("/welcome");
        }
    };

    return (
        <>
            <WNavItem hoveranimation="lighten">
                <WButton className="account-status navbar-options" onClick={props.setShowUpdate} wType="texted" hoveranimation="text-primary"> 
                    {props.userName}
                </WButton>
            </WNavItem>
            <WNavItem hoveranimation="lighten">
                <WButton className="logged-status navbar-options" onClick={handleLogout} wType="texted" hoveranimation="text-primary">
                    Logout
                </WButton>
            </WNavItem >
        </>
    );
};

const LoggedOut = (props) => {
    return (
        <>
            <WNavItem hoveranimation="lighten">
                <WButton className="account-status navbar-options" onClick={props.setShowCreate} wType="texted" hoveranimation="text-primary"> 
                    Create Account
                </WButton>
            </WNavItem>
            <WNavItem hoveranimation="lighten">
                <WButton className="logged-status navbar-options" onClick={props.setShowLogin} wType="texted" hoveranimation="text-primary">
                    Login
                </WButton>
            </WNavItem>
        </>
    );
};


const NavbarOptions = (props) => {
    return (
        <>
            {
                props.auth === false ? <LoggedOut setShowLogin={props.setShowLogin} setShowCreate={props.setShowCreate}/>
                : <LoggedIn fetchUser={props.fetchUser} setActiveList={props.setActiveList} logout={props.logout} userName={props.userName}
                    setShowUpdate={props.setShowUpdate}/>
            }
        </>

    );
};

export default NavbarOptions;