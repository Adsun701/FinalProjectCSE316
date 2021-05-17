import React from 'react';
import { useHistory } from 'react-router-dom';

const Logo = (props) => {
    let history = useHistory();
    return (
        <div className='logo' onClick={() => {
                props.tpsReset();
                if (props.refetchOldParentRegions) props.refetchOldParentRegions();
                history.push('/welcome');
            }}>
            The World<br></br>Data Mapper
        </div>
    );
};

export default Logo;