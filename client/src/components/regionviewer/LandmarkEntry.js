import { WButton, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {

    const landmark = props.landmark ? props.landmark : '';

    const handleDelete = (landmark) => {
        props.setShowDeleteLandmark(landmark);
    }

    return (
        <WRow className='table-entry'>
            <WCol size="1">
                <WButton className="map-entry-buttons" onClick={() => {handleDelete(landmark);}} wType="texted">
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
