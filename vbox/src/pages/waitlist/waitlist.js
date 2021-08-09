import { useState } from "react"
import { useHistory } from "react-router-dom"
import { Footer } from "../../components/footer/footer"
import { Spacer } from "../../components/layout/layout"
import Popup from "../../components/popup/popup"
import { LogoTopSection } from "../home/home"

import axios from 'axios'



export default function Waitlist() {
    const [show, setShow] = useState(false)
    const [value, setValue] = useState('')
    const [loading, setLoading] = useState(false)
    const [res, setRes] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')


    const history = useHistory()
    
    const joinWaitlist = async () => {
        if (!value || !/\S+@\S+\.\S+/.test(value)) {
            return;
        }
        try {
            setLoading(true)
            const response = await axios.post('https://www.vbox.media/api/users/int', {
                email: value
            })
            if (response.data.success) {
                setRes(true)
            }
            setLoading(false)
            setValue('')
            setShow(true)
        } catch (error) {
            setLoading(false)
            if (error.response.data.errors.length > 0) {
                setRes(false)
                setErrorMessage(error.response.data.errors[0].message)
                setShow(true)
            }
        }
    }

    const text = <>VBOX coming to all web and mobile platforms soon!!!</>
    return (
        <div className="p-relative full-vh overflow-y-scroll full-width home-wrapper" >
            <div className="body-header-padding d-flex flex-vertical align-center">
                <LogoTopSection onClick={() => history.push('/')}  maxWidth="100%" text={text} />
                <p style={{maxWidth : '500px', lineHeight : '25px'}} className="detail-text-color text-center letter-spacing-05 fw500 font-size-18 ">We are working to get you started on VBOX as soon as possible. We’re progressing excellently. If you’d like us to send you a reminder when we’re ready, kindly provide your email below:</p>
                <Spacer height={40} />
                <div className="d-flex align-center wht">
                    <input value={value} onChange={(e) => setValue(e.target.value)} type="text" className="waitlist-input fw400 font-size-16" placeholder="Please enter your email address" />
                    <Spacer className="no-mobile" width={20}/>
                    <button onClick={joinWaitlist} className="waitlist-btn c-pointer primary-color font-size-18 fw600">{loading ? 'Sending...' : 'Notify me when VBOX is ready'}</button>
                </div>
                <Spacer height={40} className="no-desktop-but-mobile" />
            </div>
            {show &&
                <Popup>
                    <h3 className="fw500 text-center font-size-18" style={{color: res === false ? 'red' : '#0EB56E'}}>{ res === false ? 'Error' : 'Thank You!'}</h3>
                    <Spacer height={20} />
                    <Spacer width={400 } className="grey-line" height={1} />
                    <Spacer height={20}/>
                    <p className="black-text fw400 text-center font-size-16">{ res === false ? errorMessage :'You’ll get a notification from us as soon as we are live on all platforms.'}</p>
                    <Spacer height={20}/>
                    <button onClick={() => setShow(false)} className="float-right primary-color c-pointer font-size-16 fw400 okay-btn">Okay</button>
                </Popup>
            }
            <Footer border="1px solid #C0C0C0" />
        </div>
    )
}