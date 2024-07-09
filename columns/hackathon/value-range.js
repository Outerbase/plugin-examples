var observableAttributes_$PLUGIN_ID = [
    // The value of the cell that the plugin is being rendered in
    "cellValue",
    // The configuration object that the user specified when installing the plugin
    "configuration",
    // Additional information about the view such as count, page and offset.
    "metadata"
]

var OuterbaseEvent_$PLUGIN_ID = {
    // The user has triggered an action to save updates
    onSave: "onSave",
}

var OuterbaseColumnEvent_$PLUGIN_ID = {
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
    theme = "light"
    rangeOptions = []

    constructor(object) {
        this.theme = object?.theme ? object.theme : "light";
        this.rangeOptions = object?.rangeOptions ? object.rangeOptions : [];
    }
}

var triggerEvent_$PLUGIN_ID = (fromClass, data) => {
    const event = new CustomEvent("custom-change", {
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
        ?.replace(/&#39;/g, "'");
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
var templateCell_$PLUGIN_ID = document.createElement('template')
templateCell_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        height: 100%;
        width: calc(100% - 16px);
        padding: 0 8px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    span {
        color: #333;
        cursor: pointer;
        display: flex;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        color: var(--ob-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
        flex: 1;
    }

    #indicator {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        background-color: #f0f0f0;
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 8px;
    }
</style>

<div id="container" class="theme-container">
    <div id="indicator"></div>
    <span></span>
</div>
`

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID
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
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))

        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        var element = this.shadow.querySelector(".theme-container")
        element.classList.remove("dark")
        element.classList.add(this.config.theme);
    }

    render() {
        let cellValue = this.getAttribute('cellvalue')

        if (cellValue.length === 0) {
            cellValue = "NULL"
        }

        this.shadow.querySelector('span').innerText = cellValue

        // Get the indicator element
        const indicator = this.shadow.querySelector("#indicator")

        if (cellValue === "NULL") {
            indicator.style.backgroundColor = "transparent"
            return
        }

        let number = Number(cellValue)
        let rangeOptions = this.config.rangeOptions

        for (let i = 0; i < rangeOptions.length; i++) {
            let range = rangeOptions[i]
            let value = Number(range.value)

            if (range.operator === ">") {
                if (number > value) {
                    indicator.style.backgroundColor = range.color
                    return
                }
            } else if (range.operator === ">=") {
                if (number >= value) {
                    indicator.style.backgroundColor = range.color
                    return
                }
            } else if (range.operator === "<") {
                if (number < value) {
                    indicator.style.backgroundColor = range.color
                    return
                }
            } else if (range.operator === "<=") {
                if (number <= value) {
                    indicator.style.backgroundColor = range.color
                    return
                }
            } else if (range.operator === "=") {
                if (number === value) {
                    indicator.style.backgroundColor = range.color
                    return
                }
            }
        }

        // If the indicator is less than 5, set the color to red
        // let number = parseInt(cellValue)
        // if (number <= 5) {
        //     indicator.style.backgroundColor = "#fafafa"
        // } else if (number > 5 && number < 10) {
        //     indicator.style.backgroundColor = "#a8a29e"
        // } else {
        //     indicator.style.backgroundColor = "#44403c"
        // }
        
    }
}







// SQL to get range of integer values:
// ----
// SELECT MIN(column_name) AS MinValue, MAX(column_name) AS MaxValue
// FROM table_name;
// ----
// Put the above in a configuration view so we can quickly sample the data
// and provide a range of values to the user for their behalf.
// May also allow them to put a MIN and MAX in as well, or define
// values to indicator colors themselves.

/**
 * ******************
 * Configuration View
 * ******************
 * 
 *  ░░░░░░░░░░░░░░░░░
 *  ░░░░░▀▄░░░▄▀░░░░░
 *  ░░░░▄█▀███▀█▄░░░░
 *  ░░░█▀███████▀█░░░
 *  ░░░█░█▀▀▀▀▀█░█░░░
 *  ░░░░░░▀▀░▀▀░░░░░░
 *  ░░░░░░░░░░░░░░░░░
 * 
 * When a user either installs a plugin onto a table resource for the first time
 * or they configure an existing installation, this is the view that is presented
 * to the user. For many plugin applications it's essential to capture information
 * that is required to allow your plugin to work correctly and this is the best
 * place to do it.
 * 
 * It is a requirement that a save button that triggers the `OuterbaseEvent.onSave`
 * event exists so Outerbase can complete the installation or preference update
 * action.
 */
var templateConfiguration = document.createElement("template")
templateConfiguration.innerHTML = `
<style>
    #container {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }

    h1 {
        color: var(--ob-text-color);
    }

    #range-definitions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .range-option {
        display: flex;
        flex-direction: row;
        gap: 8px;
        align-items: center;
    }

    .indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #FF0000;
    }
</style>

<div id="container" class="theme-container">
    <h1>Select Range Options</h1>

    <div id="options">
        <span>Min Value: </span>
        <input type="number" id="minValue" value="0" min="0" max="100">

        <span>Max Value: </span>
        <input type="number" id="maxValue" value="100" min="0" max="100">
    
        <button id="valueRangeApply">Apply</button>
    </div>

    <div id="range-definitions">
        
    </div>

    <astra-button id="addRange" size="compact">Add Range</astra-button>

    <astra-button size="compact" id="saveButton">Save View</astra-button>
</div>
`

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})
    minValue = 0
    maxValue = 50
    rangeOptions = [
        // { color: "#FF0000", operator: ">", value: 5 },
        // { color: "#00FF00", operator: "<=", value: 5 }
    ]

    constructor() {
        super()

        this.shadow = this.attachShadow({ mode: "open" })
        this.shadow.appendChild(templateConfiguration.content.cloneNode(true))
    }

    connectedCallback() {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))
        this.config.cellValue = decodeAttributeByName_$PLUGIN_ID(this, "cellValue")

        var saveButton = this.shadow.getElementById("saveButton");
        saveButton.addEventListener("click", () => {
            this.config.rangeOptions = this.rangeOptions

            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseEvent_$PLUGIN_ID.onSave,
                value: this.config
            })
        });

        // When the `addRange` button is clicked add a new entry to this.rangeOptions
        var addRangeButton = this.shadow.getElementById("addRange")
        addRangeButton.addEventListener("click", () => {
            this.rangeOptions.push({ color: "#000000", operator: ">", value: 0 })
            this.render()
        })

        // If user clicks `valueRangeApply` button, update the minValue and maxValue
        var applyButton = this.shadow.getElementById("valueRangeApply")
        applyButton.addEventListener("click", () => {
            this.minValue = Number(this.shadow.getElementById("minValue").value)
            this.maxValue = Number(this.shadow.getElementById("maxValue").value)
            this.smartRangeLayout()
        })

        this.fetchMinMaxValues()
        this.render()
    }

    smartRangeLayout() {
        console.log('Min: ', this.minValue)
        console.log('Max: ', this.maxValue)

        // Based on the minValue and maxValue can we automatically create a range of values
        // for the user to select from. Try to figure out how many values to create and add
        // them to the `rangeOptions` array with default values.
        const range = this.maxValue - this.minValue
        const step = range / 5

        const defaultColors = ['#f5f5f5', '#d4d4d4', '#a3a3a3', '#525252', '#262626']

        this.rangeOptions = []

        for (let i = 0; i < 5; i++) {
            this.rangeOptions.push({ color: defaultColors[i], operator: ">", value: this.minValue + (step * i) })
        }

        // Revere the array
        this.rangeOptions.reverse()

        this.render()
    }

    async fetchMinMaxValues() {
        // Testing locally with this
        // this.minValue = 10
        // this.maxValue = 100
        // this.smartRangeLayout()
        // return


        try {
            // Based on the information provided to our plugin, we need to identify
            // what the column constraints are and what database table it is linked to.
            // This will allow us to construct a SQL query to fetch the value from the
            // linked table.
            const column = this.getAttribute('columnName')
            const table = JSON.parse(this.getAttribute('tableSchemaValue')).name
            const schema = JSON.parse(this.getAttribute('tableSchemaValue')).schema ?? "public"

            // Necessary information is graciously stored by Outerbase in the `localStorage`
            // for us to make the necessary network request to fetch the value from the linked table.
            const session = JSON.parse(localStorage.getItem('session'))
            const workspaceId = localStorage.getItem('workspace_id')
            const sourceId = localStorage.getItem('source_id')

            // SELECT DISTINCT column_name FROM table_name;

            // When a cached value does not exist for this `schema.table.column.value`, fetch the value
            // from the database and store it in the cache for future re-use.
            // SELECT MIN(column_name) AS MinValue, MAX(column_name) AS MaxValue FROM table_name;

            await fetch(`https://app.dev.outerbase.com/api/v1/workspace/${workspaceId}/source/${sourceId}/query/raw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': session?.state?.session?.token
                },
                body: JSON.stringify({
                    query: `SELECT MIN(${column}) AS minValue, MAX(${column}) AS maxValue FROM ${schema}.${table};`,
                    options: {}
                })
            }).then(response => response.json()).then(data => {
                const items = data.response?.items ?? []

                if (items.length) {
                    const first = items[0]
                    this.minValue = Number(first.minValue)
                    this.maxValue = Number(first.maxValue)
                }

                this.smartRangeLayout();
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        // Clear all the range definitions
        const rangeDefinitions = this.shadow.getElementById("range-definitions")
        rangeDefinitions.innerHTML = ""

        this.shadow.getElementById("minValue").value = this.minValue
        this.shadow.getElementById("maxValue").value = this.maxValue

        // const rangeDefinitions = this.shadow.getElementById("range-definitions")
        this.rangeOptions.forEach((item, index) => {
            const rangeItem = this.createRangeItem(index, item.color, item.operator, item.value)
            rangeDefinitions.appendChild(rangeItem)
        })

        // Detect a change in range item color field and update the indicator
        const rangeItems = this.shadow.querySelectorAll(".range-option")
        rangeItems.forEach(item => {
            item.querySelector("input[type='text']").addEventListener("change", event => {
                const indicator = item.querySelector(".indicator")
                indicator.style.backgroundColor = event.target.value

                // Update this value in the `this.rangeOptions` array, get the index from the `data-item-id` attribute
                const index = item.getAttribute("data-item-id")
                if (!index) return
                this.rangeOptions[index].color = event.target.value
            })
        })

        // Detect a change in range item operator field and update the indicator
        rangeItems.forEach(item => {
            item.querySelector("select").addEventListener("change", event => {
                // Update this value in the `this.rangeOptions` array, get the index from the `data-item-id` attribute
                const index = item.getAttribute("data-item-id")
                if (!index) return
                this.rangeOptions[index].operator = event.target.value
            })
        })

        // Detect a change in range item value field and update the indicator
        rangeItems.forEach(item => {
            item.querySelector("input[type='number']").addEventListener("change", event => {
                // Update this value in the `this.rangeOptions` array, get the index from the `data-item-id` attribute
                const index = item.getAttribute("data-item-id")
                if (!index) return
                this.rangeOptions[index].value = event.target.value
            })
        })

        // Detect a click on the remove button and remove the range item
        rangeItems.forEach(item => {
            item.querySelector("button").addEventListener("click", event => {
                const index = item.getAttribute("data-item-id")
                if (!index) return
                this.rangeOptions.splice(index, 1)
                this.render()
            })
        })
    }

    createRangeItem(index, color, operator, value) {
        const rangeItem = document.createElement("div")

        rangeItem.innerHTML = `
        <div class="range-option" data-item-id="${index}">
            <div class="indicator" style="background-color: ${color}"></div>
            <input type="text" value="${color}" style="width: 80px;" />
            <select>
                <option value=">" ${operator === '>' ? `selected` : null}>&gt;</option>
                <option value=">=" ${operator === '>=' ? `selected` : null}>&ge;</option>
                <option value="<" ${operator === '<' ? `selected` : null}>&lt;</option>
                <option value="<=" ${operator === '<=' ? `selected` : null}>&le;</option>
                <option value="=" ${operator === '=' ? `selected` : null}>=</option>
            </select>
            <input type="number" value="${value}" style="flex: 1;">
            <button>Remove</button>
        </div>
        `

        return rangeItem
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-configuration', OuterbasePluginConfiguration_$PLUGIN_ID)

window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
