class ajax_control {

    init() {
        // Get elements that trigger ajax events
        document.querySelectorAll("*[ajax-event]").forEach(element => {

            // Get the name of this trigger
            let event_name =  element.getAttribute("ajax-event")
            if(!event_name) return

            // Get the event that causes the trigger, default to click
            let trigger_name = element.getAttribute("ajax-trigger")
            if(!trigger_name) {
                // Default is 'click' unless element is a <form>
                // In which case, the default trigger is 'ajax-post-complete' event
                // This will run after the POST request completes
                trigger_name = element.tagName !== "FORM" ? "click" : "ajax-post-complete"
            }

            // When the event occurs, run the attached callbacks
            element.addEventListener(trigger_name, () => this.execute_event(event_name))

        })

        document.querySelectorAll("*[ajax-get]").forEach(element => {
            if(element.hasAttribute("ajax-defer")) return
            this.execute_element(element)
        })

        document.querySelectorAll("*[ajax-post]").forEach(element => {
            if(element.tagName !== "FORM") {
                console.error("ajax-post only forms on <form> elements")
                return
            }
            element.addEventListener("submit", (e) => this.capture_form_submit(e))
        })
    }


    /**
     * Executes an ajax event
     * @param {String} ajax_event_name The name of the ajax event
     */
    execute_event(ajax_event_name) {

        // Get any listening elements
        const listeners = document.querySelectorAll(`*[ajax-listener=${ajax_event_name}]`)

        listeners.forEach(element => this.execute_element(element))

    }


    /**
     * Carries out this element's HTTP request
     * @param {HTMLElement} element The element being executed
     */
    async execute_element(element) {
        // Make the GET/POST request
        let data = await this.server_request(element)
        // Process the response
        data = this.process_raw_data(data, element)
        
        if(element.hasAttribute("ajax-provide")) {
            this.feed_data_to_users(data, element)
        }

        this.write_data_to_element(data, element)

    }


    feed_data_to_users(data, element) {

        let provider_identifier = element.getAttribute("ajax-provide")

        let users = document.querySelectorAll(`*[ajax-use^=${provider_identifier}]`)

        users.forEach(consumer => this.feed_to_element(data, consumer))

    }

    /**
     * Used to pass data to a HTML element
     * @param {} raw_data The data being passed to the element
     * @param {HTMLElement} consumer The element being passed the data
     */
    feed_to_element(raw_data, consumer) {

        let data = this.process_raw_data(raw_data, consumer)

        this.write_data_to_element(data, consumer)

    }


    /**
     * Carries out the relevant server request for the given element
     * @param {HTMLElement} element The element in question
     */
    async server_request(element) {

        let raw_data

        if(element.hasAttribute("ajax-get")) {
            raw_data = await this.get(element.getAttribute("ajax-get"))
        } else if(element.hasAttribute("ajax-post")) {
            raw_data = await this.post(element.getAttribute("ajax-post"), new FormData(element))
        } else {
            console.error(element, "Has neither an ajax-get or ajax-post attribute")
        }

        return raw_data
    }

    async get(url) {
        try {
            let res = await fetch(url)
            if(!res.ok) throw `Status Code: ${res.status}`
            return await res.text()
        } catch (error) {
            console.error(`Something went wrong during ajax-get from: ${url}`, error)
            return null
        }
    }

    async post(url, data) {
        try {
            let res = await fetch(url,
            {
                method: "POST",
                body: data
            })
            if(!res.ok) throw `Status Code: ${res.status}`
            return await res.text()
        } catch (error) {
            console.error(`Something went wrong during ajax-get from: ${url}`, error)
            return null
        }
    }

    capture_form_submit(e) {
        e.preventDefault()
        this.execute_element(e.target)
    }

    /**
     * Ensure all data has been processed
     * @param {*} raw_data 
     * @param {*} element 
     */
    process_raw_data(raw_data, element) {

        let data = raw_data

        if(element.hasAttribute("ajax-use")) {
            data = this.use_data(data, element)
        }

        if(element.hasAttribute("ajax-parse-json")) {
            try {
                data = JSON.parse(data)
            } catch (error) {
                console.error("Error parsing JSON", error)
                return null
            }
        }

        if(element.hasAttribute("ajax-parser")) {
            try {
                data = window[element.getAttribute("ajax-parser")](data)
            } catch (error) {
                console.error("Error executing parser function:", element.getAttribute("ajax-parser"), ", ", error)
                return null
            }
        }

        return data
    }


    use_data(data, element) {
        let section = data
        let parts = element.getAttribute("ajax-use").split(".")
        parts.shift()
        parts.forEach(part => {
            section = section[part]
        })
        return section
    } 

    post_data(element) {

        let raw_data

        if(element.hasAttribute("ajax-get")) {
            raw_data = this.get(element.getAttribute("ajax-get"))
        } else if(element.hasAttribute("ajax-post")) {
            raw_data = this.post(element.getAttribute("ajax-post"), this.get_post_data(element))
        }
    }

    /**
     * Returns the data to be posted
     * @param {HTMLElement} element The Element that is making the POST request
     */
    get_post_data(formElement) {
        return new FormData(formElement)
    }


    /**
     * Writes data to the element
     * @param {HTMLElement} element The element being written to
     * @param {String} html The HTML string to be written
     */
    write_data_to_element(html, element) {

        if(element.hasAttribute("ajax-no-write")) return

        if(!element.hasAttribute("ajax-write-as-text")) {
            element.innerHTML = html
        } else {
            element.innerText = html
        }
    }

}


window.ajax_control = new ajax_control()

window.addEventListener("load", window.ajax_control.init())