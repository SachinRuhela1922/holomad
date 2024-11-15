import React, { useState } from 'react';
import logo from '../images/hockmadlogo.jpeg';
import NavCSS from '../css/Navbar.module.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false); // State to control the menu visibility

    const toggleMenu = () => {
        setMenuOpen(!menuOpen); // Toggle menu state
    };

    const closeMenu = () => {
        setMenuOpen(false); // Close the menu
    };

    return (
        <div className={NavCSS.body}>
            <header className={NavCSS.header}>
                <div className={NavCSS.logo}>
                    <img src={logo} className={NavCSS.logoimg} alt="Logo" />
                    <Link className={NavCSS.headerlogo} to="/home">Hockmad</Link>
                </div>

                <nav className={`${NavCSS.nav} ${menuOpen ? NavCSS.show : ''}`} id="nav-menu">
                    <i className={`bx bx-x ${NavCSS.close}`} id="close-menu" onClick={closeMenu}></i>
                    <ul className={NavCSS.navlist}>
                        <li className={NavCSS.navitem}><Link to="/home" className={NavCSS.navlink} onClick={closeMenu}>Home</Link></li>
                        <li className={NavCSS.navitem}><Link to="/appointment" className={NavCSS.navlink} onClick={closeMenu}>About</Link></li>
                        <li className={NavCSS.navitem}><Link to="" className={NavCSS.navlink} onClick={closeMenu}>Contact</Link></li>
                        <li className={NavCSS.navitem}><Link to="" className={NavCSS.navlink} onClick={closeMenu}>Login</Link></li>
                        <li className={NavCSS.navitem}><Link to="/" className={NavCSS.navlink} onClick={closeMenu}>Logout</Link></li>
                    </ul>
                </nav>

                <i className={`bx bx-menu ${NavCSS.menuicon}`} id="toggle-menu" onClick={toggleMenu}></i>
            </header>
        </div>
    );
};

export default Navbar;
