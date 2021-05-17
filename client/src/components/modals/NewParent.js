import React, { useState } 	from 'react';
import { CHANGE_PARENT }			from '../../cache/mutations';
import { useMutation, useQuery }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WButton, WInput, WRow, WCol } from 'wt-frontend';
import { GET_DB_REGIONS } from '../../cache/queries';

const NewParent = (props) => {
	const [input, setInput] = useState({newParentString: ''});
	const [loading, toggleLoading] = useState(false);
	const [ChangeParent] = useMutation(CHANGE_PARENT);
    let refetchRegions = useQuery(GET_DB_REGIONS)['refetch'];

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleChangeParent = async (e) => {
        if (!input['newParentString']) {
            alert('All fields must be filled out to cbange the parent region.');
            return;
        }
		let parentString = input['newParentString'];
        props.setOldParent(props.currentParentRegionId);
		const { loading, error, data } = await ChangeParent({ variables: {_id: props.currentRegionId, newParentString: parentString, oldParentId: props.currentParentRegionId } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.changeParent === 'Cannot find parent region or map with specified name.' || data.changeParent === 'Unable to change parent region.') {
				alert('Error: changing parent failed.');
			}
			else {
                props.refetchMaps();
                props.refetchParent();
                refetchRegions();
			}
			props.setShowNewParent(false);

		};
	};

	return (
		<WModal className="signup-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowNewParent()}>
				Change Parent
			</WMHeader>

			{
				loading ? <WMMain />
					: <WMMain className="modal-main">
						<WRow className="modal-col-gap signup-modal">
							<WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="newParentString" labelAnimation="up" 
									barAnimation="solid" labelText="New Parent" wType="outlined" inputType="text" 
								/>
							</WCol>
						</WRow>
					</WMMain>
			}
			<WRow>
				<WCol size="6">
					<WButton className="modal-button" onClick={handleChangeParent} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
						Update
					</WButton>
				</WCol>
				<WCol size="6">
					<WButton className="modal-button" onClick={() => props.setShowNewParent(false)} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
						Cancel
					</WButton>
				</WCol>
			</WRow>
		</WModal>
	);
}

export default NewParent;
