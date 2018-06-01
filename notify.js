(function (global, factory) {
    "use strict";
    if (typeof exports !== "undefined" && typeof module !== "undefined") factory(exports, document.body, 8000);
    else factory(global.Notify = global.Materials || {}, document.body, 8000);
})(this, (function (exports, container, duration) {
    "use strict";
    var Promise = typeof Promise === "undefined" ? Promise : customPromiseFunction;

    function customPromiseFunction(callBack) {
        var catchList = [], thenList = [];
        this.then = function (callBack) {
            if (typeof callBack === "function") thenList.push(callBack);
            return this;
        };
        this.catch = function (callBack) {
            if (typeof callBack === "function") thenList.push(callBack);
            return this;
        };
        function resolve(result) { for (var index = 0; index < thenList.length; index++) thenList[index](result); }
        function reject(error) { for (var index = 0; index < catchList.length; index++) catchList[index](error); }
        setTimeout(function () { callBack(resolve, reject); }, 25);
    }


    /**
     * 
     * @typedef {Object} Identity
     * @property {function(): number} next
     * @property {number} id
     */

    /**
     * 
     * @typedef {Object} ModelList
     * @property {function(): void} init
     * @property {function(number): void} removeModel
     * @property {function(): void} addModel
     */

    /**
     * 
     * @typedef {Object} AbstractModel
     * @property {function(string, string): void} init
     * @property {function(): void} removeDom
     * @property {function(): void} goDormant
     * @property {function(number): void} setHeight
     * @property {function(): HTMLElement} getContainer
     * @property {function(): void} fill
     * @property {HTMLElement} dom
     * @property {string} data
     * @property {string} display
     * @property {ModelList} containingList
     */

    /**
     * @typedef NotifyModel
     * @property {function(string, string): void} init
     * @property {function(): void} removeDom
     * @property {function(): void} goDormant
     * @property {function(number): void} setHeight
     * @property {function(): HTMLElement} getContainer
     * @property {function(): void} fill
     * @property {HTMLElement} dom
     * @property {string} data
     * @property {string} display
     * @property {ModelList} containingList
     * @property {function(): string} getColor
     * @property {function(): string} getFaName
     */

    /**
     * @typedef RequestModel
     * @property {function(string, string): void} init
     * @property {function(): void} removeDom
     * @property {function(): void} goDormant
     * @property {function(number): void} setHeight
     * @property {function(): HTMLElement} getContainer
     * @property {function(): void} fill
     * @property {HTMLElement} dom
     * @property {string} data
     * @property {string} display
     * @property {ModelList} containingList
     * @property {function(): string} getColor
     * @property {function(): void} onClick
     * @property {function(): void} onCallBack
     * @property {function(): string} getInitials
     * @property {string} initials
     */

    /** @type {Identity} */
    var Identity = {
        next: function () {
            /** @type {Identity}*/ var self = this;
            return self.id++;
        },
        id: 0
    };

    /** @type {ModelList} */
    var ModelList = {
        init: function () {
            /** @type {ModelList}*/ var self = this;
            self.list = [];
            self.identity = createObject(Identity);
        },
        removeModel: function (id) {
            /** @type {ModelList}*/ var self = this;
            for (var index = 0; index < self.list.length; index++) {
                if (self.list[index].id == id) {
                    return self.list.splice(index, 1);
                } else {
                    self.list[index].setHeight(self.list.length - 1 - index);
                }
            }
            return null;
        },
        addModel: function (model) {
            /** @type {ModelList}*/ var self = this;
            model.id = self.identity.next();
            self.list.push(model);
            for (var index = 0; index < self.list.length; index++) {
                self.list[index].setHeight(self.list.length - index);
            }
        }
    };

    /** @type {AbstractModel} */
    var AbstractModel = {
        /** @param {string} display * @param {string} data */
        init: function (display, data) {
            /** @type {AbstractModel} */ var self = this;
            self.data = data;
            self.display = display;
            var button = EasyHtml.newButton("close outline-less");
            var func = function () { self.goDormant.call(self); };
            self.dom = EasyHtml.newDiv();
            self.getContainer().appendChild(self.dom);
            button.addEventListener("click", func);
            self.fill();
            self.dom.appendChild(button);
            self.dom.style.zIndex = 9999;
            setTimeout(func, duration);
            if (self.containingList) self.containingList.addModel(self);
        },
        removeDom: function () {
            /** @type {AbstractModel} */ var self = this;
            if (self.disposed) {
                if (self.containingList) self.containingList.removeModel(self.id);
                setTimeout(function () { self.getContainer.call(self).removeChild(self.dom); }, 1000);
            }
        },
        goDormant: function () {
            /** @type {AbstractModel} */ var self = this;
            if (!self.disposed) {
                self.disposed = true;
                self.dom.classList.add("fadeOutUp");
                self.dom.classList.remove("fadeInUp");
                self.dom.style.zIndex = 9998;
                setTimeout(function () { self.removeDom.call(self); }, 1000);
            }
        },
        /** @param {number} index */
        setHeight: function (index) {
            /** @type {AbstractModel} */ var self = this;
            self.dom.style.bottom = ((index - 1) * (self.dom.clientHeight + 5) + 5) + "px";
        },
        getContainer: function () { return (container || document.body); },
        fill: function () { },
        data: "",
        display: "",
        containingList: undefined
    };


    /** @type {NotifyModel} */
    var NotifyModel = createObject(AbstractModel);
    NotifyModel.fill = function () {
        /** @type {NotifyModel} */ var self = this;
        var container = self.dom;
        var faIcon = EasyHtml.newItalic("fa " + self.getFaName());
        var message = EasyHtml.newSpan();
        container.setAttribute("class", "js-notify notify fadeInUp " + self.getColor());
        message.innerHTML = String(self.data);
        container.appendChild(faIcon);
        container.appendChild(message);
    };
    NotifyModel.getColor = function () {
        /** @type {NotifyModel} */ var self = this;
        var type = NotifyTypes[self.display];
        if (type) return type;
        for (var key in NotifyTypes) {
            if (NotifyTypes[key] == self.display) return self.display;
        }
        return NotifyTypes.Info;
    };
    NotifyModel.getFaName = function () {
        /** @type {NotifyModel} */ var self = this;
        if (self.display == NotifyTypes.Success) return "fa-check-circle";
        if (self.display == NotifyTypes.Info) return "fa-info-circle";
        return "fa-exclamation-triangle";
    };
    var notifyList = createObject(ModelList);
    NotifyModel.containingList = notifyList;
    notifyList.init();

    /** @type {RequestModel} */
    var RequestModel = createObject(AbstractModel);
    RequestModel.fill = function () {
        /** @type {RequestModel} */ var self = this;
        var container = self.dom;
        var title = EasyHtml.newDiv("title");
        var message = EasyHtml.newSpan();
        title.innerHTML = self.getInitials();
        container.setAttribute("class", "js-notify request fadeInUp " + self.getColor());
        title.setAttribute("class", "title");
        message.innerHTML = String(self.data);
        container.addEventListener("click", function () { self.onClick.call(self); });
        container.appendChild(title);
        container.appendChild(message);
    };
    RequestModel.getColor = function () {
        /** @type {RequestModel} */ var self = this;
        var type = RequestTypes[self.display];
        if (type) return type;
        for (var key in RequestTypes) {
            if (RequestTypes[key] == self.display) return self.display;
        }
        return RequestTypes.MessageRequest;
    };
    RequestModel.onClick = function () {
        /** @type {RequestModel} */
        var self = this;
        if (self.onCallBack) {
            self.onCallBack();
            self.onCallBack = undefined;
            self.goDormant();
        }
    };
    RequestModel.getInitials = function () {
        /** @type {RequestModel} */ var self = this;
        var first = "<span class='first-name'>";
        var middle = "<span class='middle-name'>";
        var last = "<span class='last-name'>";
        var span = "</span>";
        var list = String(self.initials).split(" ");
        var length = list.length;
        if (!self.initials) return middle + "?" + span;
        if (length <= 0) return middle + "?" + span;
        return (length >= 2 ? (first + list[0][0] + span) : "") + (length != 2 ? (middle + list[Math.floor(length / 2)][0] + span) : "") + (length >= 2 ? (last + list[length - 1][0] + span) : "");// More than one
    };
    var requestList = createObject(ModelList);
    RequestModel.containingList = requestList;
    requestList.init();

    var NotifyTypes = {
        Success: "success",
        Warning: "warning",
        Danger: "danger",
        Info: "info"
    };

    var RequestTypes = {
        FriendRequest: "friend-request",
        GameRequest: "game-request",
        MessageRequest: "message-request"
    };

    /**
     * @param {string} display 
     * @param {string} data 
     * @returns {void}
     */
    function notify(display, data) {
        var model = createObject(NotifyModel);
        model.init(display, cleanText(data));
    }

    /**
     * @param {string} display - Type
     * @param {string} data - Message
     * @param {string} initials - Person, request is from
     * @param {function(): void} onCallBack - On click
     * @returns {void}
     */
    function showRequest(display, data, initials, onCallBack) {
        var model = createObject(RequestModel);
        if (typeof onCallBack === "function") model.onCallBack = onCallBack;
        if (typeof initials === "string") model.initials = initials;
        model.init(display, cleanText(data));
    }

    /**
     * Converts input to text, if it is not a string and removes first and last quote
     * @param {string} text - Text to be cleaned
     * @returns {void}
     */
    function cleanText(text) {
        return (typeof text === "string" ? text : JSON.stringify(text)).replace(/^"/g, empty).replace(/"$/g, empty);
    }

    /**
     * Accepts anything and returns an empty string
     * @returns {string} - Empty string
     */
    function empty() {
        return "";
    }

    /**
     * @param {string} title
     * @param {string} text
     * @param {Array<function(): void>} actionList
     * @param {Array<string>} textList
     * @returns {Promise<string>}
     */
    function alertUser(title, text, actionList, textList) {
        var wrapper = container || document.body;
        return new Promise(function (resolve) {
            var panel = EasyHtml.newDiv("notify-screen-panel");
            var optionList = EasyHtml.newList("button-list");
            var message = EasyHtml.newSpan("message", text);
            var heading = EasyHtml.newSpan("title", title);
            var box = EasyHtml.newDiv("box");
            box.appendChild(heading);
            box.appendChild(message);
            box.appendChild(optionList);
            panel.appendChild(box);
            wrapper.appendChild(panel);
            panel.addEventListener("click", function (event) {
                if (event.target === panel) hide();
            });
            function hide() {
                if (wrapper.contains(panel)) {
                    wrapper.removeChild(panel);
                }
            }
            for (var index = 0; index < actionList.length; index++) {
                var button = EasyHtml.newButton(undefined, textList[index]);
                var listItem = EasyHtml.newListItem(undefined);
                optionList.appendChild(listItem);
                listItem.appendChild(button);
                try { throw actionList[index]; } catch (action) {
                    button.addEventListener("click", getNewButtonListener(resolve, action, hide, index));
                }
            }
        });
    }

    /**
     * Creates a new function for the button listener
     * @param {Function} resolve 
     * @param {Function} action 
     * @param {Function} hide 
     * @param {number} index 
     * @returns {Function}
     */
    function getNewButtonListener(resolve, action, hide, index) {
        return function () {
            if (typeof action === "function") resolve(action());
            else resolve(index);
            hide();
        };
    }

    var EasyHtml = (function EasyHtmlIIFE() {

        /**
         * @param {string} [className=]
         * @returns {HTMLUListElement}
         */
        function newList(className) {
            var list = document.createElement("ul");
            if (className) list.className = className;
            return list;
        }

        /**
         * @param {string} [className=]
         * @param {string} [text=]
         * @returns {HTMLButtonElement}
         */
        function newButton(className, text) {
            var button = document.createElement("button");
            if (className) button.className = className;
            if (text) button.innerHTML = text;
            return button;
        }

        /**
         * @param {string} [className=]
         * @param {string} [text=]
         * @returns {HTMLDivElement}
         */
        function newDiv(className, text) {
            var div = document.createElement("div");
            if (className) div.className = className;
            if (text) div.innerHTML = text;
            return div;
        }

        /**
         * @param {string} [className=]
         * @param {string} [text=]
         * @returns {HTMLLIElement}
         */
        function newListItem(className, text) {
            var item = document.createElement("li");
            if (className) item.className = className;
            if (text) item.innerHTML = text;
            return item;
        }

        /**
         * @param {string} [className=]
         * @param {string} [text=]
         * @returns {HTMLElement}
         */
        function newItalic(className, text) {
            var italic = document.createElement("i");
            if (className) italic.className = className;
            if (text) italic.innerHTML = text;
            return italic;
        }

        /**
         * @param {string} [className=]
         * @param {string} [text=]
         * @returns {HTMLSpanElement}
         */
        function newSpan(className, text) {
            var span = document.createElement("span");
            if (className) span.className = className;
            if (text) span.innerHTML = text;
            return span;
        }

        return {
            newListItem: newListItem,
            newItalic: newItalic,
            newButton: newButton,
            newList: newList,
            newSpan: newSpan,
            newDiv: newDiv
        };
    })();

    /**
     * Creates a new instance of a function or prototype object
     * @param {T} prototype - prototype object or function
     * @template T
     * @returns {T}
     */
    function createObject(prototype) {
        if ("function" === typeof prototype) return Object.create(new prototype());
        else if ("object" === typeof prototype) return Object.create(prototype);
        else return null;
    }

    exports.RequestTypes = RequestTypes;
    exports.showRequest = showRequest;
    exports.NotifyTypes = NotifyTypes;
    exports.alertUser = alertUser;
    exports.notify = notify;
    return exports;
}));