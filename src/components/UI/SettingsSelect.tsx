import { useState } from "react";
import ToolTip from "./ToolTip";

export default function SettingsSelect(props: {name: string, selectOptions: Array<{name: string, selected: boolean, hoverText?: string}>, handleChange: (index: number) => void}) {
    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(old => !old);
    }
    const categoryOptions  = props.selectOptions.map((choice, index) => {
        return (
        <div 
        key={index}
        className={`setting-option ${props.name} ${choice.selected ? "selected" : "unselected"}`}
        onClick={() => {props.handleChange(index)}}>
            {choice.hoverText ? <ToolTip mainText={choice.name} hoverText={choice.hoverText} /> : choice.name}
        </div>);    
    });

    return (
        <div className={`settings ${props.name}`}>
            <div className={`settings-title ${props.name}`} onClick={toggleOpen}><h3>{props.name}</h3></div>
            {open? <div className={`settings-options-menu ${props.name}`}>{categoryOptions}</div> : <></>}
        </div>
    );
}
