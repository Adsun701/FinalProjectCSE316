import React, { useState } 	from 'react';

import { WModal, WMHeader, WMMain, WButton, WInput, WRow, WCol } from 'wt-frontend';

const RenameMap = (props) => {
	const [input, setInput] = useState({ name: ''});
	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleRenameMap = async () => {
        if (!input["name"]) {
            alert("Name must be entered to rename map."); return;
        }
		props.renameMap(input["name"], props.currentMapId);
        props.setShowRename(props.currentMapId, props.currentMapName);
	};

	return (
		<WModal className="signup-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowRename(props.currentMapId, props.currentMapName)}>
				Rename A Map
			</WMHeader>
		    <WMMain className="modal-main">
                <WRow className="modal-col-gap signup-modal">
                    <WCol size="6">
                        <WInput 
                            className="" onBlur={updateInput} name="name" labelAnimation="up" 
                            barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
                        />
                    </WCol>
                </WRow>
            </WMMain>
			<WRow>
				<WCol size="6">
					<WButton className="modal-button" onClick={() => {handleRenameMap();}} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
						Rename Map
					</WButton>
				</WCol>
				<WCol size="6">
					<WButton className="modal-button" onClick={() => props.setShowRename(props.currentMapId, props.currentMapName)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
						Cancel
					</WButton>
				</WCol>
			</WRow>
		</WModal>
	);
}

export default RenameMap;
