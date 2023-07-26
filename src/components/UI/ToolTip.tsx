import { useState } from "react"

export default function ToolTip(props: {mainText: string, hoverText: string}) {
    const [visible, setVisible] = useState(false);

    return (<div className={`tool-tip-parent`} onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
        {props.mainText}
        {visible && <div className={`tool-tip`}>{props.hoverText}</div>}
    </div>)
}