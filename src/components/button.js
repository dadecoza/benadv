import './button.css';
function Button({ children, onClick }) {
    const className = (children === "back") ? "back" : "button";
    return (<button className={className} onClick={onClick}>{children}</button>)
}
export default Button;