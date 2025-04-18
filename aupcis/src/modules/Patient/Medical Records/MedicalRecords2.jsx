export default function MedicalRecords2() {
    return(
        <div className="MedicalRecords2-container">
        <div className="MedicalRecords2-cup">
            <h1 id="MedicalRecordTitle">Patient's Record Form</h1>
        </div>
        <div>
            <ul className="FirstForm">
                <li className="FirstFormID">
                    <input type="checkbox" name="" id="" /> Out-Patient
                    <input type="checkbox" name="" id="" /> Emergency
                </li>
                <li className="FirstFormID">
                    <input type="checkbox" name="" id="" /> Out-Patient
                    <input type="checkbox" name="" id="" /> Faculty/Staff
                    <input type="checkbox" name="" id="" /> Dependent
                    <input type="checkbox" name="" id="" /> Walk-In
                </li>
                <li className="FirstFormID">
                    <input type="checkbox" name="" id="" /> Pediatrics
                    <input type="checkbox" name="" id="" /> Medicine
                    <input type="checkbox" name="" id="" /> Surgery
                    <input type="checkbox" name="" id="" /> OB
                    <input type="checkbox" name="" id="" /> Gyne
                    <input type="checkbox" name="" id="" /> ENT
                    <input type="checkbox" name="" id="" /> Ortho
                    <input type="checkbox" name="" id="" /> Others
                </li>
                <div className="FirstFormID">
                    <li id="FirstFormOther">
                        Name: <input type="text" name="" id="" /> <input type="text" name="" id="" /> <input type="text" name="" id="" />
                        Patient ID: <input type="text" name="" id="" />
                    </li>
                </div>
            </ul>
        </div>
        <div>
            <h1 id="MedicalRecordTitle">Type of Request (Please check)</h1>
            <li className="SecondForm1">
                Purpose of Request: <input type="text" name="" id="" />
                Attending Physician: <input type="text" name="" id="" />
                Date of Discharge: <input type="text" name="" id="" />
            </li>
        </div>
        <div>
            <ul className="SecondForm2">
                <li><input type="checkbox" name="" id="" /> Clinical Summary</li>
                <li><input type="checkbox" name="" id="" /> Laboratory Results/X-ray</li>
                <li><input type="checkbox" name="" id="" /> Insurance Form</li>
                <li><input type="checkbox" name="" id="" /> Vaccination Certificate</li>
            </ul>
        </div>
        <div className="SecondForm3">
            <li>O.RIC.R. No.: <input type="text" name="" id="" /></li>
            <li>Date: <input type="text" name="" id="" /></li>
        </div>
        <div className="MedicalRecords2BTN">
            <button>Request</button>
        </div>
        </div>
    )
}