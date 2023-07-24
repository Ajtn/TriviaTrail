import {useState, MouseEvent} from 'react';
import NavIcon from './NavIcon';
import moon from '../../assets/dark.png';
import question from '../../assets/hex_question.png';
import wrench from '../../assets/wrench.png';
import minIcon from '../../assets/minimise.png';
import maxIcon from '../../assets/maximise.png';

type navbarProps = {
    handleIconClick: (type: "info" | "settings" | "dark") => void;
};

export default function Navbar(props: navbarProps) {
    const [navOpen, setNavOpen] = useState({scrollOpen: false, clickOpen: false});

    let navOptions = [
        {name: "How to play", mode: "info" as "info", image: "question", expanded: false},
        {name: "Settings", mode: "settings" as "settings", image: "wrench", expanded: false},
        {name: "Darkmode", mode: "dark" as "dark", image: "moon", expanded: false},
    ];

    const body = navOptions.map((option) => {
        let icon = question;
        switch (option.image) {
            case "question":
                icon = question;
                break;
            case "wrench":
                icon = wrench;
                break;
            case "moon":
                icon = moon;
                break;
        }
        return (<NavIcon key={option.name} name={option.name} image={icon} mode={option.mode} expanded={navOpen.clickOpen || navOpen.scrollOpen} handleClick={props.handleIconClick}/>);
    });

    function expandNav(event: MouseEvent) {
        console.log(event)
        if (event.type === "click") {
            setNavOpen(navState => ({...navState, clickOpen: !navState.clickOpen}));
        } else {
            setNavOpen(navState => ({...navState, scrollOpen: !navState.scrollOpen}));
        }
    }
    console.log(navOpen);
    return (
        <nav className={navOpen.clickOpen || navOpen.scrollOpen ? "expanded-nav primary-nav" : "hidden-nav primary-nav"} >
            <div className="toggle-nav"><img onClick={expandNav} src={(navOpen.clickOpen) ? minIcon : maxIcon} alt="expand icon" width={25}/></div>
            <div className='nav-main' onMouseEnter={expandNav} onMouseLeave={expandNav}>{body}</div>
        </nav>
    )

}
