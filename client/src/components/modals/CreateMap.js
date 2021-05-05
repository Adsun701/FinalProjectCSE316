import React, { useState } 	from 'react';

import { WModal, WMHeader, WMMain, WButton, WInput, WRow, WCol } from 'wt-frontend';

const CreateMap = (props) => {
	const [input, setInput] = useState({ name: ''});
	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleCreateMap = async () => {
        if (!input["name"]) {
            alert("Name must be entered to add map."); return;
        }
        console.log(input["name"]);
		props.createNewMap(input["name"]);
        props.setShowMap(false);
	};

	return (
		<WModal className="signup-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowMap(false)}>
				Create A New Map
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
					<WButton className="modal-button" onClick={() => {handleCreateMap();}} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
						Create New Map
					</WButton>
				</WCol>
				<WCol size="6">
					<WButton className="modal-button" onClick={() => props.setShowMap(false)} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
						Cancel
					</WButton>
				</WCol>
			</WRow>
		</WModal>
	);
}

export default CreateMap;
