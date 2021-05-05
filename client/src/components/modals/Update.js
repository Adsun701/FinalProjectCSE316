import React, { useState } 	from 'react';
import { UPDATE }			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WButton, WInput, WRow, WCol } from 'wt-frontend';

const UpdateAccount = (props) => {
	const [input, setInput] = useState({email: '', password: '', name: ''});
	const [loading, toggleLoading] = useState(false);
	const [Update] = useMutation(UPDATE);

	
	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	};

	const handleUpdateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
				alert('All fields must be filled out to update the account.');
				return;
			}
			else if (field === 'email') input[field] = input[field].toLowerCase();
		}
		let userId = props.userId;
		const { loading, error, data } = await Update({ variables: {_id: userId, ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { return `Error: ${error.message}` };
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.update.email === 'already exists') {
				alert('User with that email already exists');
			}
			else {
				props.fetchUser();
			}
			props.setShowUpdate(false);

		};
	};

	return (
		<WModal className="signup-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowUpdate(false)}>
				Enter Updated Account Information
			</WMHeader>

			{
				loading ? <WMMain />
					: <WMMain className="modal-main">
						<WRow className="modal-col-gap signup-modal">
							<WCol size="6">
								<WInput 
									className="" onBlur={updateInput} name="name" labelAnimation="up" 
									barAnimation="solid" labelText="Name" wType="outlined" inputType="text" 
								/>
							</WCol>
						</WRow>

						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="email" labelAnimation="up" 
							barAnimation="solid" labelText="Email Address" wType="outlined" inputType="text" 
						/>
						<div className="modal-spacer">&nbsp;</div>
						<WInput 
							className="modal-input" onBlur={updateInput} name="password" labelAnimation="up" 
							barAnimation="solid" labelText="Password" wType="outlined" inputType="password" 
						/>
					</WMMain>
			}
			<WRow>
				<WCol size="6">
					<WButton className="modal-button" onClick={handleUpdateAccount} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
						Update
					</WButton>
				</WCol>
				<WCol size="6">
					<WButton className="modal-button" onClick={() => props.setShowUpdate(false)} clickAnimation="ripple-light" hoveranimation="darken" shape="rounded">
						Cancel
					</WButton>
				</WCol>
			</WRow>
		</WModal>
	);
}

export default UpdateAccount;
