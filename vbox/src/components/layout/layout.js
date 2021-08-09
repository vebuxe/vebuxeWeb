import { Footer } from "../footer/footer";
import { Navigation } from "../navigation/navigation";

export default function Layout({ children }) {
    return (
        <div className='p-relative'>
            <Navigation />
            <div className='full-width full-height'>
                {children}
            </div>
            <Footer background="#000000" />
        </div>
    );
}




export const Spacer = ({ width, height, className }) => (<div style={{ width, height }} className={className || ''}></div>)