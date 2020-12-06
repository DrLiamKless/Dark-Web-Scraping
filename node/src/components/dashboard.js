import React, {useEffect, useState} from "react";
import Search from "./search";
import { useForm } from "react-hook-form";
import { Navbar, Nav, NavDropdown, Button, Form , Modal, Badge} from 'react-bootstrap';
import { Link } from "react-router-dom";
import axios from "axios";
require('dotenv').config()

export default function Dashboard({
    searchInput,
    setSearchInput, 
    setArticles, 
}) {
    const { register, watch, errors, handleSubmit } = useForm();
    const allLabels = ['weapons', 'pedophile', 'sexual', 'money', 'buisness', 'social_media'].join(' or ')
    const [labels, setLabels] = useState(allLabels)
    const [keywords, setKeywords] = useState([])
    const labelsPicked = watch('labels', "")
    const keywordsPicked = watch('keywords', "")
    const [addKeyWord, setAddKeyWord] = useState("")
    const [show, setShow] = useState(false);
    const [notifications, setNotifications] = useState()

   const fetchNotifications = async () => {
        const { data } = await axios.get(`http://localhost:8080/api/mongo/notifications/unseen`);
        setNotifications(data);
        console.log(data)
    };

   const fetchKeywords = async () => {
        const { data } = await axios.get(`http://localhost:8080/api/mongo/keywords`);
        setKeywords(data)
    };

    const updateSeenNotification = async (id) => {
        await axios.put(`http://localhost:8080/api/mongo/notifications/update/${id}`);
        fetchNotifications()
    } 

     const newKeyWord = async (addkeyword) => {
         const addedkeyword = {keyword: addkeyword}
        await axios.post(`http://localhost:8080/api/mongo/keywords/add`, addedkeyword);
    } 

    setInterval(() => {
        fetchNotifications()
    }, 1000*60*10)

    useEffect(() => {
    if(labels) {
        (async () => {
            const { data } = await axios.get(`http://localhost:8080/api/es/labels/${labels}`);
            setArticles(data);
        })();
    } else {
        (async () => {
            const { data } = await axios.get(`http://localhost:8080/api/es/all`);
            setArticles(data);
        })();
    }
    }, [labels]);
      
    useEffect(() => {
        setLabels(() => {
        if (labelsPicked === "All") {
            return allLabels
        } else if(labelsPicked) {
                return labelsPicked
        } else {
            return ("")
        } 
        })
    }, [labelsPicked])

    useEffect(() => {
        if(keywordsPicked) {
            (async () => {
                const { data } = await axios.get(`http://localhost:8080/api/es/search/${keywordsPicked}`);
                setArticles(data);
            })();
        } else {
            (async () => {
                const { data } = await axios.get(`http://localhost:8080/api/es/all`);
                setArticles(data);
            })();
        }
        }, [keywordsPicked]);

    useEffect(() => {
        fetchNotifications()
        fetchKeywords()
    }, []);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="dashboard">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className="nav">
            <Navbar.Brand href="#home">Found You</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                <Badge style={{height: '100%'}} variant="danger" pill>{notifications && notifications.length}</Badge>
                    <NavDropdown title={`Notifications`} id="collasible-nav-dropdown">
                        { notifications ? 
                            notifications?.map((notification,i) => {
                                return (
                                    <NavDropdown.Item key={i} onClick={() => {
                                       updateSeenNotification(notification._id)
                                    }}>
                                    A new Paste from {notification.articleAuthor} for keyword {notification.keyword}
                                    {!notification.seen &&  <Badge style={{marginLeft: '10px'}} key={i} pill variant="danger">unseen</Badge>}
                                    </NavDropdown.Item>
                                )
                            }) : 
                            <NavDropdown.Item>
                                you have no new alerts
                            </NavDropdown.Item>
                        }
                    </NavDropdown>
                    <NavDropdown title="Pages" id="collasible-nav-dropdown">
                        <NavDropdown.Item>
                            <Link to="/home">
                                Home
                            </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                            <NavDropdown.Item>
                                <Link to="/statistics">
                                    Statistics
                                </Link>
                            </NavDropdown.Item>
                    </NavDropdown>
                </Nav>        
                <>
                    <Button variant="primary" variant="outline-info" onClick={handleShow} style={{marginRight:"10px"}}>Add Keyword</Button>
                    <Modal show={show} onHide={handleClose} animation={false}>
                        <Modal.Header closeButton>
                        <Modal.Title>Add New Keyword</Modal.Title>
                        </Modal.Header>
                        <Modal.Body><input placeholder="new keyword..."style={{padding:"10px", margin:"10px"}}onChange={(event)=> {
                            setAddKeyWord(event.target.value)
                        }}></input></Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary"  onClick={() => {
                            newKeyWord(addKeyWord);
                            handleClose()}}>
                            Save Changes
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </>
                <Nav>
                    <Form inline style={{color: "white", paddingRight:'10px'}} onSubmit={handleSubmit}>
                        <div style={{display: "flex", flexDirection: "row"}}>
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
                        <Form.Control
                            ref={register}
                            as="select"
                            className="my-1 mr-sm-2"
                            name="keywords"
                            custom>
                            <option value="">Keywords</option>
                            { 
                                keywords &&
                                keywords.map((keyword, i) => (
                                    <option key={i} value={keyword.keyword}>{keyword.keyword}</option>
                                )
                                )
                            }
                        </Form.Control>
                                                </div>

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
