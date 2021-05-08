import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteLandmarkInRegion = (props) => {
    let _id = props.currentRegionId;
    let landmark = props.landmark;

    const handleDeleteLandmark = async () => {
        props.deleteLandmark(landmark, _id);
        props.setShowDeleteLandmark(landmark, _id);
    }

    return (
        <WModal visible={true} className="delete-modal">
            <WMHeader className="modal-header" onClose={() => props.setShowDeleteLandmark(landmark, _id)}>
                Delete Landmark?
			</WMHeader>

            <WMMain className="delete-modal-main">
                <WButton className="modal-button cancel-button" onClick={() => props.setShowDeleteLandmark(landmark, _id)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDeleteLandmark} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal>
    );
}

export default DeleteLandmarkInRegion;