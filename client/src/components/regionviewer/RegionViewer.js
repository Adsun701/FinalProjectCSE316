import React, { useState } 	from 'react';
import Logo 							from '../navbar/Logo';
import NavbarOptions 					from '../navbar/NavbarOptions';
import UpdateAccount 					from '../modals/Update';
import { GET_DB_MAPS, GET_DB_REGION, GET_DB_REGIONS_BY_PARENT } 				from '../../cache/queries';
import { useQuery } 		from '@apollo/client';
import { WButton, WRow, WCol, WNavbar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import { useHistory, useParams } from 'react-router-dom';


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

	let refetchRegions = useQuery(GET_DB_REGIONS_BY_PARENT, { variables: {parentId: _id} })['refetch'];


	const region 										= (newRegion ? newRegion : null);
	const currentRegionId 								= _id;
	const currentMapId 									= (region && region.map ? region.map : _id);
	const currentRegionName 							= (region && region.name ? region.name : '');
    const currentParentRegionName                       = (newRegionParent && newRegionParent.name ? newRegionParent.name : '');
    const currentRegionCapital                          = (region && region.capital ? region.capital : 'N/A');
    const currentRegionLeader                           = (region && region.leader ? region.leader : 'N/A');
    const currentRegionRegions							= (region && region.regions ? region.regions : []);
    const [showUpdate, toggleShowUpdate]    			= useState(false);
	const [canUndo, toggleCanUndo]						= useState(props.tps.hasTransactionToUndo() ? true : false);
	const [canRedo, toggleCanRedo]						= useState(props.tps.hasTransactionToRedo() ? true : false);

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
		refetchRegions();
		if (props.tps.hasTransactionToRedo()) toggleCanRedo(true);
		else toggleCanRedo(false);
		if (props.tps.hasTransactionToUndo()) toggleCanUndo(true);
		else toggleCanUndo(false);
		return retVal;
	}

	const tpsRedo = async () => {
		const retVal = await props.tps.doTransaction();
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


	/*
		Since we only have 3 modals, this sort of hardcoding isnt an issue, if there
		were more it would probably make sense to make a general modal component, and
		a modal manager that handles which to show.
	*/

	const setShowUpdate = () => {
		toggleShowUpdate(!showUpdate);
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
                    </WCol>
                </WRow>
			</WLMain>
			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} userId={props.user._id}/>)
			}

		</WLayout>
	);
};

export default RegionViewer;
