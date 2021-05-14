import { WButton, WRow, WCol } from 'wt-frontend';

const LandmarkEntry = (props) => {

    const landmark = props.landmark ? props.landmark : '';
    const subregionLandmark = props.editable ? 'landmark-table-entry' : 'landmark-table-entry-subregion'

    const handleDelete = (landmark) => {
        props.setShowDeleteLandmark(landmark);
    }

    return (
        <WRow className={subregionLandmark + ' table-entry'}>
            <WCol size="1">
                {props.editable &&
                (<WButton className="map-entry-buttons" onClick={() => {handleDelete(landmark);}} wType="texted">
                    <i className="delete-landmark-button material-icons">close</i>
                </WButton>)}
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
