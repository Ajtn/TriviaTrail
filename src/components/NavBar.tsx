import React from 'react';
import NavIcon from './NavIcon';
import moon from '../assets/dark.png';
import question from '../assets/hex_question.png';
import wrench from '../assets/wrench.png';
import minIcon from '../assets/minimise.png';

type navbarProps = {
    expandNav: (event: React.MouseEvent | React.KeyboardEvent) => void;
    navState: boolean;
    navigate: (iconIndex: number) => void;
};

export default function Navbar(props: navbarProps) {
    let navOptions = [
        {name: "How to play", image: "question", expanded: false},
        {name: "Settings", image: "wrench", expanded: false},
        {name: "Darkmode", image: "moon", expanded: false},
    ];

    const body = navOptions.map((option, key) => {
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
        return (<NavIcon key={option.name} index={key} name={option.name} image={icon} expanded={props.navState} handleClick={props.navigate}/>);
    });

    return (
        <nav className={props.navState ? "expanded-nav primary-nav" : "hidden-nav primary-nav"} >
            <div className="toggle-nav"><img onClick={props.expandNav} src={minIcon} alt="expand icon" width={25}/></div>
            <div className='nav-main' onMouseEnter={props.expandNav} onMouseLeave={props.expandNav}>{body}</div>
        </nav>
    )

}
