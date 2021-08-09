import appNav from '../../assets/images/nav-logo.svg'

import { Link, useHistory } from 'react-router-dom'

import navigation from '../../assets/images/navigation.svg'

import vbox from '../../assets/images/large-vbox.svg'

import './navigation.css'
import { Spacer } from '../layout/layout'
import { useNavigation } from '../hooks/useNavigation'


export const Navigation = () => {
    const history = useHistory()
    const { onNavMenuClick, navOpen , onBodyClick} = useNavigation()
    return (
        <div>
            <div className="navigation-wrapper">
                <div onClick={() => history.push('/')}className="navLogo c-pointer">
                    <img src={appNav} alt=""/>
                </div>
                <div className="nav-links">
                    <Link to='/join'>contact us</Link>
                    <Spacer className="line-spacer" height={30} width={0}/>
                    <Link to='/join'>sign in</Link>
                    <Link className="border-link" to='/join'>get started</Link>
                </div>
            </div>
            <MobileNavigation onBodyClick={onBodyClick} onNavMenuClick={onNavMenuClick} navOpen={navOpen} />
        </div>
    )
}

const MobileNavigation = ({ onNavMenuClick, onBodyClick, navOpen }) => {
	return (
        <div className='no-desktop-but-mobile-flex navigation j-space-between small-content-padding'>
            <div>
			    <img src={vbox} style={{width: '75%'}} alt=""/>
            </div>
			<button className='c-pointer unstyle-button' onClick={onNavMenuClick}>
				<img src={navigation} className='navigation-icon' alt='navigation button' />
			</button>
			{
				navOpen !== null &&
				<MobileNavigationItem
					className={navOpen ? 'nav-open' : 'nav-close'}
					onClick={onBodyClick}
				/>
			}

		</div>
	);
}


const MobileNavigationItem = ({ className, onClick}) => {
	return (
		<div className={`p-fixed whole-area ${className || ''}`} onClick={(e) => onClick(e, false)}>
			<div onClick={(e) => onClick(e, true)} className='p-absolute b-background main-portion'>
                <div className="nav-links">
                    <img src={vbox} alt=""/>
                    <Link to='/'>contact us</Link>
                    <Link to='/'>sign in</Link>
                    <Link className="border-link" to='/'>get started</Link>
                </div>
			</div>
		</div>
	);
}