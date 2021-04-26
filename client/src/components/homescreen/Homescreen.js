import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import CreateAccount 					from '../modals/CreateAccount';
import { WNavbar, WNavItem } 			from 'wt-frontend';
import { WLayout, WLHeader, WLMain } from 'wt-frontend';
import world from './world.jpg';

const Homescreen = (props) => {

	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);

	const auth = props.user === null ? false : true;

	const setShowLogin = () => {
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	return (
		<WLayout wLayout="header-lside">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' />
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} auth={auth} 
							setShowCreate={setShowCreate} setShowLogin={setShowLogin} userName={props.user.name}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<WLMain>
				{
					<div className="image-container">
						<div class="globe">
							<img src={world} alt="The planet Earth, seen from space." width="500" height="500"></img>
						</div>
						<p class="welcome-text">Welcome To The World Data Mapper</p>
					</div>
				}
			</WLMain>

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} setShowLogin={setShowLogin}/>)
			}

		</WLayout>
	);
};

export default Homescreen;
