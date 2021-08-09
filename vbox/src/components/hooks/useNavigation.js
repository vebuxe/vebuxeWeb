import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";


export const useNavigation = () => {
    const [navOpen, setNavOpen] = useState(null);
    const { pathname } = useLocation();

	const onNavMenuClick = () => {
		setNavOpen(true);
	}

	const onBodyClick = (e, value) => {
		// console.log({ value })
		setNavOpen(value);
		e.stopPropagation();
	}

	//close nav on new route
	useEffect(() => {
		setNavOpen(null);
    }, [pathname])
    
    return { onNavMenuClick, navOpen , onBodyClick, pathname}
}