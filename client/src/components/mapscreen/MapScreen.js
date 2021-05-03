import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import Login 							from '../modals/Login';
import Delete 							from '../modals/Delete';
import CreateAccount 					from '../modals/CreateAccount';
import CreateMap						from '../modals/CreateMap';
import Rename 							from '../modals/Rename';
import Maps								from './Maps';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, } from 'wt-frontend';
import { useHistory } from 'react-router-dom';
import UpdateAccount from '../modals/Update';


const MapScreen = (props) => {

	let maps							    = [];
	const [currentMapId, setCurrentMapId]   = useState('');
	const [currentMapName, setCurrentMapName] = useState('');
	const [showDelete, toggleShowDelete] 	= useState(false);
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    = useState(false);
	const [showMap, toggleShowMap]			= useState(false);
	const [showRename, toggleShowRename]	= useState(false);

	const [DeleteMap] 				= useMutation(mutations.DELETE_MAP);
	const [AddMap] 					= useMutation(mutations.ADD_MAP);
	const [RenameMap]				= useMutation(mutations.RENAME_MAP);

	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { maps = data.getAllMaps; }

	const auth = props.user === null ? false : true;
	let history = useHistory();
	if (!auth) history.push("/welcome");

	const createNewMap = async (name) => {
		let map = {
			name: name,
			owner: props.user._id
		}
		const { data } = await AddMap({ variables: { map: map }, refetchQueries: [{ query: GET_DB_MAPS }] });
		if (data) {
			let mapId = data['addMap'];
			history.push("/map/" + mapId, { _id: mapId })
			return mapId;
		}
		else return "Unable to add map.";
	};

	const renameMap = async (name, _id) => {
		let map = {
			name: name,
			owner: props.user._id
		}
		const { data } = await RenameMap({ variables: { map: map, _id : _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		if (data) return data["renameMap"];
		else return "Unable to rename map.";
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
		toggleShowUpdate(false);
		toggleShowMap(false);
		toggleShowRename(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowDelete(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowMap(false);
		toggleShowRename(false);
		toggleShowCreate(!showCreate);
	};

	const setShowDelete = async (_id) => {
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowUpdate(false);
		toggleShowMap(false);
		toggleShowRename(false);
		toggleShowDelete(!showDelete);
		setCurrentMapId(_id);
	};

	const setShowUpdate = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowDelete(false);
		toggleShowMap(false);
		toggleShowRename(false);
		toggleShowUpdate(!showUpdate);
	};

	const setShowMap = () => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowDelete(false);
		toggleShowUpdate(false);
		toggleShowRename(false);
		toggleShowMap(!showMap);
	}

	const setShowRename = async (_id, name) => {
		toggleShowLogin(false);
		toggleShowCreate(false);
		toggleShowDelete(false);
		toggleShowUpdate(false);
		toggleShowMap(false);
		toggleShowRename(!showRename);
		setCurrentMapId(_id);
		setCurrentMapName(name);
	}

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
				maps={maps} createNewMap={createNewMap} setShowDelete={setShowDelete}  setShowMap={setShowMap} setShowRename={setShowRename}
			/></WLMain>

			{
				showDelete && (<Delete deleteMap={deleteMap} setShowDelete={setShowDelete} currentMapId={currentMapId}/>)
			}

			{
				showCreate && (<CreateAccount fetchUser={props.fetchUser} setShowCreate={setShowCreate} />)
			}

			{
				showLogin && (<Login fetchUser={props.fetchUser} refetchMaps={refetch} setShowLogin={setShowLogin}/>)
			}
			{
				showMap && (<CreateMap createNewMap={createNewMap} setShowMap={setShowMap}/>)
			}
			{
				showRename && (<Rename renameMap={renameMap} setShowRename={setShowRename} currentMapId={currentMapId} currentMapName={currentMapName}/>)
			}
			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} />)
			}

		</WLayout>
	);
};

export default MapScreen;
