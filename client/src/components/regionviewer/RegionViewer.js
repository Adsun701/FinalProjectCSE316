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


const RegionViewer = (props) => {

	let {_id} = useParams();

	// this can either be a map or a region.
	let newParent = null;

	const auth = props.user === null ? false : true;

	let history = useHistory();
	if (!auth) {
		history.push("/welcome");
	}

	// check regions.
	let {data, refetch} = useQuery(GET_DB_REGION, { variables: {_id: _id} });
	if (data) {
		newParent = data.getRegionById;
	}

	const parent 										= (newParent ? newParent : null);
	const currentParentId 								= _id;
	const currentMapId 									= (parent && parent.map ? parent.map : _id);
	const currentParentName 							= (parent === null ? '' : parent.name);
    const currentParentRegions							= (parent === null ? [] : parent.regions);
	const [currentRegionId, setCurrentRegionId] 		= useState('');
	const [showDeleteRegion, toggleShowDeleteRegion] 	= useState(false);
    const [showUpdate, toggleShowUpdate]    			= useState(false);

	const [AddRegion] 					= useMutation(mutations.ADD_REGION);
	const [DeleteRegion] 				= useMutation(mutations.DELETE_REGION);


	/**
	const editRegion = async (regionID, field, value, prev) => {
		let mapID = currentParentId.;
		let transaction = new EditRegion_Transaction(mapID, regionID, field, prev, value, UpdateRegionField);
		props.tps.addTransaction(transaction);
		tpsRedo();

	};
	*/


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
				
			</WLMain>
			{
				showUpdate && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} />)
			}

		</WLayout>
	);
};

export default RegionViewer;
