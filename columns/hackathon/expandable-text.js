var observableAttributes_$PLUGIN_ID = [
    // The value of the cell that the plugin is being rendered in
    "cellValue",
    // The configuration object that the user specified when installing the plugin
    "configuration",
    // Additional information about the view such as count, page and offset.
    "metadata"
]

var OuterbaseEvent = {
    // The user has triggered an action to save updates
    onSave: "onSave",
}

var OuterbaseColumnEvent = {
    // The user has began editing the selected cell
    onEdit: "onEdit",
    // Stops editing a cells editor popup view and accept the changes
    onStopEdit: "onStopEdit",
    // Stops editing a cells editor popup view and prevent persisting the changes
    onCancelEdit: "onCancelEdit",
    // Updates the cells value with the provided value
    updateCell: "updateCell",
}

/**
 * ******************
 * Custom Definitions
 * ******************
 * 
 *  ░░░░░░░░░░░░░░░░░
 *  ░░░░▄▄████▄▄░░░░░
 *  ░░░██████████░░░░
 *  ░░░██▄▄██▄▄██░░░░
 *  ░░░░▄▀▄▀▀▄▀▄░░░░░
 *  ░░░▀░░░░░░░░▀░░░░
 *  ░░░░░░░░░░░░░░░░░
 * 
 * Define your custom classes here. We do recommend the usage of our `OuterbasePluginConfig_$PLUGIN_ID`
 * class for you to manage properties between the other classes below, however, it's strictly optional.
 * However, this would be a good class to contain the properties you need to store when a user installs
 * or configures your plugin.
 */
class OuterbasePluginConfig_$PLUGIN_ID {
    cellValue = undefined

    constructor(object) {
        
    }
}

var triggerEvent_$PLUGIN_ID = (fromClass, data) => {
    const event = new CustomEvent("plugin-change", {
        detail: data,
        bubbles: true,
        composed: true
    });

    fromClass.dispatchEvent(event);
}

var decodeAttributeByName_$PLUGIN_ID = (fromClass, name) => {
    const encodedJSON = fromClass.getAttribute(name);
    const decodedJSON = encodedJSON
        ?.replace(/&quot;/g, '"')
        ?.replace(/&#39;/g, "'")
        ?.replace(/&grave;/g, "`");
    return decodedJSON ? JSON.parse(decodedJSON) : {};
}

/**
 * **********
 * Cell View
 * **********
 * 
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░▄▄████▄▄░░░░░
 *  ░░░▄██████████▄░░░
 *  ░▄██▄██▄██▄██▄██▄░
 *  ░░░▀█▀░░▀▀░░▀█▀░░░
 *  ░░░░░░░░░░░░░░░░░░
 *  ░░░░░░░░░░░░░░░░░░
 * 
 * TBD
 */

// #container {
//     height: 100%;
//     min-height: 34px;
//     width: calc(100% - 16px);
//     padding: 0 8px;
//     position: relative;
//     display: flex;
//     align-items: center;
//     gap: 0px;
// }

// #container {
//     height: 100%;
//     min-height: 34px;
//     position: absolute;
//     top: 0;
//     left: 12px;
//     right: 8px;
//     bottom: 0;
//     display: flex;
//     align-items: center;
//     gap: 0px;
//     transform: translateY(-1px);
// }
var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        height: 100%;
        min-height: 34px;
        position: relative;
        padding: 0 8px 0 12px;
        display: flex;
        align-items: center;
        gap: 0px;
        transform: translateY(-1px);
    }

    input {
        height: 100%;
        flex: 1;
        background-color: transparent;
        border: 0;
        min-width: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: var(--ob-text-color);
        font-size: 12px;
        font-family: "Inter", sans-serif;
        outline: none;
        padding: 0;
    }

    input:focus {
        outline: none;
    }

    svg {
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 16px;
        fill: var(--ob-text-color);
        cursor: pointer;
        padding: 2px;
        opacity: 0;
        transition: opacity 0.2s ease;
    }

    #container:hover svg {
        opacity: 1;
    }

    #outer-container {
        position: relative;
        width: 100%;
        height: 34px;
    }
</style>

    <div id="container">
        <input type="text" id="image-value" placeholder="NULL">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,48V96a8,8,0,0,1-16,0V67.31l-50.34,50.35a8,8,0,0,1-11.32-11.32L188.69,56H160a8,8,0,0,1,0-16h48A8,8,0,0,1,216,48ZM106.34,138.34,56,188.69V160a8,8,0,0,0-16,0v48a8,8,0,0,0,8,8H96a8,8,0,0,0,0-16H67.31l50.35-50.34a8,8,0,0,0-11.32-11.32Z"></path></svg>
    </div>
`

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateCell_$PLUGIN_ID.content.cloneNode(true))
    }
    
    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.render()

        // When the SVG is clicked, we want to trigger an event to the parent
        this.shadow.querySelector('svg').addEventListener('click', () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: "onedit",
                value: true,
            })
        })

        // Listen to paste event on input
        this.shadow.querySelector('input').addEventListener('paste', (event) => {
            event.preventDefault()
            let text = event.clipboardData.getData('text/plain')
            document.execCommand('insertText', false, text)

            // Escape single and double quotes from `text`
            // text = JSON.stringify(text)
            // ?.replace(/"/g, '&quot;')
            // .replace(/'/g, '&#39;')

            // // Remove quotes around the text
            // text = text.substring(1, text.length - 1)

            // Send the event to the parent
            triggerEvent_$PLUGIN_ID(this, {
                action: "updatecell",
                value: text,
            })
        })

        // Detect when input value changes
        this.shadow.querySelector('input').addEventListener('input', (event) => {
            let cellValue = event.target.value

            // Escape quotes from cellValue
            // cellValue = JSON.stringify(cellValue)
            // ?.replace(/"/g, '&quot;')
            // .replace(/'/g, '&#39;') //cellValue.replace(/"/g, '\\"')//.replace(/'/g, "\\'").replace(/`/g, "\\`").replace(/\\/g, "\\\\")

            // Set the input value to the cell value
            this.setAttribute('cellvalue', cellValue)
            this.shadow.querySelector('input').value = cellValue

            // Send the event to the parent
            triggerEvent_$PLUGIN_ID(this, {
                action: "updatecell",
                value: cellValue,
            })
        })
    }

    render() {
        let cellValue = this.getAttribute('cellvalue')

        if (cellValue.length === 0 || (cellValue && cellValue.toLowerCase() === "null")) {
            this.shadow.querySelector('input').placeholder = "NULL"
        } else {
            this.shadow.querySelector('input').value = cellValue
        }
    }
}










var templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        transform: translateY(4px);
        margin-top: 4px;
        width: 400px;
        height: 200px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        overflow: hidden;
        background-color: #f5f5f5;
        color: var(--ob-text-color);
        display: flex;
        flex-direction: column;
        gap: 8px;
        font-family: Inter, sans-serif;
    }

    .dark {
        border: 1px solid #262626 !important;
        background-color: #171717 !important;
    }

    p {
        margin: 0;
        font-size: 12px;
        opacity: 0.5;
    }

    textarea {
        resize: none;
        flex: 1;
        background: #f5f5f5;
        border: transparent;
        font-family: Inter, sans-serif;
        font-size: 12px;
    }

    .dark textarea {
        background: #171717 !important;
        color: white;
    }

    textarea:focus { 
        outline: none !important;
    }

    #header {
        display: flex;
        flex: 1;
        padding: 16px 16px 4px 16px;
    }

    #footer {
        display: flex;
        gap: 8px;
        align-items: center;
        border-top: 1px solid #e5e5e5;
        padding: 8px 12px 8px 18px;
    }

    .dark #footer {
        border-top: 1px solid #262626;
    }

    #footer > span {
        font-size: 12px;
        font-family: Inter, sans-serif;
        flex: 1;
    }

    svg {
        fill: var(--ob-text-color);
        opacity: 0.5;
    }

    #cancel-button {
        color: var(--ob-text-color);
        padding: 8px 10px;
        font-size: 12px;
        line-height: 16px;
        cursor: pointer;
    }

    #null-placeholder {
        position: absolute;
        top: 18px;
        left: 18px;
        pointer-events: none;
    }
</style>

<div id="container" class="theme-container">
    <div id="header">
        <textarea></textarea>
        <p id="null-placeholder">NULL</p>
    </div>

    <div id="footer">
        <span id="character-count"></span>
        <div id="cancel-button">Discard</div>
        <astra-button id="update-button" size="compact">Update</astra-button>
    </div>
</div>
`;

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID;
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    tableSchema = {}
    metadata = {}

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateEditor_$PLUGIN_ID.content.cloneNode(true))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        var element = this.shadow.querySelector(".theme-container")
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }
    
    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.tableSchema = decodeAttributeByName_$PLUGIN_ID(this, "tableschemavalue")
        this.metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        const columnName = this.getAttribute('columnname')
        this.render()

        const availableColumns = this.tableSchema.columns

        // Get the column object from the table schema
        const column = availableColumns?.find(column => column.name === columnName)
        this.maximumCharacterCount = column?.character_maximum_length || null
        this.updateCharacterCount()

        // Listen to input changes in textarea
        this.shadow.querySelector('textarea').addEventListener('input', (event) => {
            const cellValue = event.target.value

            if (cellValue.length === 0 || (cellValue && cellValue.toLowerCase() === "null")) {
                this.shadow.querySelector('#null-placeholder').style.display = "block"
            } else {
                this.shadow.querySelector('#null-placeholder').style.display = "none"
            }

            this.updateCharacterCount()
        })
        
        // Listen to `update-button` and `cancel-button` clicks
        this.shadow.querySelector('#update-button').addEventListener('click', () => {
            // Get value of textarea
            let value = this.shadow.querySelector('textarea').value

            triggerEvent_$PLUGIN_ID(this, {
                action: "updatecell",
                value,
            })

            triggerEvent_$PLUGIN_ID(this, {
                action: "onstopedit"
            })

            // Close the editor after event has saved changes
            setTimeout(() => {
                triggerEvent_$PLUGIN_ID(this, {
                    action: "onstopedit"
                })
            }, 500);
        })

        this.shadow.querySelector('#cancel-button').addEventListener('click', () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: "oncanceledit",
                value: true,
            })
        })
    }

    render() {
        // Get the `cellValue` and populate it in the `textarea`
        let cellValue = this.getAttribute('cellvalue')
        this.shadow.querySelector('textarea').value = cellValue

        if (cellValue.length === 0 || (cellValue && cellValue.toLowerCase() === "null")) {
            // this.shadow.querySelector('textarea').placeholder = "NULL"
            this.shadow.querySelector('textarea').value = ""
            this.shadow.querySelector('#null-placeholder').style.display = "block"
        } else {
            this.shadow.querySelector('textarea').value = cellValue
            this.shadow.querySelector('#null-placeholder').style.display = "none"
        }

        // If `this.metadata.editable` is false, hide the button
        if (this.metadata.editable === false) {
            this.shadow.querySelector('#footer').style.display = "none"

            // Set textarea to readonly
            this.shadow.querySelector('textarea').readOnly = true
        } else {
            this.shadow.querySelector('#footer').style.display = "flex"

            // Set textarea to readonly
            this.shadow.querySelector('textarea').readOnly = false
        }
    }

    updateCharacterCount() {
        const currentCharacterLength = this.shadow.querySelector('textarea').value.length

        if (this.maximumCharacterCount) {
            const formattedCharacterLength = Number(currentCharacterLength).toLocaleString();
            const formattedMaxNumber = Number(this.maximumCharacterCount).toLocaleString();
            this.shadow.querySelector('#character-count').textContent = `${formattedCharacterLength}/${formattedMaxNumber}`;
        } else {
            this.shadow.querySelector('#character-count').textContent = ``;
        }

        // If the character length exceeds the maximum character count, show the text in red
        if (currentCharacterLength > this.maximumCharacterCount) {
            this.shadow.querySelector('#character-count').style.color = "#F0384E";
            this.shadow.querySelector('#character-count').style.opacity = 1;
        } else {
            this.shadow.querySelector('#character-count').style.color = "var(--ob-text-color)";
            this.shadow.querySelector('#character-count').style.opacity = 0.5;
        }
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-editor', OuterbasePluginEditor_$PLUGIN_ID)

window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)