// const default_state = {
//     ws: null,
//
//     /*
//     index: 1545798262
//     title: ""
//     description: ""
//     tags: []
//     grammar: ""
//     ruleType: {constraint: "NONE", checkFor: [], type: "WITHIN"}
//     quantifier: {detail: "", command: ""}
//     constraint: {detail: "", command: ""}
//     rulePanelState: {
//         editMode: false
//         title: ""
//         description: ""
//         ruleTags: []
//         folderConstraint: ""
//         filesFolders: []
//         constraintXPath: ""
//         quantifierXPath: ""
//         autoCompleteText: ""
//         activeTab: 0
//         guiState: {activeTab: "quantifier", quantifier: {…}, constraint: {…}, ruleType: ""}
//     }
//     xPathQueryResult: []
//      */
//     ruleTable: [],
//     tagTable: [],
//     xml: [],
//     hash: ["index"],
//     ignoreFile: false,
//     message: "init",
//     filePath: "",
//     hashManager: {
//         history: ["#/index"],
//         clicked: false,
//         activeHash: 0,
//         forwardDisable: "disabled",
//         backDisable: "disabled"
//     },
//     // used for new rule form
//     newOrEditRule: {
//         isEditMode: false,
//         title: "",
//         description: "",
//         ruleTags: [],
//         folderConstraint: "",
//         filesFolders: [],
//
//         autoCompleteText: "",
//         quantifierXPath: "", // only produced by autoComplete grammar
//         constraintXPath: "", // only produced by autoComplete grammar
//         sentMessages: [],
//         receivedMessages: [],
//
//         guiState: {
//             activeTab: "quantifier",
//             quantifier: {
//                 key: "", //"class",
//                 value: "",
//                 target: "follows",
//                 children: {
//                     "top": [],
//                     "before": [],
//                     "before_1": [],
//                     "before_2": [],
//                     "after": [],
//                     "after_1": [],
//                     "after_2": [],
//                     "within": [],
//                     "child": {}
//                 }
//             },
//             constraint: {
//                 key: "", //"class",
//                 value: "",
//                 target: "follows",
//                 children: {
//                     "top": [],
//                     "before": [],
//                     "before_1": [],
//                     "before_2": [],
//                     "after": [],
//                     "after_1": [],
//                     "after_2": [],
//                     "within": [],
//                     "child": {}
//                 }
//             },
//             ruleType: "" // "Must" or "MustBeEqualTo"
//         }
//     }
//
// };

// used for editing existing rule
// const default_rulePanelState = {
//     editMode: false, // default must be false unless a new rule is being generated: !!props["newRule"]
//
//     title: "",
//     description: "",
//     ruleTags: [],
//     folderConstraint: "",
//     filesFolders: [],
//
//     autoCompleteText: "",
//     quantifierXPath: "", // only produced by autoComplete grammar
//     constraintXPath: "", // only produced by autoComplete grammar
//
//     guiState: {
//         activeTab: "quantifier",
//         quantifier: {
//             key: "class",
//             value: "",
//             target: "follows",
//             children: {
//                 "top": [],
//                 "before": [],
//                 "before_1": [],
//                 "before_2": [],
//                 "after": [],
//                 "after_1": [],
//                 "after_2": [],
//                 "within": [],
//                 "child": {}
//             }
//         },
//         constraint: {
//             key: "class",
//             value: "",
//             target: "follows",
//             children: {
//                 "top": [],
//                 "before": [],
//                 "before_1": [],
//                 "before_2": [],
//                 "after": [],
//                 "after_1": [],
//                 "after_2": [],
//                 "within": [],
//                 "child": {}
//             }
//         },
//         ruleType: "" // "Must" or "MustBeEqualTo"
//     }
// };

import {initial_state, default_rulePanelState, initial_guiState} from './initialState';
import {generateTreeForElement} from "./ui/ruleGenerationGUI/guiConstants";


/**
 * using default_state as a default value surprisingly changes its value
 * Any incoming variable through arguments must be cloned and mutated,
 * Direct mutation doesn't work properly (UPDATE_RULE_TABLE)
 * @param state
 * @param action
 * @returns {*} new state
 */
const reducer = (state = JSON.parse(JSON.stringify(initial_state)), action) => {
    // console.log('reducer running', action);

    // Using Object.assign({}, state) has a flaw that it only does a shallow copy.
    // It means that nested properties are still going to be copied by reference.
    let copiedState = JSON.parse(JSON.stringify(state));

    switch (action.type) {
        case "HASH":
            if (!state.hashManager.clicked) {
                return Object.assign({}, state, {
                    hash: action["value"],
                    message: "HASH",
                    hashManager: {
                        history: [...state.hashManager.history, "#/" + action["value"].join("/")],
                        clicked: false,
                        activeHash: state.hashManager.activeHash + 1,
                        forwardDisable: "disabled",
                        backDisable: state.hashManager.activeHash === 0
                    }
                });
            }
            return Object.assign({}, state, {
                hash: action["value"],
                message: "HASH",
                hashManager: {
                    history: state.hashManager.history,
                    clicked: false,
                    activeHash: state.hashManager.activeHash,
                    forwardDisable: state.hashManager.forwardDisable,
                    backDisable: state.hashManager.backDisable
                }
            });

        case "NEW_WS":
            return Object.assign({}, state, {ws: action["value"], message: "NEW_WS"});

        case "UPDATE_TAG_TABLE":
            return Object.assign({}, state, {tagTable: action["value"], message: "UPDATE_TAG_TABLE"});

        case "UPDATE_RULE_TABLE":
            let rules = JSON.parse(JSON.stringify(action["ruleTable"]));
            rules = rules.map(d => {
                let a =  Object.assign({}, d);
                return Object.assign({}, d, {
                    rulePanelState: {
                        ...default_rulePanelState,
                        editMode: false,
                        title: a.title,
                        description: a.description,
                        ruleTags: a.tags,
                        folderConstraint: a.ruleType.constraint,
                        filesFolders: a.ruleType.checkFor,
                        quantifierXPath: a.quantifier.command,
                        constraintXPath: a.constraint.command,
                        autoCompleteText: a.grammar
                    }
                });
            });
            return Object.assign({}, state, {
                ruleTable: rules,
                message: "UPDATE_RULE_TABLE"
            });

        case "UPDATE_RULE":
            return Object.assign({}, state, {
                message: "UPDATE_RULE"
            });

        case "SUBMIT_NEW_RULE":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    isEditMode: false
                },
                message: "NEW_RULE"
            });

        case "SUBMIT_NEW_TAG":
            return Object.assign({}, state, {
                message: "NEW_TAG"
            });

        case "IGNORE_FILE":
            let editCount = state.ruleTable.reduce((count, element) =>  count + element.rulePanelState.editMode ? 1 : 0, 0);
            if (state.newOrEditRule.isEditMode || editCount > 0)  return Object.assign({}, state);
            return Object.assign({}, state, {ignoreFile: action["shouldIgnore"], message: "IGNORE_FILE"});

        case "CLICKED_ON_FORWARD":
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    clicked: true,
                    activeHash: state.hashManager.activeHash + 1,
                    forwardDisable: state.hashManager.activeHash === state.hashManager.history.length - 2 ? "disabled" : "",
                    backDisable: ""
                }
            });

        case "CLICKED_ON_BACK":
            return Object.assign({}, state, {
                hashManager: {
                    history: state.hashManager.history,
                    clicked: true,
                    activeHash: state.hashManager.activeHash - 1,
                    forwardDisable: "",
                    backDisable: state.hashManager.activeHash === 1 ? "disabled" : ""
                }
            });

        case "FILE_PATH":
            if (state.ignoreFile) return Object.assign({}, state, {message: "FILE_PATH_UPDATED"});
            return Object.assign({}, state, {filePath: action["value"], message: "FILE_PATH_UPDATED"});

        case "CLEAR_NEW_RULE_FORM":
            return Object.assign({}, state, {
                newOrEditRule: {
                    isEditMode: false,
                    title: "",
                    description: "",
                    ruleTags: [],
                    folderConstraint: "",
                    filesFolders: [],

                    autoCompleteText: "",
                    quantifierXPath: "", // only produced by autoComplete grammar
                    constraintXPath: "", // only produced by autoComplete grammar
                    sentMessages: [],
                    receivedMessages: [],

                    guiState: JSON.parse(JSON.stringify(initial_guiState))
                },
                message: "CLEAR_NEW_RULE_FORM"
            });

        case "EDIT_RULE_FORM":
            if (action["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action["ruleIndex"]) return a;
                    a.rulePanelState.title = action["title"];
                    a.rulePanelState.description = action["description"];
                    a.rulePanelState.ruleTags = action["ruleTags"];
                    a.rulePanelState.folderConstraint = action["folderConstraint"];
                    a.rulePanelState.filesFolders = action["filesFolders"];
                    return a;
                });
                return Object.assign({}, state, {
                    ruleTable: rules
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        title: action["title"],
                        description: action["description"],
                        ruleTags: action["ruleTags"],
                        folderConstraint: action["folderConstraint"],
                        filesFolders: action["filesFolders"]
                    }
                });

        case "CHANGE_EDIT_MODE":
            if (action["ruleIndex"] !== -1) {
                let editCount = state.ruleTable.reduce((count, element) => {
                    if (element.index !== action["ruleIndex"]) return count + element.rulePanelState.editMode ? 1 : 0;
                    return count + action["newEditMode"] ? 1 : 0;
                }, 0);

                // deep copy, slice(0) and array.map() doesn't work
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index === action["ruleIndex"]) {
                        a.rulePanelState.editMode = action["newEditMode"];

                        // reset fields of the form after cancel editing
                        if (!action["newEditMode"])
                            a.rulePanelState = {
                                ...default_rulePanelState,
                                title: d.title,
                                description: d.description,
                                ruleTags: d.tags,
                                folderConstraint: d.ruleType.constraint,
                                filesFolders: d.ruleType.checkFor,
                                quantifierXPath: d.quantifier.command,
                                constraintXPath: d.constraint.command,
                                autoCompleteText: d.grammar
                            }
                    }
                    return a;
                });
                return Object.assign({}, state, {
                    ignoreFile: (state.newOrEditRule.isEditMode || editCount > 0),
                    ruleTable: rules
                });
            }
            else
                return Object.assign({}, state, {
                    ignoreFile: (action["newEditMode"] || state.ruleTable.reduce((count, element) => count + element.rulePanelState.editMode ? 1 : 0, 0) > 0),
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        isEditMode: action["newEditMode"]
                    }
                });

        case "RECEIVE_GUI_TREE":
            if (action["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action["constraintXPath"];
                    a.rulePanelState.autoCompleteText = action["autoCompleteText"];
                    a.rulePanelState.guiState = {
                        ...a.rulePanelState.guiState,
                        ...action["newTreeData"]
                    };
                    return a;
                });
                return Object.assign({}, state, {
                    message: "RECEIVE_GUI_TREE",
                    ruleTable: rules
                });
            }
            else
                return Object.assign({}, state, {
                    message: "RECEIVE_GUI_TREE",
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        quantifierXPath: action["quantifierXPath"],
                        constraintXPath: action["constraintXPath"],
                        autoCompleteText: action["autoCompleteText"],
                        guiState: {
                            ...state.newOrEditRule.guiState,
                            ...action["newTreeData"]
                        }
                    }
                });

        case "SEND_EXPR_STMT_XML":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    sentMessages: state.newOrEditRule.sentMessages.concat([action["codeTextAndID"]])
                },
                message: "SEND_EXPR_STMT_XML"
            });

        case "RECEIVE_EXPR_STMT_XML":
            return Object.assign({}, state, {
                newOrEditRule: {
                    ...state.newOrEditRule,
                    receivedMessages: state.newOrEditRule.receivedMessages.concat([action["xmlData"]])
                },
                message: "RECEIVE_EXPR_STMT_XML"
            });

        case "MATCHED_MESSAGES":
            if (action["ruleIndex"] !== -1) {
                let rules = JSON.parse(JSON.stringify(state.ruleTable));
                rules = rules.map(d => {
                    let a = Object.assign({}, d);
                    if (a.index !== action["ruleIndex"]) return a;
                    a.rulePanelState.quantifierXPath = action["quantifierXPath"];
                    a.rulePanelState.constraintXPath = action["constraintXPath"];
                    return a;
                });
                return Object.assign({}, state, {
                    message: "MATCHED_MESSAGES",
                    ruleTable: rules,
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        sentMessages: action["sentMessages"],
                        receivedMessages: action["receivedMessages"]
                    },
                });
            }
            else
                return Object.assign({}, state, {
                    newOrEditRule: {
                        ...state.newOrEditRule,
                        quantifierXPath: action["quantifierXPath"],
                        constraintXPath: action["constraintXPath"],
                        sentMessages: action["sentMessages"],
                        receivedMessages: action["receivedMessages"]
                    },
                    message: "MATCHED_MESSAGES"
                });

        /*
        * ruleIndex, newTab
        */
        case "CHANGE_ACTIVE_TAB":
            if (action["ruleIndex"] !== -1)
                copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                    if (rule.index !== action["ruleIndex"]) return rule;
                    rule.rulePanelState.guiState.activeTab = action["newTab"];
                    return rule;
                });
            else
                copiedState.newOrEditRule.guiState.activeTab = action["newTab"];
            return copiedState;


        /*
          {
            type: "CHANGE_GUI_ELEMENT",
            ruleIndex: ruleIndex,
            group: group, // quantifier or constraint
            tasks: tasks
          }
        */
        case "CHANGE_GUI_ELEMENT":
            // There can be several jobs.
            // All changes are done on a copy
            action["tasks"].forEach(job => {
                switch (job["task"]) {
                    // job = {elementId: "", task: "", value: `${childGroupName}`}
                    case "ADD_EXTRA":
                    case "REMOVE_EXTRA":
                        // general function for adding and removing extra fields
                        let processFunc = (array) => {
                            // for "body" value should be in form of `body,${index}`
                            let childGroup = job["value"].startsWith("body") ? "body" : job["value"];

                            let filterFunction = (array, id) => {
                                if (array[action["group"]].guiElements[id].activeElement)
                                    return true;
                                delete array[action["group"]].guiElements[id];

                                // if the newly removed element is a selected element, un-select it
                                if (array[action["group"]].tree.selectedElementID === id)
                                    array[action["group"]].tree.selectedElementID = "";

                                return false;
                            };

                            let childrenGroup = array[action["group"]].tree[job["elementId"]].children[childGroup];
                            if (job["value"].startsWith("body")) childrenGroup = array[action["group"]].tree[job["elementId"]].children[childGroup][+(job["value"].split(',')[1])];

                            let newElementConditionName = array[action["group"]].guiElements[childrenGroup[0]].conditionName;
                            if (job["task"] === "REMOVE_EXTRA") {
                                // remove all inactive elements
                                if (job["value"].startsWith("body"))
                                    array[action["group"]].tree[job["elementId"]].children[childGroup][+(job["value"].split(',')[1])] =
                                        array[action["group"]].tree[job["elementId"]].children[childGroup][+(job["value"].split(',')[1])].filter((id) => filterFunction(array, id));
                                else
                                    array[action["group"]].tree[job["elementId"]].children[childGroup] =
                                        array[action["group"]].tree[job["elementId"]].children[childGroup].filter((id) => filterFunction(array, id));
                            }
                            let newElementId = Math.floor(new Date().getTime() / 10).toString();
                            let newElementsData = generateTreeForElement(newElementConditionName, newElementId);
                            // updating the existing tree
                            if (job["value"].startsWith("body"))
                                array[action["group"]].tree[job["elementId"]].children[childGroup][+(job["value"].split(',')[1])].push(newElementId);
                            else
                                array[action["group"]].tree[job["elementId"]].children[childGroup].push(newElementId);
                            // adding new trees
                            newElementsData.trees.forEach(tree => array[action["group"]].tree[tree.id] = tree.node);
                            // adding new elements
                            newElementsData.elements.forEach(elem => array[action["group"]].guiElements[elem.id] = elem.node);

                            return array;
                        };


                        if (action["ruleIndex"] !== -1)
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action["ruleIndex"]) return rule;
                                rule.rulePanelState.guiState = processFunc(rule.rulePanelState.guiState);
                                return rule;
                            });
                        else
                            copiedState.newOrEditRule.guiState = processFunc(copiedState.newOrEditRule.guiState);

                        break;

                    // job = {elementId: "", task: "UPDATE_ELEMENT", value: {props: newValues}}
                    case "UPDATE_ELEMENT":
                        if (action["ruleIndex"] !== -1) {
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action["ruleIndex"]) return rule;
                                rule.rulePanelState.guiState[action["group"]].guiElements[job["elementId"]] = {
                                    ...rule.rulePanelState.guiState[action["group"]].guiElements[job["elementId"]],
                                    ...job["value"]
                                };

                                // if the newly inactive element is a selected element, un-select it
                                if (rule.rulePanelState.guiState[action["group"]].tree.selectedElementID === job["elementId"] &&
                                    !rule.rulePanelState.guiState[action["group"]].guiElements[job["elementId"]].activeElement)
                                    rule.rulePanelState.guiState[action["group"]].tree.selectedElementID = "";

                                return rule;
                            });
                        }
                        else {
                            copiedState.newOrEditRule.guiState[action["group"]].guiElements[job["elementId"]] = {
                                ...copiedState.newOrEditRule.guiState[action["group"]].guiElements[job["elementId"]],
                                ...job["value"]
                            };

                            // if the newly inactive element is a selected element, un-select it
                            if (copiedState.newOrEditRule.guiState[action["group"]].tree.selectedElementID === job["elementId"] &&
                                !copiedState.newOrEditRule.guiState[action["group"]].guiElements[job["elementId"]].activeElement)
                                copiedState.newOrEditRule.guiState[action["group"]].tree.selectedElementID = "";
                        }
                        break;

                    // job = {elementId: "", task: "REMOVE_ELEMENT", value: {parentId: ""}}
                    case "REMOVE_ELEMENT":

                        // search in parent children and remove elementId
                        // toBeDeletedIDs=[] to be removed from ...guiState.${group}.guiElements and ....guiState["quantifier/constraint"]
                        // build a stack=[elementId] for going through tree of elementId
                        // while stack.size()>0
                        //  pop one newId, add it to storeIDs
                        //  add ids of children of the popped id tree to the stack
                        // delete toBeDeletedIDs from ...guiState.${group}.guiElements and ....guiState["quantifier/constraint"]
                        let processRemoveElement = (array) => {
                            let parentTree = array[action["group"]].tree[job["value"]["parentId"]];
                            Object.keys(parentTree.children).forEach(childGroup => {
                                if (childGroup !== "body")
                                    array[action["group"]].tree[job["value"]["parentId"]].children[childGroup] = parentTree.children[childGroup].filter(elemId => elemId !== job["elementId"]);
                                else
                                    array[action["group"]].tree[job["value"]["parentId"]].children["body"] = parentTree.children["body"].map(subGroup => {
                                        return subGroup.filter(elemId => elemId !== job["elementId"])
                                    });
                            });

                            let toBeDeletedIDs = [], stackIDs = [job["elementId"]];
                            while (stackIDs.length > 0) {
                                let tempId = stackIDs.pop();
                                toBeDeletedIDs.push(tempId);

                                let tempTree = array[action["group"]].tree[tempId];
                                let childrenIds = [];

                                try {
                                    Object.keys(tempTree.children)
                                } catch (e) {
                                    console.log(array[action["group"]].tree, tempId)
                                }

                                Object.keys(tempTree.children).forEach(childGroup => {
                                    if (childGroup !== "body") childrenIds = childrenIds.concat(tempTree.children[childGroup]);
                                    else
                                        tempTree.children["body"].forEach(subGroup => {
                                            childrenIds = childrenIds.concat(subGroup)
                                        });
                                });
                                stackIDs = stackIDs.concat(childrenIds);
                            }

                            stackIDs.forEach(elemId => {
                                delete array[action["group"]].guiElements[elemId];
                                delete array[action["group"]].tree[elemId];

                                // if the newly removed element is a selected element, un-select it
                                if (array[action["group"]].tree.selectedElementID === elemId)
                                    array[action["group"]].tree.selectedElementID = "";
                            });

                            return array;
                        };

                        if (action["ruleIndex"] !== -1)
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action["ruleIndex"]) return rule;
                                rule.rulePanelState.guiState = processRemoveElement(rule.rulePanelState.guiState);
                                return rule;
                            });
                        else
                            copiedState.newOrEditRule.guiState = processRemoveElement(copiedState.newOrEditRule.guiState);

                        break;

                    // job = {elementId: "", task: "SELECT_ELEMENT", value: true/false}
                    case "SELECT_ELEMENT":
                        let processSelectElement = (array) => {
                            let oldSelectedElementId = array[action["group"]].tree.selectedElementID;
                            // if selectedElement exists update its state as well
                            if (array[action["group"]].guiElements.hasOwnProperty(oldSelectedElementId))
                                array[action["group"]].guiElements[oldSelectedElementId] = {
                                    ...array[action["group"]].guiElements[oldSelectedElementId],
                                    selectedElement: !job["value"]
                                };
                            array[action["group"]].tree.selectedElementID = job["elementId"];
                            array[action["group"]].guiElements[job["elementId"]] = {
                                ...array[action["group"]].guiElements[job["elementId"]],
                                selectedElement: job["value"]
                            };
                            return array;
                        };

                        if (action["ruleIndex"] !== -1) {
                            copiedState.ruleTable = copiedState.ruleTable.map(rule => {
                                if (rule.index !== action["ruleIndex"]) return rule;
                                rule.rulePanelState.guiState = processSelectElement(rule.rulePanelState.guiState);
                                return rule;
                            });
                        }
                        else
                            copiedState.newOrEditRule.guiState = processSelectElement(copiedState.newOrEditRule.guiState);

                        break;

                    default:
                        break;
                }
            });
            return copiedState;

        default:
            return Object.assign({}, state);
    }
};

export default reducer;