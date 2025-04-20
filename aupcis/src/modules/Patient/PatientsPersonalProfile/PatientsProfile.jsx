import { Link } from "react-router-dom"

export default function PatientsProfile() {
    return(
        <div>
            <div className="PatientsStep1">
                <div className="PatientsStep2">
                    <div id="PatientsPic">
                        <i className="bi bi-person-circle"></i>
                    </div>
                    <div className="PatientsStep3">
                        <h3 id="PatientsStep3Name">Name</h3>
                        <ul className="PatientsStep4">
                            <li>Sex</li>
                            <li>Address</li>
                            <li>User Model</li>
                            <li>Date</li>
                            <li>Church Denomination</li>
                            <li>ID</li>
                        </ul>
                        <ul className="PatientsStep4VS">
                            <li>0 BMI</li>
                            <li>0 KG</li>
                            <li>0 CM</li>
                            <li>0 BP</li>
                        </ul>
                        <ul className="PatientsStep4VSs">
                            <li>BMI</li>
                            <li>Weight</li>
                            <li>Height</li>
                            <li>Blood Pressure</li>
                        </ul>
                    </div>
                    <div className="PatientsStep5">
                        <div className="PatientsStep5BTN">
                            <button id="PatientsStep5BTN">Edit</button>
                        </div>
                        <div className="PatientsStep5HB">
                            <h3 id="PatientsStep5HB">Health Barriers</h3>
                            <ul className="PatientsStep6">
                                <li>Fear of Medication</li>
                                <li>Fear of losing you</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="PatientsStep7">
                <Link to="/"><button id="PatientsStep7BTN">Personal Information</button></Link>
                <button id="PatientsStep7BTN">Results</button>
                <button id="PatientsStep7BTN">Other</button>
            </div>
            <div className="PatientsStep9">
                <div className="PatientsStep8">
                    <div id="PatientsStep8V">
                        <h1>Personal Information</h1>
                    </div>
                    <div className="PatientsSteo8VSV">
                        <ul className="PatientsStep8VS">
                            <li>FirstName:</li>
                            <li>Middle Initial:</li>
                            <li>Surname:</li>
                        </ul>
                        <ul className="PatientsStep8VS">
                            <li>Address:</li>
                            <li>Date of Birth:</li>
                            <li>Age:</li>
                        </ul>
                        <ul className="PatientsStep8VS">
                            <li>Gender:</li>
                            <li>Blood Type:</li>
                            <li>Contact Number:</li>
                        </ul>
                        <ul className="PatientsStep8VS">
                            <li>Email Address:</li>
                        </ul>
                    </div>
                    <div className="PatientsStep10">
                        <div className="PatientsStep10VS">
                            <h1 id="PatientsStep10S">Emergency Contact</h1>
                            <div className="PatientsStep11">
                                <ul id="PatientsStep10V">
                                    <li>First Name:</li>
                                    <li>Middle Initial:</li>
                                    <li>Surname</li>
                                </ul>
                                <ul id="PatientsStep10V">
                                    <li>Relationship:</li>
                                    <li>Phone Number:</li>
                                </ul>
                            </div>
                        </div>
                        <div className="PatientsStep10VS">
                            <h1 id="PatientsStep10S">Health Information</h1>
                            <div className="PatientsStep11">
                                <ul id="PatientsStep10V">
                                    <li>Allergies:</li>
                                    <li>Chronic Illness/Existing Condition:</li>
                                    <li>Current Medication:</li>
                                    <li>Immunization Record:</li>
                                </ul>
                                <ul id="PatientsStep10V">
                                    <li>Medical Record Number(MRN):</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}