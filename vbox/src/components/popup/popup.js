
import './popup.css';

import useOverflow from '../hooks/use_overflow'



export default function Popup({ children }) {
    useOverflow();
    return (
        <div className='p-fixed full-height full-width popup'>
            <div className='d-flex j-center'>
                <div className='popup-content p-relative' style={{ width: '400px', padding: '20px'}} >
                    {children}
                </div>
            </div>

        </div>
    );
}
