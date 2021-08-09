import one from '../../assets/images/round-one.svg'
import two from '../../assets/images/round-two.svg'
import three from '../../assets/images/round-3.svg'
import appLogo from '../../assets/images/large-vbox.svg'
import { Spacer } from '../../components/layout/layout'
import Fade from 'react-reveal/Fade';

import './home.css'
import { AppButton } from '../../components/app-button/app-button'
import { Footer } from '../../components/footer/footer'
import { useHistory } from 'react-router-dom'


export const features = [
    {
        image: one,
        title: 'Pay no more for data',
        content: 'Stream your favourite Nollywood movies and others without paying extra for data and stream at high definition.',
    },
    {
        image: two,
        title: 'Pay per view basis',
        content: 'No more monthly subscription to stream your movies, just fund your VBOX wallet and pay for each movie of your choice at the cheapest rate.',
    },
    {
        image: three,
        title: 'Get a free wallet',
        content: 'Fund your wallet, make basic transfer from your wallet to your friends and family on your VBOX contacts.',
    },
]


export default function Home() {

    const history = useHistory()

    const text = <>Worry no more about data cost to stream your favourite movies on VBOX</>
    return (
        <div className="p-relative full-vh overflow-y-scroll full-width home-wrapper" >
            <div className="body-header-padding d-flex flex-vertical align-center">
                <LogoTopSection text={text} />
                <Spacer height={50} />
                <div className="d-flex d-wp">
                    <Details/>
                </div>
                <Spacer height={90} />
                <Fade bottom>
                    <AppButton onClick={() => history.push('/about')} className="fw600 flag-btn font-size-18" text="Download VBOX" />
                </Fade>
                <Spacer height={50} className="no-desktop-but-mobile"/>
                <Spacer height={100} className="no-mobile"/>
            </div>
            <Footer border="1px solid #C0C0C0" />
        </div>
    )
}


// export const HomeTopArea = () => (
//     <div className="p-relative full-width">

//     </div>
// )

export const LogoTopSection = ({ text, maxWidth , onClick}) => (
    <Fade top>
        <div className="d-flex align-center flex-vertical j-center">
            <img onClick={onClick} src={appLogo} alt="" className={`${onClick && 'c-pointer'}`} />
            <Spacer height={10} />
            <p style={{maxWidth : maxWidth ?? '500px'}} className="fw400 line-height-15 top-text font-size-26 text-center mid-primary">{text}</p>
            <Spacer height={40} />
        </div>
    </Fade>
)


export const Details = () => features.map((detail, idx) => <DetailItem key={idx} {...detail} />)

export const DetailItem = ({ image, title, content }) => (
    <Fade top >
        <div className="p-relative detail-item">
            <img src={image} alt="" />
            <Spacer width={20}/>
            <div className="d-flex flex-vertical">
                <p className="fw700 semi-primary font-size-20">{title}</p>
                <Spacer height={20} />
                <p className="fw500 detail-text-color letter-spacing-05 font-size-18 detail-content">{ content}</p>
            </div>
        </div>
    </Fade>
)