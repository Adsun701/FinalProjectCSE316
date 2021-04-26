import React, { useState } 	from 'react';
import { LOGIN } 			from '../../cache/mutations';
import { useMutation }    	from '@apollo/client';

import { WModal, WMHeader, WMMain, WMFooter, WButton, WInput, WRow, WCol } from 'wt-frontend';

const Login = (props) => {
	const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

	const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
	}

	const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (error) {
			displayErrorMsg(true);
			return;
		}
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			props.fetchUser();
			toggleLoading(false);
			props.setShowLogin(false);
		};
	};


	return (
		<WModal className="login-modal" visible={true}>
			<WMHeader className="modal-header" onClose={() => props.setShowLogin(false)}>
				Login
			</WMHeader>

			{
				loading ? <WMMain />
					: <WMMain className="main-login-modal modal-main">

						<WInput className="modal-input" onBlur={updateInput} name='email' labelAnimation="up" barAnimation="solid" labelText="Email Address" wType="outlined" inputType='text' />
						<div className="modal-spacer">&nbsp;</div>
						<WInput className="modal-input" onBlur={updateInput} name='password' labelAnimation="up" barAnimation="solid" labelText="Password" wType="outlined" inputType='password' />

						{
							showErr ? <div className='modal-error'>
								{errorMsg}
							</div>
								: <div className='modal-error'>&nbsp;</div>
						}

					</WMMain>
			}
			<WMFooter>
			<WRow>
				<WCol size="6">
					<WButton className="modal-button" onClick={handleLogin} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
						Login
					</WButton>
				</WCol>
				<WCol size="6">
					<WButton className="modal-button" onClick={() => props.setShowLogin(false)} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded">
						Cancel
					</WButton>
				</WCol>
			</WRow>
			</WMFooter>
		</WModal>
	);
}

export default Login;