import React, {useEffect, useState} from "react";
import Search from "./search";
import { useForm } from "react-hook-form";
import { Navbar, Nav, NavDropdown, FormControl, Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";


export default function Dashboard({
    searchInput,
    setSearchInput, 
    setArticles, 
}) {
    const [preferences, setPreferences] = useState()
    const { register, watch, errors, handleSubmit } = useForm();
    const formFields = watch();

  return (
    <div className="dashboard">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="nav">
            <Navbar.Brand href="#home">Found You</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <NavDropdown title="Notifications" id="collasible-nav-dropdown">
                        <NavDropdown.Item>Notifications</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title="Pages" id="collasible-nav-dropdown">
                        <NavDropdown.Item>
                            <Link to="/home">
                                Home
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                            <NavDropdown.Item>
                                <Link to="/alerts">
                                    Manage Alerts
                                </Link>
                        <NavDropdown.Divider />
                                <Link to="/statistics">
                                    Statistics
                                </Link>
                            </NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                    <Nav>
                    <Search 
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        setArticles={setArticles}
                        formFields>
                    </Search>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    </div>
  );
}
