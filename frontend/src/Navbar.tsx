import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "./logo.png";
import "./navbar.css";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img 
            src={logo}  
              alt="StoryGenie Logo" 
              height="30" 
              className="d-inline-block align-top navbar-logo"
          />
          <span className="navbar-brand-text">StoryGenie</span>
        </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  HOME
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="create">
                  CREATE
                </Link>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <Link
                to="/profile"
                className="btn btn-outline-success"
                type="submit"
                style={{ marginLeft: 10 }}
              >
                Profile
                <FontAwesomeIcon icon={faUser} style={{ marginLeft: 10 }} />
              </Link>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
