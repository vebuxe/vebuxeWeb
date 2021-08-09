
import './app-button.css'

export const AppButton = ({onClick, text, className}) => (
    <button className={`app-button primary-color c-pointer ${className || ''}`} onClick={onClick}>{text }</button>
)