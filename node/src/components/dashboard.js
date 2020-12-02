import React, {useEffect, useState} from "react";
import Search from "./search";
import { useForm } from "react-hook-form";
import { Navbar, Nav, NavDropdown, FormControl, Button, Form } from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";


export default function Dashboard({
    searchInput,
    setSearchInput, 
    setArticles, 
}) {
    const [preferences, setPreferences] = useState()
    const { register, watch, errors, handleSubmit } = useForm();
    const allLabels = ['weapons', 'pedophile', 'sexual', 'money', 'buisness', 'social_media'].join(' or ')
    const [labels, setLabels] = useState(allLabels)
    const labelsPicked = watch()

    useEffect(() => {
        if(labels) {

            (async () => {
                const { data } = await axios.get(`http://localhost:8080/api/es/labels/${labels}`);
                console.log(labels, data)
                setArticles(data);
            })();
        } else {
            (async () => {
                const { data } = await axios.get(`http://localhost:8080/api/es/all`);
                console.log(labels, data)
                setArticles(data);
            })();
        }
      }, [labels]);

      useEffect(() => {
          setLabels(() => {
            if (labelsPicked.labels === "All") {
                return allLabels
            } else if(labelsPicked.labels) {
                  return labelsPicked.labels
            } else {
                return ("")
            } 
          })
      }, [labelsPicked])

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
                        {/* <NavDropdown.Divider />
                            <NavDropdown.Item>
                                <Link to="/alerts">
                                    Manage Alerts
                                </Link>
                            </NavDropdown.Item>
                        <NavDropdown.Divider />
                            <NavDropdown.Item>
                                <Link to="/statistics">
                                    Statistics
                                </Link>
                            </NavDropdown.Item> */}
                    </NavDropdown>
                    </Nav>
                    <Nav>
                    <Form inline style={{color: "white"}} onSubmit={handleSubmit}>
                        <Form.Control
                            ref={register}
                            as="select"
                            className="my-1 mr-sm-2"
                            id="inlineFormCustomSelectPref"
                            name="labels"
                            custom>
                            <option value="">Labels</option>
                            <option value="All">All Labels</option>
                            <option value="weapons">weapons</option>
                            <option value="pedophile">pedophile</option>
                            <option value="sexual">sexual</option>
                            <option value="money">money</option>
                            <option value="buisness">buisness</option>
                            <option value="social_media">social media</option>
                        </Form.Control>
                    </Form>
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
