import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import UpdateAccount 					from '../modals/Update';
import DeleteLandmarkInRegion			from '../modals/DeleteLandmark';
import NewParent 						from '../modals/NewParent';
import { GET_DB_MAPS, GET_DB_REGION, GET_DB_REGIONS_BY_PARENT, GET_DB_NAMES_FROM_ANCESTRY, GET_DB_LANDMARKS_OF_SUBREGIONS } 				from '../../cache/queries';
import { useQuery, useMutation } 		from '@apollo/client';
import * as mutations 								from '../../cache/mutations';
import { WButton, WRow, WCol, WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { useHistory, useParams } from 'react-router-dom';
import LandmarkContents from './LandmarkContents';
import { 
	UpdateListLandmarks_Transaction
} 													from '../../utils/jsTPS';


const RegionViewer = (props) => {

	let inputRef = React.createRef();

	let {_id} = useParams();

	// this is always a region.
	let newRegion = null;

    // this is either a region or a map.
    let newRegionParent = null;

	const auth = props.user === null ? false : true;

	let history = useHistory();
	if (!auth) {
		history.push("/welcome");
	}

	// check regions.
	let {data, refetch} = useQuery(GET_DB_REGION, { variables: {_id: _id} });
	if (data) {
		newRegion = data.getRegionById;
	}

    // get parent name, first from regions, then maps if not successful.
    data = useQuery(GET_DB_REGION, { variables: {_id: newRegion ? newRegion.parent : _id} })['data'];
    if (data) {
        newRegionParent = data.getRegionById;
    }
    data = useQuery(GET_DB_MAPS)['data'];
    if(data) { 
		let maps = data.getAllMaps;
		maps.forEach(m => {
			if (newRegion && m._id === newRegion.parent) {
				newRegionParent = m;
			}
		});
	}
	let refetchMaps = useQuery(GET_DB_MAPS)['refetch'];
	let refetchRegion = useQuery(GET_DB_REGION, {variables: {_id: _id} })['refetch'];
	let refetchRegions = useQuery(GET_DB_REGIONS_BY_PARENT, { variables: {parentId: _id} })['refetch'];

	// get coregions, so that moving from 1 region to a sibling region is possible.
	data = useQuery(GET_DB_REGIONS_BY_PARENT, { variables: {parentId: newRegionParent ? newRegionParent._id : ''} })['data'];
	let newRegions = null;
	if (data) newRegions = data.getRegionsByParent;

	let newAncestry = null;
	data = useQuery(GET_DB_NAMES_FROM_ANCESTRY, {variables: {ancestry : newRegion ? newRegion.ancestry : []} })['data'];
	if (data) {
		newAncestry = data.getNamesFromAncestry;
	}

	// refetch landmarks function
	let refetchLandmarks = useQuery(GET_DB_LANDMARKS_OF_SUBREGIONS, { variables: {_ids: newRegionParent ? newRegionParent.regions : []} })['refetch'];

	const region 										= (newRegion ? newRegion : null);
	const regions 										= (newRegions ? newRegions : []);
	const regionsLength 								= (newRegions ? newRegions.length : -1);
	const index											= regions.findIndex((r) => r && r._id === _id);
	const currentRegionId 								= _id;
	const currentMapId 									= (region && region.map ? region.map : _id);
	const currentRegionName 							= (region && region.name ? region.name : '');
    const currentParentRegionName                       = (newRegionParent && newRegionParent.name ? newRegionParent.name : '');
	const currentParentRegionId							= (newRegionParent && newRegionParent._id ? newRegionParent._id : '')
    const currentRegionCapital                          = (region && region.capital ? region.capital : 'N/A');
    const currentRegionLeader                           = (region && region.leader ? region.leader : 'N/A');
    const currentRegionRegions							= (region && region.regions ? region.regions : []);
	const ancestry										= (newAncestry ? newAncestry : []);
	const [currentLandmark, setCurrentLandmark]			= useState('');
    const [showUpdate, toggleShowUpdate]    			= useState(false);
	const [showDeleteLandmark, toggleShowDeleteLandmark] = useState(false);
	const [showNewParent, toggleShowNewParent]			= useState(false);
	const [canUndo, toggleCanUndo]						= useState(props.tps.hasTransactionToUndo() ? true : false);
	const [canRedo, toggleCanRedo]						= useState(props.tps.hasTransactionToRedo() ? true : false);
	const [oldParent, setOldParent] 					= useState('');
	const [AddLandmark] 								= useMutation(mutations.ADD_LANDMARK);
	const [DeleteLandmark] 								= useMutation(mutations.DELETE_LANDMARK);

	const [landmarkInput, updateLandmarkInput]			= useState('');

	// refetch regions of old parent, so refresh will no longer include moved region.
	let refetchOldParentRegions = useQuery(GET_DB_REGIONS_BY_PARENT, { variables: {parentId: oldParent} })['refetch'];

	/**
	const editRegion = async (regionID, field, value, prev) => {
		let mapID = currentregionId.;
		let transaction = new EditRegion_Transaction(mapID, regionID, field, prev, value, UpdateRegionField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};
	*/

	const tpsUndo = async () => {
		const retVal = await props.tps.undoTransaction();
		refetchRegion();
		refetchRegions();
		if (props.tps.hasTransactionToRedo()) toggleCanRedo(true);
		else toggleCanRedo(false);
		if (props.tps.hasTransactionToUndo()) toggleCanUndo(true);
		else toggleCanUndo(false);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
		refetchRegion();
		refetchRegions();
		if (props.tps.hasTransactionToRedo()) toggleCanRedo(true);
		else toggleCanRedo(false);
		if (props.tps.hasTransactionToUndo()) toggleCanUndo(true);
		else toggleCanUndo(false);
		return retVal;
	}

	const tpsReset = async () => {
		const retVal = await props.tps.reset();
		toggleCanUndo(false);
		toggleCanRedo(false);
		return retVal;
	}

	// landmark functions

	const addLandmark = async (newLandmark, regionId) => {
		if (region.landmarks.includes(newLandmark)) return;
		if (!newLandmark || newLandmark === '') return;
		let transaction = new UpdateListLandmarks_Transaction(newLandmark, regionId, 1, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
		updateLandmarkInput('');
		inputRef.current.value = '';
		refetchLandmarks();
	}

	const deleteLandmark = async (landmark, regionId) => {
		let transaction = new UpdateListLandmarks_Transaction(landmark, regionId, 0, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
		refetchLandmarks();
	}

	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/

	const setShowUpdate = async () => {
		toggleShowDeleteLandmark(false);
		toggleShowNewParent(false);
		toggleShowUpdate(!showUpdate);
	};

	const setShowDeleteLandmark = async (landmark) => {
		toggleShowUpdate(false);
		toggleShowNewParent(false);
		toggleShowDeleteLandmark(!showDeleteLandmark);
		setCurrentLandmark(landmark);
	};

	const setShowNewParent = async () => {
		toggleShowUpdate(false);
		toggleShowDeleteLandmark(false);
		toggleShowNewParent(!showNewParent);
	};

	const navigateToRegion = async(index, length) => {
		let regionId = null;
		if (index < 0 || index >= length) return;
		else {
			regionId = regions[index]._id;
			refetchOldParentRegions();
			history.push("/view/" + regionId, { _id: regionId });
		}
	}

	// go to another region.
	const goToRegion = async (regionID) => {
		refetchOldParentRegions();
		history.push("/map/" + regionID, { _id: regionID });
	}

	const ancestryFormat = (arr) => {
        let s = "";
        for (let i = 0; i < arr.length; i++) {
            s += arr[i] + '/';
        }
        return s;
    }
    let flagPath = ancestryFormat(ancestry) + currentRegionName + " Flag.png";

	let img = null;
    try {
        img = require('../flags/' + flagPath).default;
    }
    catch (err) {
        img = "No Image";
    }

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' tpsReset={tpsReset} refetchOldParentRegions={refetchOldParentRegions}/>
						</WNavItem>
					</ul>
					<ul>
						{
							ancestry && ancestry.map((name, index) => <WNavItem
								onClick={() => {goToRegion(region.ancestry[index]);}}
							>{name}{(index < ancestry.length - 1) ? <i className="material-icons">arrow_forward_ios</i> : <i/>}</WNavItem>)
						}
					</ul>
					<ul>
						<WButton className="map-entry-buttons" onClick={() => {navigateToRegion(index - 1, regionsLength);}} wType="texted">
							<i className="region-navigation-arrows material-icons" style={{opacity : index > 0 ? '1' : '0.5'}}>arrow_back</i>
						</WButton>
						<WButton className="map-entry-buttons" onClick={() => {navigateToRegion(index + 1, regionsLength)}} wType="texted">
							<i className="region-navigation-arrows material-icons" style={{opacity : index < regionsLength - 1 ? '1' : '0.5'}}>arrow_forward</i>
						</WButton>
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
            <WLSide>
                
            </WLSide>
			<WLMain>
                <WRow>
                    <WCol size='6' className='region-description'>
                        <WRow>
                            <WCol size='2'>
                                <WButton className="map-entry-buttons" onClick={() => {if (canUndo) tpsUndo();}} wType="texted">
                                    <i className="material-icons" style={{opacity : canUndo ? '1' : '0.5'}}>undo</i>
                                </WButton>
                                <WButton className="map-entry-buttons" onClick={() => {if (canRedo) tpsRedo();}} wType="texted">
                                    <i className="material-icons" style={{opacity : canRedo ? '1' : '0.5'}}>redo</i>
                                </WButton>
                            </WCol>
                        </WRow>
						<WRow>
                            <WCol size='6'><img className="flag" src={img} alt={currentRegionName} width="400" height="200"></img></WCol>
                        </WRow>
                        <WRow>
                            <WCol size='4'>Region Name: {currentRegionName}</WCol>
                        </WRow>
                        <WRow>
                            <WCol size='4'
                                >Parent Region: <span onClick={() => {refetchOldParentRegions(); history.push("/map/" + region.parent, { _id: region.parent })}} className='name-of-region-parent'>{currentParentRegionName}</span>
								<WButton className="map-entry-buttons" onClick={() => {setShowNewParent();}} wType="texted">
									<i className="material-icons">mode_edit</i>
								</WButton>
							</WCol>
                        </WRow>
                        <WRow>
                            <WCol size='4'>Region Capital: {currentRegionCapital}</WCol>
                        </WRow>
                        <WRow>
                            <WCol size='4'>Region Leader: {currentRegionLeader}</WCol>
                        </WRow>
                        <WRow>
                            <WCol size='4'># Of Sub-Regions: {currentRegionRegions.length}</WCol>
                        </WRow>
                    </WCol>
                    <WCol size='6'>
                        <WRow>
                            <WCol size='12' className='region-landmarks-header'>
                                Region Landmarks:
                            </WCol>
                        </WRow>
						<LandmarkContents region={region} currentRegionId={currentRegionId} currentMapId={currentMapId}
							setShowDeleteLandmark={setShowDeleteLandmark}></LandmarkContents>
						<WRow className='landmark-footer'>
							<WCol size='1'>
								<WButton className="map-entry-buttons" onClick={() => {addLandmark(landmarkInput, currentRegionId);}} wType="texted">
                                    <i className="material-icons add-button" style={{opacity : landmarkInput !== '' && !region.landmarks.includes(landmarkInput) ? '1' : '0.5'}}>add</i>
								</WButton>
							</WCol>
							<WCol size='6'>
								<input ref={inputRef}
                        			className='landmark-input table-input'
                       			 	autoFocus={true} type='text'
                        			wType="outlined" barAnimation="solid" inputClass="table-input-class"
									onChange={(e) => {updateLandmarkInput(e.target.value);}}
                   			 	/>
							</WCol>
						</WRow>
                    </WCol>
                </WRow>
			</WLMain>
			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} userId={props.user._id} currentRegionId={currentRegionId}/>)
			}
			{
				showDeleteLandmark && (<DeleteLandmarkInRegion fetchUser={props.fetchUser} setShowDeleteLandmark={setShowDeleteLandmark}
					currentRegionId={currentRegionId} landmark={currentLandmark} deleteLandmark={deleteLandmark}/>)
			}
			{
				showNewParent && (<NewParent fetchUser={props.fetchUser} setShowNewParent={setShowNewParent}
					currentRegionId={currentRegionId} currentParentRegionId={currentParentRegionId}
					refetchMaps={refetchMaps} refetchParent={refetchRegion} setOldParent={setOldParent}/>)
			}

		</WLayout>
	);
};

export default RegionViewer;
