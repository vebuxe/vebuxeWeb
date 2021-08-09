import Layout, { Spacer } from "../../components/layout/layout"

import iphoneX from '../../assets/images/iphoneX.svg'
import phone from '../../assets/images/phone.svg'

import Fade from 'react-reveal/Fade';

import './about.css'
import { AppButton } from "../../components/app-button/app-button"
import { useHistory } from "react-router-dom";


export const About = () => {
    return (
        <Layout>
            <AboutTopSection />
            <Spacer height={30} />
            <AboutBottomSection />
        </Layout>
    )
}


export const AboutTopSection = () => {
    const history = useHistory()
    return (
        <div className="p-relative a-top-section  content-padding" >
            <Fade left >
                <div className="left">
                    <h3 className="fw600 mobile-text-center blue-text a-top-text">Simple and elegant design</h3>
                    <Spacer height={30} />
                    <p className="top-content mobile-text-center fw500 ">
                        Watch all your movies in one place. Fund your wallet and stream movies on pay per view basis. You can download movies and watch later (PS: Movie downloaded will only be available for 72 hours). You can save your favourite movies.
                    </p>
                    <Spacer height={50} />
                    <AppButton className="fw600 font-size-18" onClick={() => history.push('/join')} text="Watch movies on VBOX now" />
                </div>
            </Fade>
            <Fade right>
                <div className="right left">
                    <img className="mobile-image-width-82" src={iphoneX} alt="iphone"/>
                </div>
            </Fade>
        </div>
    )
}


export const AboutBottomSection = () => {
    const history = useHistory()
    return (
    <div className="p-relative b-background content-padding" >
        <div className=" a-top-section flag">
            <Fade left>
                <div className="">
                    <img className="mobile-image-width-95" src={phone} alt="iphone" />
                </div>  
            </Fade>
            <Fade right>
                <div className="left">
                    <Spacer height={30} className="no-desktop-but-mobile"/>
                    <h3 className="fw600 primary-color mobile-text-center a-top-text">Control your wallet</h3>
                    <Spacer height={30} />
                    <p className="b-content mobile-text-center fw500 ">
                    You can set spending limit on movies you watch from your wallet. You can perform basic transfer from your wallet to friends and family on your VBOX contacts. They can also transfer to your wallet. 
                    </p>
                    <Spacer height={50} />
                    <AppButton className="fw600 font-size-18" onClick={() => history.push('/join')} text="Watch movies on VBOX now" />
                   
                </div> 
            </Fade>
        </div>
        <Spacer height={50} className="no-mobile" />
    </div>
    )
}