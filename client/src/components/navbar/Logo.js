import React from 'react';
import { useHistory } from 'react-router-dom';

const Logo = (props) => {
    let history = useHistory();
    return (
        <div className='logo' onClick={() => {props.tpsReset(); history.push('/welcome');}}>
            The World<br></br>Data Mapper
        </div>
    );
};

export default Logo;