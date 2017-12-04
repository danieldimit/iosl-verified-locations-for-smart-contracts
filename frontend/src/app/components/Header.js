import React, { Component } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Link, browserHistory } from 'react-router';

import styled from 'styled-components';

class Header extends Component {

    render() {
        return (
            <div>
                <Navbar inverse collapseOnSelect id="whole-navbar">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/" href="/" id="logo-link">
                                <div id="toskov">VERIFIED</div> &nbsp; <div id="architects"> LOCATIONS</div>
                            </Link>
                        </Navbar.Brand>
                        <Navbar.Toggle id="burger-btn" />
                    </Navbar.Header>

                    <Navbar.Collapse id="menu-items-container">
                        <Nav pullRight id="menu-items">
                            <NavItem
                                key={1}
                                onClick={() => browserHistory.push('/')}>
                                Renter
                            </NavItem>
                            <NavItem
                                key={2}
                                onClick={() => browserHistory.push('/owner')}>
                                Owner
                            </NavItem>
                            <NavItem
                                key={3}
                                onClick={() => browserHistory.push('/oracle')}>
                                Oracle
                            </NavItem>

                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div id="place-holder-4-header"></div>
            </div>
        );
    }
}

export default Header;
