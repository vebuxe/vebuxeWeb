
import facebook from '../../assets/images/facebook.svg'
import twitter from '../../assets/images/twitter.svg'
import linkedin from '../../assets/images/linkedin.svg'
import { Spacer } from '../layout/layout'

import './footer.css'


export const Footer = ({border, background}) => {
    return (
        <footer style={{ borderTop: border, background }} className="footer d-flex align-center j-space-between">
            <Spacer height={20} className="no-desktop-but-mobile" />
            <p className="fw300 text-center footer-color primary-color font-size-16">&copy; VBOX 2021. All Rights Reserved.</p>
            <div className="right-footer-text d-flex align-center">
                <Spacer height={5} className="no-desktop-but-mobile" />
                <span className="fw500 primary-color font-size-16">Follow us on social media:</span>
                <Spacer width={10}/>
                {/* eslint-disable-next-line */}
                <div className="social-links d-flex align-center">
                     {/* eslint-disable-next-line */}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src={facebook} alt=""/>
                    </a>
                    <Spacer width={5} />
                    {/* eslint-disable-next-line */}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src={twitter} alt=""/>
                    </a>
                    <Spacer width={5} />
                     {/* eslint-disable-next-line */}
                    <a href="#" target="_blank" rel="noopener noreferrer">
                        <img src={linkedin} alt=""/>
                    </a>
                </div>
                <Spacer height={20} className="no-desktop-but-mobile" />
            </div>
        </footer>
    )
}
