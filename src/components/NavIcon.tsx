export default function NavIcon(props: {name: string, image: string, expanded: boolean, index:number, handleClick: (iconIndex: number) => void}) {

    function iconClicked() {
        props.handleClick(props.index);
    }
    return (
        <div onClick={iconClicked} className={`navicon-${props.name} ${props.index} navicon`}>
            <img src={props.image} alt="navicon" width="30" height="30" onClick={iconClicked} />
            {props.expanded && <p className="navicon-text">{props.name}</p>}
        </div>
    )
}