import React from 'react';
import '../css/footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <p>
                    &copy; 2025 AttenAi | Developed By{' '}
                    <a
                        href="https://sachin.bio/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Sachin Khatri
                    </a>.
                </p>
            </div>
        </footer>
    );
}

export default Footer;