import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount'
import Maps								from '../modals/Maps';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useApolloClient, useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, } from 'wt-frontend';


const MapScreen = (props) => {

	let maps							    = [];
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    = useState(false);

	const [DeleteMap] 				= useMutation(mutations.DELETE_MAP);
	const [AddMap] 					= useMutation(mutations.ADD_MAP);

	const client = useApolloClient();


	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const auth = props.user === null ? false : true;

	const createNewMap = async () => {
		let map = {
			_id: '',
			name: 'Untitled',
			owner: props.user._id,
			regions: [],
		}
		const { data } = await AddMap({ variables: { map: map }, refetchQueries: [{ query: GET_DB_MAPS }] });
	};

	const deleteMap = async (_id) => {
		DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		refetch();
	};
	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/
	const setShowLogin = () => {
		toggleShowDelete(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = () => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowDelete(!showDelete);
	};

	const setShowUpdate = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowUpdate(!showUpdate);
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
                            setShowCreate={setShowCreate} setShowLogin={setShowLogin} refetchMaps={refetch}
                            setShowUpdate={setShowUpdate} userName={props.user === null ? '' : props.user.name}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<WLMain><Maps
				maps={maps}
			/></WLMain>

			{
				showDelete && (<Delete deleteMap={deleteMap}/>)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchMaps={refetch} setShowLogin={setShowLogin}/>)
			}

		</WLayout>
	);
};

export default MapScreen;
