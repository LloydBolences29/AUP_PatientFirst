import { Link } from "react-router-dom"
export default function Profile(){
    return(
        <>
        <nav className="NavBack">
            <ul className="NavList">
                <li>
                    <Link to="/" className="textdecor"><h1 className="Indi">Profile</h1></Link>
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
                <div className="ProfilePicEdit"><Link to="./ProfileEdit"><i className="bi bi-pencil-square"></i></Link></div>
            </div>
        </div>
        <div>
            <ul className="ProfilePage">
                <li>Name :</li><input type="text" name="" className="ProfilePageInput" />
                <li>Phone :</li><input type="tel" name="" className="ProfilePageInput" />
                <li>Email Address :</li><input type="email" name="" className="ProfilePageInput" />
                <li>Age :</li><input type="date" name="" className="ProfilePageInput" />
                <li>Gender :</li><select name="" className="ProfilePageInput">
                    <option value="M">M</option>
                    <option value="F">F</option>
                </select>
                <li>BloodType :</li><select name="" className="ProfilePageInput">
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                </select>
            </ul>
        </div>
        </>
    )
}
