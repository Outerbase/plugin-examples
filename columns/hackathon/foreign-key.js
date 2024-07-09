var privileges_$PLUGIN_ID = [
    "cellValue",
    "rowValue",
    "tableValue",
    "tableSchemaValue",
    "databaseSchemaValue",
    "configuration",
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
    preferredColumn = ""

    constructor(object) {
        this.theme = object?.theme ? object.theme : "light";
        this.preferredColumn = object?.preferredColumn ? object.preferredColumn : "";
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
        width: calc(100% - 16px);
        padding: 0 8px;
        position: relative;
        display: inline-block;
    }

    #inner {
        padding: 2px 8px;
        border-radius: 4px;
        background-color: #f0f0f0;
        color: #333;
        cursor: pointer;
        display: flex;
        gap: 4px;
        transition: background-color 0.2s ease;
        align-items: center;
    }

    #label {
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        color: var(--ob-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
    }

    svg {
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 16px;
        fill: var(--ob-text-color);
    }

    .dark #inner {
        background-color: #333;
    }

    #inner:hover {
        background-color: #e0e0e0;
    }

    .dark #inner:hover {
        background-color: #444;
    }

    #loader {
        animation: spin 1s linear infinite;
        -webkit-animation: spin 1s infinite linear;
        transform: translateY(1px);
    }

    @-webkit-keyframes spin {
        0%  {-webkit-transform: rotate(0deg);}
        100% {-webkit-transform: rotate(360deg);}   
    }
</style>

<div id="container" class="theme-container">
    <div id="outer" style="display: inline-block; max-width: 100%;">
        <div id="inner">
            <svg id="loader" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#000000" viewBox="0 0 256 256"><path d="M136,32V64a8,8,0,0,1-16,0V32a8,8,0,0,1,16,0Zm37.25,58.75a8,8,0,0,0,5.66-2.35l22.63-22.62a8,8,0,0,0-11.32-11.32L167.6,77.09a8,8,0,0,0,5.65,13.66ZM224,120H192a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16Zm-45.09,47.6a8,8,0,0,0-11.31,11.31l22.62,22.63a8,8,0,0,0,11.32-11.32ZM128,184a8,8,0,0,0-8,8v32a8,8,0,0,0,16,0V192A8,8,0,0,0,128,184ZM77.09,167.6,54.46,190.22a8,8,0,0,0,11.32,11.32L88.4,178.91A8,8,0,0,0,77.09,167.6ZM72,128a8,8,0,0,0-8-8H32a8,8,0,0,0,0,16H64A8,8,0,0,0,72,128ZM65.78,54.46A8,8,0,0,0,54.46,65.78L77.09,88.4A8,8,0,0,0,88.4,77.09Z"></path></svg>
            <div id="label"></div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"></path></svg>
        </div>
    </div>
</div>
`

class OuterbasePluginCell_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges_$PLUGIN_ID
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

    storeValueInCache(key, value) {
        const cacheName = 'pluginForeignKeyCache'
        const currentCache = JSON.parse(localStorage.getItem(cacheName)) ?? {}

        if (currentCache[key] === value) {
            return
        }

        // Check how many keys are in the cache
        const keys = Object.keys(currentCache)

        if (keys.length > 500) {
            // Remove the first 100 keys
            for (let i = 0; i < 100; i++) {
                delete currentCache[keys[i]]
            }
        }

        currentCache[key] = value
        localStorage.setItem(cacheName, JSON.stringify(currentCache))
    }

    getValueFromCache(key) {
        const cacheName = 'pluginForeignKeyCache'
        const currentCache = JSON.parse(localStorage.getItem(cacheName)) ?? {}

        return currentCache[key]
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        this.config = new OuterbasePluginConfig_$PLUGIN_ID(decodeAttributeByName_$PLUGIN_ID(this, "configuration"))

        let metadata = decodeAttributeByName_$PLUGIN_ID(this, "metadata")
        this.config.theme = metadata?.theme

        // console.log('FK Cell Config: ', this.config)
        // console.log('FK Cell Metadata: ', metadata)

        var element = this.shadow.querySelector(".theme-container")
        element.classList.remove("dark")
        element.classList.add(this.config.theme);

        this.render()
    }

    async render() {
        let cellValue = this.getAttribute('cellvalue')

        if (cellValue.length === 0) {
            cellValue = "NULL"
        }

        this.shadow.querySelector('#label').innerText = cellValue

        try {
            // Based on the information provided to our plugin, we need to identify
            // what the column constraints are and what database table it is linked to.
            // This will allow us to construct a SQL query to fetch the value from the
            // linked table.
            const column = this.getAttribute('columnName')
            const table = JSON.parse(this.getAttribute('tableSchemaValue')).name
            const schema = JSON.parse(this.getAttribute('tableSchemaValue')).schema ?? "public"
            const databaseSchemaValue = JSON.parse(this.getAttribute('databaseSchemaValue'))    
            const schemaColumns = databaseSchemaValue?.[schema]
            const schemaTable = schemaColumns.find(t => t.name === table)
            const constraints = schemaTable?.constraints

            if (constraints.length === 0) {
                this.shadow.querySelector('#loader').style.display = 'none'
                return
            }

            let fkName = ""
            let fkTable = ""
            let fkSchema = ""
            let cellValue = this.getAttribute('cellValue')
    
            // Loop through `constraints` and find where type === `FOREIGN KEY`
            for (const constraint of constraints) {
                if (constraint.type === "FOREIGN KEY" && constraint.table === table && constraint.column === column) {    
                    const fkColumn = constraint.columns?.[0]
                    fkName = fkColumn.name
                    fkTable = fkColumn.table
                    fkSchema = fkColumn.schema ?? "public"
                }
            }

            // Necessary information is graciously stored by Outerbase in the `localStorage`
            // for us to make the necessary network request to fetch the value from the linked table.
            const session = JSON.parse(localStorage.getItem('session'))
            const workspaceId = localStorage.getItem('workspace_id')
            const sourceId = localStorage.getItem('source_id')

            // Create a unique cache key based on the `schema.table.column.value`
            const cacheKey = `${fkSchema}.${fkTable}.${fkName}.${cellValue}`

            // If the `cacheKey` already exists in the cache, use the cached value instead
            // of making another network request to fetch it.
            if (this.getValueFromCache(cacheKey)) {
                this.shadow.querySelector('#label').innerText = this.getValueFromCache(cacheKey)
                this.shadow.querySelector('#loader').style.display = 'none'
                return
            }

            // When a cached value does not exist for this `schema.table.column.value`, fetch the value
            // from the database and store it in the cache for future re-use.
            await fetch(`https://app.dev.outerbase.com/api/v1/workspace/${workspaceId}/source/${sourceId}/query/raw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': session?.state?.session?.token
                },
                body: JSON.stringify({
                    query: `SELECT * FROM ${fkSchema}.${fkTable} WHERE ${fkName} = '${cellValue}'`,
                    options: {}
                })
            }).then(response => response.json()).then(data => {
                const item = data.response?.items?.[0] ?? {}
                const bestCandidate = this.detectGoodColumnCandidate(item)
                this.shadow.querySelector('#label').innerText = bestCandidate

                // Set cache
                this.storeValueInCache(cacheKey, bestCandidate)
                this.shadow.querySelector('#loader').style.display = 'none'
            })
        } catch (error) {
            console.error(error)
            this.shadow.querySelector('#loader').style.display = 'none'
        }
    }

    detectGoodColumnCandidate(column) {
        const preferredColumn = this.config.preferredColumn?.length > 0 ? column[this.config.preferredColumn] : null
        let firstStringFound = Object.entries(column).find(([key, value]) => typeof value === 'string')
        let bestMatch = null
        let bestMatchEmail = null
        let bestMatchPhone = null
        let bestMatchAddress = null

        for (const [key, value] of Object.entries(column)) {
            if (key.includes('name') && !bestMatch) {
                bestMatch = value
            } else if (key.includes('email') && !bestMatchEmail) {
                bestMatchEmail = value
            } else if (key.includes('phone') && !bestMatchPhone) {
                bestMatchPhone = value
            } else if (key.includes('address') && !bestMatchAddress) {
                bestMatchAddress = value
            }
        }

        return preferredColumn ? preferredColumn : bestMatch ?? bestMatchEmail ?? bestMatchPhone ?? bestMatchAddress ?? firstStringFound
    }
}






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
        height: 100%;
        overflow-y: scroll;
        padding: 40px 50px 65px 40px;
    }

    h1 {
        color: var(--ob-text-color);
    }
</style>

<div id="container">
    <h1>Select Foreign Key Column</h1>

    <select>
    
    </select>

    <button id="saveButton">Save View</button>
</div>
`

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return privileges
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

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
            // Clear FK cache
            const cacheName = 'pluginForeignKeyCache'
            localStorage.removeItem(cacheName)

            triggerEvent_$PLUGIN_ID(this, {
                action: OuterbaseEvent_$PLUGIN_ID.onSave,
                value: this.config
            })
        });

        // var saveButton = this.shadow.getElementById("saveButton");
        // saveButton.addEventListener("click", () => {
        //     triggerEvent(this, {
        //         action: OuterbaseEvent.onSave,
        //         value: this.config.toJSON()
        //     })
        // });

        // Listen to when the select option changes and store the selected option
        this.shadow.querySelector('select').addEventListener('change', (event) => {
            this.config.preferredColumn = event.target.value
        })

        this.fetchConstraintMetadata()
        this.render()
    }

    async fetchConstraintMetadata() {
        try {
            // Based on the information provided to our plugin, we need to identify
            // what the column constraints are and what database table it is linked to.
            // This will allow us to construct a SQL query to fetch the value from the
            // linked table.
            const column = this.getAttribute('columnName')
            const table = JSON.parse(this.getAttribute('tableSchemaValue')).name
            const schema = JSON.parse(this.getAttribute('tableSchemaValue')).schema ?? "public"
            const databaseSchemaValue = JSON.parse(this.getAttribute('databaseSchemaValue'))    
            const schemaColumns = databaseSchemaValue?.[schema]
            const schemaTable = schemaColumns.find(t => t.name === table)
            const constraints = schemaTable?.constraints

            // if (constraints.length === 0) {
            //     this.shadow.querySelector('#loader').style.display = 'none'
            //     return
            // }

            let fkName = ""
            let fkTable = ""
            let fkSchema = ""
            // let cellValue = this.getAttribute('cellValue')
    
            // Loop through `constraints` and find where type === `FOREIGN KEY`
            for (const constraint of constraints) {
                if (constraint.type === "FOREIGN KEY" && constraint.table === table && constraint.column === column) {    
                    const fkColumn = constraint.columns?.[0]
                    fkName = fkColumn.name
                    fkTable = fkColumn.table
                    fkSchema = fkColumn.schema ?? "public"
                }
            }

            // Necessary information is graciously stored by Outerbase in the `localStorage`
            // for us to make the necessary network request to fetch the value from the linked table.
            const session = JSON.parse(localStorage.getItem('session'))
            const workspaceId = localStorage.getItem('workspace_id')
            const sourceId = localStorage.getItem('source_id')

            // Create a unique cache key based on the `schema.table.column.value`
            // const cacheKey = `${fkSchema}.${fkTable}.${fkName}.${cellValue}`

            // // If the `cacheKey` already exists in the cache, use the cached value instead
            // // of making another network request to fetch it.
            // if (this.getValueFromCache(cacheKey)) {
            //     this.shadow.querySelector('#label').innerText = this.getValueFromCache(cacheKey)
            //     this.shadow.querySelector('#loader').style.display = 'none'
            //     return
            // }

            // When a cached value does not exist for this `schema.table.column.value`, fetch the value
            // from the database and store it in the cache for future re-use.
            await fetch(`https://app.dev.outerbase.com/api/v1/workspace/${workspaceId}/source/${sourceId}/query/raw`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': session?.state?.session?.token
                },
                body: JSON.stringify({
                    query: `SELECT * FROM ${fkSchema}.${fkTable} LIMIT 1`,
                    options: {}
                })
            }).then(response => response.json()).then(data => {
                const item = data.response?.items?.[0] ?? {}
                const keys = Object.keys(item)
                // console.log('First Row Keys: ', keys)

                // Add a new `option` in the `select` for each keys object
                let select = this.shadow.querySelector('select')
                keys.forEach(key => {
                    let option = document.createElement('option')
                    option.value = key
                    option.text = key
                    select.appendChild(option)
                })
            })
        } catch (error) {
            console.error(error)
        }
    }

    render() {
        
    }
}

// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
// window.customElements.define('outerbase-plugin-configuration', OuterbasePluginConfiguration_$PLUGIN_ID)

window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-configuration-$PLUGIN_ID', OuterbasePluginConfiguration_$PLUGIN_ID)
