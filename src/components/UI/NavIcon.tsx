export default function NavIcon(props: {name: string, image: string, expanded: boolean, mode: "info" | "settings" | "dark", handleClick: (type: "info" | "settings" | "dark") => void}) {

    function iconClicked() {
        props.handleClick(props.mode);
    }
    return (
        <div onClick={iconClicked} className={`navicon navicon-${props.name}`}>
            <img src={props.image} alt="navicon"/>
            {props.expanded && <p className="navicon-text">{props.name}</p>}
        </div>
    )
}
