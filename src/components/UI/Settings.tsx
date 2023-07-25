import { useEffect, useState } from "react";
import { position } from "../gameComponents/CanvasGrid";
import SettingsSelect from "./SettingsSelect";

type settingProps = {
    //categoryOptions: Array<string>;
    categoriesEndpoint: string;
    handleApiChanges: (apiParameters: string) => void;
    ruleOptions: Array<{name: string, rules: {startHexes: Array<position>, endHexes: Array<position>}}>;
    handleRuleChanges: (rules: {startHexes: Array<position>, endHexes: Array<position>}) => void;
};


export default function Settings(props: settingProps) {

    const [allCategories, setAllCategories] = useState([]),
    [selectedCats, setSelectedCats] = useState([] as Array<{name: string, selected: boolean}>),
    [selectedRules, setSelectedRules] = useState([]);

    useEffect(initCategories, [props.categoriesEndpoint]);
    useEffect(initSelectedCats, [allCategories]);
    useEffect(updateApiParam, [selectedCats]);

    function initCategories() {
        fetch(props.categoriesEndpoint)
        .then(res => res.json())
        .then(data => setAllCategories(Object.keys(data)));
    }
    
    function initSelectedCats() {
        setSelectedCats(allCategories.map(cat => ({name: cat, selected: true})));
    }

    function updateApiParam() {
        let tempCats = "";
        if (selectedCats.some(cat => !cat.selected)) {
            selectedCats.forEach(cat => {
                if (cat.selected) {
                    tempCats = tempCats + cat.name + ",";
                }
            });
            tempCats.slice(0, -1);
        }
        props.handleApiChanges(tempCats);
    }

    function updateSelectedCategories(event: React.MouseEvent<HTMLDivElement>) {
        if (event.currentTarget.classList[2]) {
            setSelectedCats((oldCats) => {
                return oldCats.map((cat, index) => {
                    if (String(index) === event.currentTarget.classList[2]) {
                        return {...cat, selected: !cat.selected};
                    } else {
                        return cat;
                    }
                });
            })
        }

    }

    function updateGameRules(event: React.MouseEvent<HTMLDivElement>) {

    }

    const ruleNames = props.ruleOptions.map(rule => rule.name);

    return (
        <div className="app-settings-info">
            <SettingsSelect name={"Categories"} selectOptions={selectedCats} handleChange={updateSelectedCategories} />
            <SettingsSelect name={`Game mode`} selectOptions={ruleNames} handleChange={updateGameRules}/>
        </div>
    );
}