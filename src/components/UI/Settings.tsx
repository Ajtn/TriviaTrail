import { useEffect, useState } from "react";
import { ruleSet } from "../../App";
import SettingsSelect from "./SettingsSelect";


type settingProps = {
    //categoryOptions: Array<string>;
    categoriesEndpoint: string;
    handleApiChanges: (apiParameters: string) => void;
    ruleOptions: Array<ruleSet>;
    currentRule: number;
    handleRuleChanges: (modeIndex: number) => void;
};


export default function Settings(props: settingProps) {

    const [allCategories, setAllCategories] = useState([]),
    [selectedCats, setSelectedCats] = useState([] as Array<{name: string, selected: boolean}>);

    useEffect(initCategories, []);
    useEffect(initSelectedCats, [allCategories]);
    useEffect(updateApiParam, [selectedCats]);

    function initCategories() {
        fetch(props.categoriesEndpoint)
        .then(res => res.json())
        .then(data => setAllCategories(Object.keys(data) as any));
    }
    
    function initSelectedCats() {
        setSelectedCats(allCategories.map(cat => ({name: cat, selected: true})));
    }

    console.log(selectedCats)
    function updateApiParam() {
        let tempCats = "";
        if (selectedCats.some(cat => !cat.selected)) {
            selectedCats.forEach(cat => {
                if (cat.selected) {
                    tempCats = tempCats + cat.name + ",";
                }
            });
            tempCats = tempCats.slice(0, -1).replace(/\s/g,'');
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
        if (event.currentTarget.classList[3] && Number.isInteger(Number(event.currentTarget.classList[3]))) {
            props.handleRuleChanges(Number(event.currentTarget.classList[3]));
        }
    }

    const ruleNames = props.ruleOptions.map((rule, index) => {
        if (index === props.currentRule) {
            return {name: rule.name, selected: true};
        } else {
            return {name: rule.name, selected: false};
        }
    });

    return (
        <div className="app-settings-info">
            <SettingsSelect name={"Categories"} selectOptions={selectedCats} handleChange={updateSelectedCategories} />
            <SettingsSelect name={`Game mode`} selectOptions={ruleNames} handleChange={updateGameRules}/>
        </div>
    );
}