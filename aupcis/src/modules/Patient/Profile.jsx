import { Link } from "react-router-dom"
export default function Profile(){
    return(
        <>
        <nav className="NavBack">
            <ul className="NavList">
                <li>
                    <Link className="textdecor"><h1 className="Indi">Profile</h1></Link>
                </li>
                <div className="NavListOthers">
                    <li>
                        <Link className="textdecor"><h1 className="Indi">About</h1></Link>
                    </li>
                    <li>
                        <Link className="textdecor"><h1 className="Indi">Services</h1></Link>
                    </li>
                    <li className="UserEx">
                        <div className="NavProfilePic"><i className="bi bi-person-circle"></i></div>
                        <div className="InfoName">
                            <h2 className="NameNav">Name</h2>
                            <h5 className="UserNav">User</h5>
                        </div>
                    </li>
                </div>
            </ul>
        </nav>
        <div className="PersonalOverall">
            <div className="PersonalInfo">
                <div className="ProfilePic"><i className="bi bi-person-circle"></i></div>
                <h5 className="PersonalInfo2">Personal Information</h5>
                <div className="ProfilePicEdit"><i className="bi bi-pencil-square"></i></div>
            </div>
        </div>
        <div>
            <ul className="ProfilePage">
                <li>Name :</li>
                <li>Phone :</li>
                <li>Email Address :</li>
                <li>Age :</li>
                <li>Gender :</li>
                <li>BloodType :</li>
            </ul>
        </div>
        </>
    )
}