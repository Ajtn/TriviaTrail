import { ruleSet } from "../../App";
import SettingsSelect from "./SettingsSelect";


type settingProps = {
    categoryOptions: Array<{name: string, selected: boolean}>;
    handleCatChange: (index: number) => void;
    ruleOptions: Array<ruleSet>;
    currentRule: number;
    handleRuleChanges: (index: number) => void;
};


export default function Settings(props: settingProps) {

    const ruleNames = props.ruleOptions.map((rule, index) => {
        if (index === props.currentRule) {
            return {name: rule.name, selected: true, hoverText: rule.description};
        } else {
            return {name: rule.name, selected: false, hoverText: rule.description};
        }
    });

    return (
        <div className="app-settings-info">
            <SettingsSelect name={"Categories"} selectOptions={props.categoryOptions} handleChange={props.handleCatChange} />
            <SettingsSelect name={`Game mode`} selectOptions={ruleNames} handleChange={props.handleRuleChanges}/>
        </div>
    );
}