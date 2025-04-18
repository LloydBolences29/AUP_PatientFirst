export default function PatientDashboard() {
    return(
        <>
        <div className="OverallCard2">
            <div className="OverallCard1">
                <div className="PatientDashboardCard1">
                    <div className="PatientDashboardCardUnderlay">
                        <div className="PDCard1PI">
                            <h3>Personal</h3>
                            <h3>Information</h3>
                        </div>
                        <div id="PDCard1PIC">
                            <i className="bi bi-person-circle"></i>
                        </div>
                    </div>
                    <div className="PatientDashboardCardUnderlay2">
                        <ul className="PatientDashboardCardUnderlay3">
                            <li>Name:</li>
                            <li>Phone:</li>
                            <li>Age:</li>
                            <li>Gender:</li>
                            <li>BloodType:</li>
                            <li>Medical ID:</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="PDC2V1">
                <div className="PatientDashboardCard2">
                    <h3 id="PDC2V2">Next Appointment(s)</h3>
                </div>
            </div>
            <div className="PDC3V4">
                <div className="PatientDashboardCard3">
                    <h4>Check Your</h4>
                    <h4>Symptoms</h4>
                    <h4>With Our AI</h4>
                    <button id="PDC3BTN">Check Me!</button>
                </div>
                <div className="PatientDashboardCard4">
                    <div id="PDC4BI">
                        <h4>Billing</h4>
                        <h4>Information</h4>
                    </div>
                    <div id="PDC4Mid">
                        <h5 id="PDC4Currency">$</h5>
                        <button id="PDC4BTN">See All!</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="PDC5V1">
            <div className="PatientDashboardCard5">
                <div id="PDC5V2">
                    <h3>Recent Appointments</h3>
                </div>
                <div className="PDC5V4">
                    <table id="PDC5V3">
                        <thead>No.</thead>
                        <thead>Doctor</thead>
                        <thead>Specialty</thead>
                        <thead>Purpose</thead>
                        <thead>Date</thead>
                        <thead>Start Time</thead>
                        <thead>End Time</thead>
                        <thead>Status</thead>
                        <thead>Notes</thead>
                    </table>
                </div>
            </div>
        </div>
        </>
    )
}