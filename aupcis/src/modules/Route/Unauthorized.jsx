import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>403 - Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <Link to="/">Go Back to Login</Link>
    </div>
  );
};

export default Unauthorized;