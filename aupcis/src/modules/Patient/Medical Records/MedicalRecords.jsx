export default function MedicalRecords() {
    return(
        <div className="MedicalRec1">
            <div className="MedicalRec2">
                <div className="MedRecTitle">
                    <h2 id="MedRecTitles">Request for Release of Information</h2>
                </div>
                <div>
                    <ul className="MedRecRequest">
                        <li>
                            Name: <input type="text" id="MedRecInput1" />
                        </li>
                        <li>Date of Admission/Consultation: <input type="text" id="MedRecInput1" /></li>
                        <li>Date of Discharge: <input type="text" id="MedRecInput1" /></li>
                        <li>Attending Physician: <input type="text" id="MedRecInput1" /></li>
                        <li>Purpose of Request: <input type="text" id="MedRecInput1" /></li>
                    </ul>
                </div>
                <div>
                    <h2 id="MedRecTitles">Type of Request (Please Check)</h2>
                </div>
                <div>
                    <ul className="MedRecCheck">
                        <li><input type="checkbox" name="" id="" />  Medical Certificate</li>
                        <li><input type="checkbox" name="" id="" />  Birth Certificate</li>
                        <li><input type="checkbox" name="" id="" />  Death Certificate</li>
                        <li><input type="checkbox" name="" id="" />  Discharge Summary</li>
                        <li><input type="checkbox" name="" id="" />  Clinical Summary</li>
                        <li><input type="checkbox" name="" id="" />  Laboratory Results/X-Ray</li>
                        <li><input type="checkbox" name="" id="" />  Insurance Form</li>
                        <li><input type="checkbox" name="" id="" />  Vaccination Certificate</li>
                    </ul>
                </div>
                <div>
                    <ul className="MedRecInput2">
                        <li>O.RIC.R. No.: <input type="text" name="" id="MedRecInput1" /></li>
                        <li>Date: <input type="text" name="" id="MedRecInput1" /></li>
                    </ul>
                </div>
                <div className="MedRecBTN"><button id="MedRecReqBTN">Request</button></div>
            </div>
        </div>
    )
}