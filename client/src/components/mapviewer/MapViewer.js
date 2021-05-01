import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import UpdateAccount 					from '../modals/Update';
import { GET_DB_MAPS } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WButton, WRow, WCol, WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, } from 'wt-frontend';
import { useHistory, useParams } from 'react-router-dom';
import TableContents from './TableContents';


const MapViewer = (props) => {

	let {_id} = useParams();
	let map = null;

	const auth = props.user === null ? false : true;

	let history = useHistory();
	if (!auth) {
		history.push("/welcome");
	}

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);
	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }
	if(data) { 
		let maps = data.getAllMaps;
		maps.forEach(m => {
			if (m._id === _id) map = m;
		});
	}

	const [currentMapId, setCurrentMapId]   			= useState(_id);
	const [currentMapName, setCurrentMapName] 			= useState(map === null ? '' : map.name);
    const [currentMapRegions, setCurrentMapRegions] 	= useState(map === null ? [] : map.regions);
	const [currentRegionId, setCurrentRegionId] 		= useState('');
	const [showDeleteRegion, toggleShowDeleteRegion] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    			= useState(false);

	const [AddRegion] 					= useMutation(mutations.ADD_REGION);
	const [DeleteRegion] 				= useMutation(mutations.DELETE_REGION);
	const [UpdateRegionField]				= useMutation(mutations.UPDATE_REGION_FIELD);

	const addNewRegion = async () => {
		let region = {
			name: "N/A",
			capital: "N/A",
			leader: "N/A",
			flag: "N/A",
			landmarks: [],
			regions: [],
			parent: currentMapId,
			map: currentMapId,
			ancestry: [currentMapId]
		}
		const { data } = await AddRegion({ variables: { region: region } });
		if (data) return data["addRegion"];
		else return "Unable to add region.";
	};

	const deleteRegion = async (_id) => {
		DeleteRegion({ variables: { _id: _id, parent: currentMapId} });
		refetch();
	};

	/**
	const updateRegionField = async (name, _id) => {
		let map = {
			name: name,
			owner: props.user._id
		}
		const { data } = await RenameMap({ variables: { map: map, _id : _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
		if (data) return data["renameMap"];
		else return "Unable to rename map.";
	};
	*/
	
	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/

	const setShowDeleteRegion = async (_id) => {
		toggleShowUpdate(false);
		toggleShowDeleteRegion(!showDeleteRegion);
		setCurrentRegionId(_id);
	};

	const setShowUpdate = () => {
		toggleShowDeleteRegion(false);
		toggleShowUpdate(!showUpdate);
	};

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo'/>
						</WNavItem>
					</ul>
					<ul>
						<NavbarOptions
                            fetchUser={props.fetchUser} auth={auth} 
                            refetchMaps={refetch}
                            setShowUpdate={setShowUpdate} userName={props.user === null ? '' : props.user.name}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<WLMain>
				<WRow>
					<WCol size='3'>
						<WButton className="map-entry-buttons" onClick={() => {addNewRegion();}} wType="texted">
							<i className="material-icons">add</i>
						</WButton>
						<WButton className="map-entry-buttons" onClick={() => {}} wType="texted">
							<i className="material-icons">undo</i>
						</WButton>
						<WButton className="map-entry-buttons" onClick={() => {}} wType="texted">
							<i className="material-icons">redo</i>
						</WButton>
					</WCol>
					<WCol className="map-name" size='6'>
						Region Name: {currentMapName}
					</WCol>
				</WRow>
				<br></br>
				<TableContents map={map}
                deleteRegion={deleteRegion}
                //updateRegionField={updateRegionField}
				></TableContents>
			</WLMain>

			{
				showDeleteRegion && (<DeleteRegion deleteRegion={deleteRegion} setShowDeleteRegion={setShowDeleteRegion}
					currentMapId={currentMapId} currentRegionId={currentRegionId}/>)
			}
			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} />)
			}

		</WLayout>
	);
};

export default MapViewer;
