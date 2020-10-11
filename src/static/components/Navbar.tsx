import React, { StatelessComponent } from "react";
import bear from "../assets/bear.png";
import squid from "../assets/squid.png";
import f_logo from "../assets/f_logo.png";
import { IRequiresAppState } from "../App";
import {
  NavItem,
  Nav,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu
} from "reactstrap";
import { Link } from "react-router-dom";

export const Navbar: StatelessComponent<IRequiresAppState> = ({
  appState: { userData }
}) => {
  const userIconOrSignIn = userData ? (
    <img className="img-fluid rounded profile-img" src={userData.image} />
  ) : (
    <a className="nav-link fb-link" href="/auth/facebook">
      <img src={f_logo} className="f-logo" />
      Sign In
    </a>
  );

  return (
    <nav className="navbar fixed-top flex-md-nowrap p-0 navbar-expand">
      <div className="container">
        <Link className="navbar-brand pl-md-0 pl-1" to="/">
          <div className="row no-gutters">
            <div className="col mr-2 d-flex align-items-center">
              <img src={bear} className="bear" />
            </div>
            <div className="col">
              <span className="ucla">UCLA</span>
              <br />
              <span className="ssa">SSA</span>
            </div>
          </div>
        </Link>
        <Collapse isOpen={true} navbar>
          <Nav className="ml-auto pr-1 pr-md-0" navbar>
            {/* <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" /> */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="mr-2">
                Resources
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <Link to="/guide">
                    <img src={squid} />
                    Sotong Guide
                  </Link>
                </DropdownItem>
                {userData && (
                  <>
                    {userData.approved && (
                      <DropdownItem>
                        <Link to="/testbank">Test Bank</Link>
                      </DropdownItem>
                    )}
                    <DropdownItem divider />
                    {/* {userData.approved && (
                      <DropdownItem>
                        <Link to="/pcp">Peer Counselling</Link>
                      </DropdownItem>
                    )} */}
                    {userData.approved && (
                      <DropdownItem>
                        <Link to="/address_book">Address Book</Link>
                      </DropdownItem>
                    )}
                    {userData.admin && (
                      <DropdownItem>
                        <Link to="/users">Members</Link>
                      </DropdownItem>
                    )}
                    {userData.approved && (
                      <DropdownItem>
                        <Link to="/profile">Profile</Link>
                      </DropdownItem>
                    )}
                   <DropdownItem>
                      <a href="/auth/logout">Log Out</a>
                    </DropdownItem>
                  </>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem>{userIconOrSignIn}</NavItem>
          </Nav>
        </Collapse>
      </div>
    </nav>
  );
};
