function streamMessages() {
    
    var self = this;
    this.messages = [];
    
    /**
     * Initialise the function
     */
    this.init = function () {
        self.render();
    };
    
    /**
     * Add a message to the output
     * @param {object} msg An object with the properties 'message' (i.e. the message to display) and 'attributes' (attributes to 
     *  apply to the outputted message)
     */
    this.addMessage = function (msg) {
        self.renderItem($('#stream-message-output'), msg.message, msg.attributes);
        self.afterRender();
    };
    
    /**
     * Render each message
     * @param {array} msgs An array of objects. Each object has the properties 'message' (i.e. the message to display) and 'attributes'
     *  (attributes to apply to the outputted message)
     */
    this.render = function (msgs) {
        if (!msgs) {
            // No messages were supplied, use the message supplied at init
            msgs = self.messages;
        }
        $(function () {
            var smo = $('#stream-message-output');
            if (!smo.length) {
                // Create the output
                $('body').append('<div id="stream-message-output"></div>');
                smo = $('#stream-message-output');
            }
            for (var i = 0; i < msgs.length; i++) {
                var msg = msgs[i];
                self.renderItem(smo, msg.message, msg.attributes);
            }
            self.afterRender();
        });
    };
    
    /**
     * 
     * @param {jQuery} outputto Where to output the rendered output
     * @param {string} msg The message to be shown to the user
     * @param {object} attrs More attributes to be applied to the rendered item
     */
    this.renderItem = function (outputto, msg, attrs) {
        var main = getHtml('div', getHtml('div', getHtml('span', msg, null, 'stream-message-msg') 
                + getHtml('span', 'dismiss', null, 'stream-message-close'), null, 'stream-message-main')
                + getHtml('div', null, null, 'stream-message-bg'), null, 'stream-message', attrs);
        outputto.append(getHtml('div', main, null, 'stream-message-wrapper'));
    };
    
    /**
     * What to do after all of the messages have been rendered
     */
    this.afterRender = function () {
        $('.stream-message-close').unbind('click.streammessageclose').bind('click.streammessageclose', function () {
            var item = $(this).closest('.stream-message');
            item.animate({left: '-100%', opacity: 0}, 200, function () {
                item.remove();
            });
        });
    };
    
    /**
     * Generate a xhtml element, e.g. a div element
     * @syntax cHE.getHtml(tagname, body, htmlid, cssclass, {attribute: value});
     * @param {string} tagname The type of element to generate
     * @param {string} body The body to go with 
     * @param {string} id The id of this element
     * @param {string} cssclass The css class of this element
     * @param {object} moreattrs An object in the form {html_attribute: value, ...}
     * @returns {html} The relevant html as interpreted by the browser
     */
    function getHtml(tagname, body, id, cssclass, moreattrs) {
        var html = document.createElement(tagname);
        if (body) {
            html.innerHTML = body;
        }
        if (id) {
            html.id = id;
        }
        if (cssclass) {
            html.className = cssclass;
        }
        setAttributes(html, moreattrs);
        return html.outerHTML;
    };

    /**
     * Set the custom attributes
     * @param {object(DOMElement)} obj
     * @param {object(plain)} attrs
     * @returns {object(DOMElement)}
     */
    function setAttributes(obj, attrs) {
        if (CM.is_object(attrs)) {
            for (var x in attrs) {
                if (attrs.hasOwnProperty(x)) {
                    var val = attrs[x];
                    if (typeof val === 'boolean') {
                        // Convert booleans to their integer representations
                        val = val ? 1 : 0;
                    }
                    obj.setAttribute(x, val);
                }
            }
        }
    }

};
streamMessages = new streamMessages();

$(function () {
    streamMessages.init();
});