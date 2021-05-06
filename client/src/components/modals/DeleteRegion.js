import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteRegionInList = (props) => {
    let _id = props.currentRegionId;
    let region = props.region;
    let index = props.index;

    const handleDeleteRegion = async () => {
        props.deleteRegion(_id, region, index);
        props.setShowDeleteRegion(_id, region, index);
    }

    return (
        <WModal visible={true} className="delete-modal">
            <WMHeader className="modal-header" onClose={() => props.setShowDeleteRegion(_id, region, index)}>
                Delete Region?
			</WMHeader>

            <WMMain className="delete-modal-main">
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDeleteRegion(_id, region, index)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDeleteRegion} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal>
    );
}

export default DeleteRegionInList;