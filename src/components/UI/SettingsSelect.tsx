import { useState } from "react";

export default function SettingsSelect(props: {name: string, selectOptions: Array<{name: string, selected: boolean}>, handleChange: (event: React.MouseEvent<HTMLDivElement>) => void}) {
    const [open, setOpen] = useState(false);

    function toggleOpen() {
        setOpen(old => !old);
    }
    const categoryOptions  = props.selectOptions.map((choice, index) => {
        return (<div className={`setting-option ${props.name} ${index} ${choice.selected ? "selected" : "unselected"}`} onClick={props.handleChange}>{choice.name}</div>);    
    });

    console.log(categoryOptions);
    return (
        <div className={`settings ${props.name}`}>
            <div className={`settings-title ${props.name}`} onClick={toggleOpen}><h3>{props.name}</h3></div>
            {open? <div className={`settings-options-menu ${props.name}`}>{categoryOptions}</div> : <></>}
        </div>
    );
}
