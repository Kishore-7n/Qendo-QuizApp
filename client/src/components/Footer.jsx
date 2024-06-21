import React from 'react';

const Footer = () => {
    let year = new Date().getFullYear();
    return (
        <footer className="footer p-4 bg-base-100 text-base-content footer-center">
            <div>
                <p>&copy; {year} Øendo - All rights reserved</p>
            </div>
        </footer>
    );
};

export default Footer;
