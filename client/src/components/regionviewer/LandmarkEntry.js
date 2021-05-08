import { WButton, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {

    const landmark = props.landmark ? props.landmark : '';
    const regionId = props.regionId ? props.regionId : '';

    const handleDelete = (landmark, regionId) => {
        props.setShowDeleteLandmark(landmark, regionId);
    }

    return (
        <WRow className='table-entry'>
            <WCol size="1">
                <WButton className="map-entry-buttons" onClick={() => {handleDelete(landmark, regionId);}} wType="texted">
                    <i className="material-icons">close</i>
                </WButton>
            </WCol>
            <WCol size="4">
                {
                    <div className="table-text"
                        >{landmark}
                    </div>
                }
            </WCol>
        </WRow>
    );
};

export default LandmarkEntry;
