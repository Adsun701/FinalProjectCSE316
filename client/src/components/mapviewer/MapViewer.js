import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import UpdateAccount 					from '../modals/Update';
import { GET_DB_MAPS, GET_DB_REGION } 				from '../../cache/queries';
import * as mutations 					from '../../cache/mutations';
import { useMutation, useQuery } 		from '@apollo/client';
import { WButton, WRow, WCol, WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, } from 'wt-frontend';
import { useHistory, useParams } from 'react-router-dom';
import TableContents from './TableContents';
import TableHeader from './TableHeader';
import { 
	UpdateListRegions_Transaction, 
	EditRegion_Transaction,
	SortRegions_Transaction,
	jsTPS
} 				from '../../utils/jsTPS';


const MapViewer = (props) => {

	let {_id} = useParams();

	// this can either be a map or a region.
	let newParent = null;

	const auth = props.user === null ? false : true;

	let history = useHistory();
	if (!auth) {
		history.push("/welcome");
	}

	// check maps.
    let {data, refetch} = useQuery(GET_DB_MAPS);
	if(data) { 
		let maps = data.getAllMaps;
		maps.forEach(m => {
			if (m._id === _id) {
				newParent = m;
			}
		});
	}

	let refetchMaps = refetch

	// check regions.
	data = useQuery(GET_DB_REGION, { variables: {_id: _id} })['data'];
	if (data) {
		if (newParent === null ) newParent = data.getRegionById;
	}

	let refetchRegions = useQuery(GET_DB_REGION, { variables: {_id: _id} })['refetch'];

	const parent 										= (newParent ? newParent : null);
	const currentParentId 								= _id;
	const currentMapId 									= (parent && parent.map ? parent.map : _id);
	const currentParentName 							= (parent === null ? '' : parent.name);
    const currentParentRegions							= (parent === null ? [] : parent.regions);
	const [currentRegionId, setCurrentRegionId] 		= useState('');
	const [showDeleteRegion, toggleShowDeleteRegion] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    			= useState(false);
	const [canUndo, toggleCanUndo]						= useState(false);
	const [canRedo, toggleCanRedo]						= useState(false);

	const [AddRegion] 					= useMutation(mutations.ADD_REGION);
	const [DeleteRegion] 				= useMutation(mutations.DELETE_REGION);
	const [UpdateRegionField]				= useMutation(mutations.UPDATE_REGION_FIELD);

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchMaps();
		refetchRegions();
		if (props.tps.hasTransactionToRedo()) toggleCanRedo(true);
		else toggleCanRedo(false);
		if (props.tps.hasTransactionToUndo()) toggleCanUndo(true);
		else toggleCanUndo(false);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchMaps();
		refetchRegions();
		if (props.tps.hasTransactionToRedo()) toggleCanRedo(true);
		else toggleCanRedo(false);
		if (props.tps.hasTransactionToUndo()) toggleCanUndo(true);
		else toggleCanUndo(false);
		return retVal;
	}

	const tpsReset = async () => {
		const retVal = await props.tps.reset();
		return retVal;
	}

	const addNewRegion = async () => {
		let region = {
			name: "N/A",
			capital: "N/A",
			leader: "N/A",
			flag: "N/A",
			landmarks: [],
			regions: [],
			parent: currentParentId,
			map: currentMapId,
			ancestry: (!parent.map ? [currentParentId] : [...parent.ancestry, currentParentId] )
		}
		const { data } = await AddRegion({ variables: { region: region } });
		refetchMaps();
		refetchRegions();
		if (data) return data["addRegion"];
		else return "Unable to add region.";
	};

	const deleteRegion = async (_id) => {
		DeleteRegion({ variables: { _id: _id, map: currentMapId} });
		refetchMaps();
		refetchRegions();
	};

	
	const editRegion = async (regionID, field, value, prev) => {
		let transaction = new EditRegion_Transaction(regionID, field, prev, value, UpdateRegionField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};

	// Go to region viewer with selected region id.
	const regionViewer = async (regionID) => {
		history.push("/view/" + regionID, { _id: regionID });
	}

	// go to another region.
	const goToRegion = async (regionID) => {
		history.push("/map/" + regionID, { _id: regionID });
	}
	
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
                            refetchMaps={refetchMaps}
                            setShowUpdate={setShowUpdate} userName={props.user === null ? '' : props.user.name}
						/>
					</ul>
				</WNavbar>
			</WLHeader>
			<WLMain>
				<WRow>
					<WCol size='3'>
						<WButton className="map-entry-buttons" onClick={() => {addNewRegion();}} wType="texted">
							<i className="material-icons add-button">add</i>
						</WButton>
						<WButton className="map-entry-buttons" onClick={() => {if (canUndo) tpsUndo();}} wType="texted">
							<i className="material-icons" style={{opacity : canUndo ? '1' : '0.5'}}>undo</i>
						</WButton>
						<WButton className="map-entry-buttons" onClick={() => {if (canRedo) tpsRedo();}} wType="texted">
							<i className="material-icons" style={{opacity : canRedo ? '1' : '0.5'}}>redo</i>
						</WButton>
					</WCol>
					<WCol className="map-name" size='6'>
						Region Name: {currentParentName}
					</WCol>
				</WRow>
				<br></br>
				<div className='table'>
					<TableHeader
						addNewRegion={addNewRegion}
						setShowDeleteRegion={setShowDeleteRegion}
					></TableHeader>
					<TableContents parent={parent}
						deleteRegion={deleteRegion}
						editRegion={editRegion}
						regionViewer={regionViewer}
						goToRegion={goToRegion}
					></TableContents>
				</div>
			</WLMain>

			{
				showDeleteRegion && (<DeleteRegion deleteRegion={deleteRegion} setShowDeleteRegion={setShowDeleteRegion}
					currentParentId={currentParentId} currentRegionId={currentRegionId}/>)
			}
			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} userId={props.user._id}/>)
			}

		</WLayout>
	);
};

export default MapViewer;
