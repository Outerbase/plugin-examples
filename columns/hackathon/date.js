var observableAttributes_$PLUGIN_ID = [
    // The value of the cell that the plugin is being rendered in
    "cellValue",
    // The configuration object that the user specified when installing the plugin
    "configuration",
    // Additional information about the view such as count, page and offset.
    "metadata"
]

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

    constructor(object) {
        this.theme = object?.theme ? object.theme : "light";
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
        user-select: none;
    }

    svg {
        flex-shrink: 0;
        flex-grow: 0;
        flex-basis: 16px;
        fill: var(--ob-text-color);
        cursor: pointer;
        padding: 2px;
        opacity: 0.5;
        transition: opacity 0.2s ease;
    }

    svg:hover {
        opacity: 1;
    }

    #date {
        padding: 2px 4px;
    }

    #date:hover {
        color: black;
        background-color: #e0e0e0;
        border-radius: 2px;
    }

    .dark #date:hover {
        color: white;
        background-color: #444;
    }

    #time {
        padding: 2px 4px;
    }

    #time:hover {
        color: black;
        background-color: #e0e0e0;
        border-radius: 2px;
    }

    .dark #time:hover {
        color: white;
        background-color: #444;
    }
</style>

<div id="container" class="theme-container">
    <span id="date">Jan 3 2024</span><span id="time">10:03 PM</span>
    <!--
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M117.66,170.34a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L72,188.69V48a8,8,0,0,1,16,0V188.69l18.34-18.35A8,8,0,0,1,117.66,170.34Zm96-96-32-32a8,8,0,0,0-11.32,0l-32,32a8,8,0,0,0,11.32,11.32L168,67.31V208a8,8,0,0,0,16,0V67.31l18.34,18.35a8,8,0,0,0,11.32-11.32Z"></path></svg>
    -->
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

        // When the SVG is clicked, we want to trigger an event to the parent
        this.shadow.querySelector('span').addEventListener('click', () => {
            triggerEvent_$PLUGIN_ID(this, {
                action: "onedit",
                value: true,
            })
        })
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
        // Get the cellValue
        const cellValue = this.getAttribute("cellValue")

        // Cast the cellValue into a date
        const date = new Date(cellValue)

        // The `date` is in UTC, so we need to convert it to the local timezone
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        

        // Format a date string with `MMM d yyyy`
        let dateString = date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        })

        // Remove comma from dateString
        dateString = dateString.replace(",", "")

        // Format another date string with `h:mm a`
        const timeString = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true
        })

        // Set `#date` to dateString
        this.shadow.querySelector("#date").textContent = dateString + ','

        // Set `#time` to timeString
        this.shadow.querySelector("#time").textContent = timeString
    }
}


// For Configuration view let them choose the SOURCE date (e.g. UTC) and the
// TARGET date (e.g. Local Timezone) and the format of the date and time.




var templateEditor_$PLUGIN_ID = document.createElement("template");
templateEditor_$PLUGIN_ID.innerHTML = `
<style>
    #container {
        transform: translateY(4px);
        margin-top: 4px;
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
</style>

<div id="container" class="theme-container">
    <astra-calendar single-month-view></astra-calendar>
</div>
`;

class OuterbasePluginEditor_$PLUGIN_ID extends HTMLElement {
    static get observedAttributes() {
        return observableAttributes_$PLUGIN_ID;
    }

    config = new OuterbasePluginConfig_$PLUGIN_ID({})

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
        this.render()
    }

    render() {
        
    }
}


// DO NOT change the name of this variable or the classes defined in this file.
// Changing the name of this variable will cause your plugin to not work properly
// when installed in Outerbase.
// window.customElements.define('outerbase-plugin-cell', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-cell-$PLUGIN_ID', OuterbasePluginCell_$PLUGIN_ID)
window.customElements.define('outerbase-plugin-editor-$PLUGIN_ID', OuterbasePluginEditor_$PLUGIN_ID)