import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import UpdateAccount 					from '../modals/Update';
import DeleteLandmarkInRegion			from '../modals/DeleteLandmark';
import { GET_DB_MAPS, GET_DB_REGION, GET_DB_REGIONS_BY_PARENT } 				from '../../cache/queries';
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
	let refetchRegion = useQuery(GET_DB_REGION, {variables: {_id: _id} })['refetch'];
	let refetchRegions = useQuery(GET_DB_REGIONS_BY_PARENT, { variables: {parentId: _id} })['refetch'];


	const region 										= (newRegion ? newRegion : null);
	const currentRegionId 								= _id;
	const currentMapId 									= (region && region.map ? region.map : _id);
	const currentRegionName 							= (region && region.name ? region.name : '');
    const currentParentRegionName                       = (newRegionParent && newRegionParent.name ? newRegionParent.name : '');
    const currentRegionCapital                          = (region && region.capital ? region.capital : 'N/A');
    const currentRegionLeader                           = (region && region.leader ? region.leader : 'N/A');
    const currentRegionRegions							= (region && region.regions ? region.regions : []);
	const [currentLandmark, setCurrentLandmark]			= useState('');
    const [showUpdate, toggleShowUpdate]    			= useState(false);
	const [showDeleteLandmark, toggleShowDeleteLandmark] = useState(false);
	const [canUndo, toggleCanUndo]						= useState(props.tps.hasTransactionToUndo() ? true : false);
	const [canRedo, toggleCanRedo]						= useState(props.tps.hasTransactionToRedo() ? true : false);
	const [AddLandmark] 								= useMutation(mutations.ADD_LANDMARK);
	const [DeleteLandmark] 								= useMutation(mutations.DELETE_LANDMARK);

	const [landmarkInput, updateLandmarkInput]			= useState('');

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
		if (!newLandmark || newLandmark === '') return;
		let transaction = new UpdateListLandmarks_Transaction(newLandmark, regionId, 1, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
		updateLandmarkInput('');
	}

	const deleteLandmark = async (landmark, regionId) => {
		let transaction = new UpdateListLandmarks_Transaction(landmark, regionId, 0, AddLandmark, DeleteLandmark);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/

	const setShowUpdate = async () => {
		toggleShowDeleteLandmark(false);
		toggleShowUpdate(!showUpdate);
	};

	const setShowDeleteLandmark = async (landmark) => {
		toggleShowUpdate(false);
		toggleShowDeleteLandmark(!showDeleteLandmark);
		setCurrentLandmark(landmark);
	};

	return (
		<WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' tpsReset={tpsReset}/>
						</WNavItem>
					</ul>
					<ul>
						<WButton className="map-entry-buttons" onClick={() => {}} wType="texted">
							<i className="region-navigation-arrows material-icons" style={{opacity : true ? '1' : '1'}}>arrow_back</i>
						</WButton>
						<WButton className="map-entry-buttons" onClick={() => {}} wType="texted">
							<i className="region-navigation-arrows material-icons" style={{opacity : true ? '1' : '1'}}>arrow_forward</i>
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
                            <WCol size='4'>Region Name: {currentRegionName}</WCol>
                        </WRow>
                        <WRow>
                            <WCol size='4' onClick={() => {history.push("/map/" + region.parent, { _id: region.parent })}}
                                >Parent Region: <span className='name-of-region-parent'>{currentParentRegionName}</span></WCol>
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
                                    <i className="material-icons add-button">add</i>
								</WButton>
							</WCol>
							<wCol size='6'>
								<input
                        			className='landmark-input table-input'
                       			 	autoFocus={true} type='text'
                        			wType="outlined" barAnimation="solid" inputClass="table-input-class"
									onChange={(e) => {updateLandmarkInput(e.target.value);}}
                   			 	/>
							</wCol>
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

		</WLayout>
	);
};

export default RegionViewer;
