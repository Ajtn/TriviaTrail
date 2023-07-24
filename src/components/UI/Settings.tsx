import { position } from "../gameComponents/CanvasGrid";

type settingProps = {
    categoryOptions: Array<string>;
    handleApiChanges: (apiParameters: Array<string>) => void;
    ruleOptions: Array<string>;
    handleRuleChanges: (rules: {startHexes: Array<position>, endHexes: Array<position>}) => void;
};

export default function Settings(props: settingProps) {

    return (
        <div className="app-settings-info"></div>
    );
}