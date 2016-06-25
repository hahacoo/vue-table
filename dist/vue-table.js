(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VueTable = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {

	request: function request(method, uri, data) {
		var opts = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

		data = data || {};

		var req = new Promise(function (resolve, reject) {
			$.ajax(Object.assign({
				method: method,
				url: uri,
				data: data
			}, opts)).then(resolve, reject);
		});

		return req.then(function (data) {
			return data;
		}, function (xhr) {
			return 'network traffic anomaly' + xhr.status;
		});
	}
};

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = {

	data: function data() {
		return {
			cname: "vColumn"
		};
	},

	props: {
		"name": {
			type: String,
			required: true,
			default: "attr",
			validator: function validator(value) {
				return value != "operate";
			}
		},
		"title": {
			type: String,
			required: true,
			default: ""
		},
		"width": {
			default: '120px'
		},
		"template": null,
		"sortAble": {
			type: Boolean,
			default: true
		},
		"index": {
			default: 0
		}
	}

};

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

require("./style.less");

var _view = require("./view.html");

var _view2 = _interopRequireDefault(_view);

var _index = require("./comps/vColumn/index.es6");

var _index2 = _interopRequireDefault(_index);

var _index3 = require("./mixins/grid/index.es6");

var _index4 = _interopRequireDefault(_index3);

var _optionHelper = require("./mixins/optionHelper.es6");

var _optionHelper2 = _interopRequireDefault(_optionHelper);

var _tableTpl = require("./mixins/grid/tableTpl.html");

var _tableTpl2 = _interopRequireDefault(_tableTpl);

var _detailTpl = require("./mixins/grid/detailTpl.html");

var _detailTpl2 = _interopRequireDefault(_detailTpl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vTable = {

	props: {

		"tableId": {
			default: "",
			type: String,
			required: true
		},

		"url": String,

		"data": Array,

		"multiple": {
			type: Boolean,
			default: false
		},

		"showIndex": {
			type: Boolean,
			default: false
		},

		"colSelect": {
			type: Boolean,
			default: false
		},

		tableClass: {
			type: String,
			default: null
		},

		"primaryKey": {
			type: String,
			default: "id"
		},

		"detail": {
			type: String,
			default: _detailTpl2.default
		},
		"showPage": {
			type: Boolean,
			default: true
		},

		"initParam": {
			type: Object,
			default: {}
		},

		"method": {
			type: String,
			default: "GET"
		}
	},

	template: _view2.default,

	mixins: [_index4.default, _optionHelper2.default],

	partials: {
		tableTpl: _tableTpl2.default
	},

	ready: function ready() {
		var self = this,
		    columns = this.$children.filter(function (comp) {
			return comp.cname == "vColumn";
		});

		this.initColumns(columns);
	}

}; /**
    * vue-table component
    * 基于vue表格组件，支持分页、排序、列宽自调整
    * 数据集包括服务端数据、客户端数据
    */


exports.default = {
	install: function install(Vue, option) {
		Vue.component('v-column', _index2.default);
		Vue.component('v-table', vTable);
	}
};

},{"./comps/vColumn/index.es6":2,"./mixins/grid/detailTpl.html":6,"./mixins/grid/index.es6":9,"./mixins/grid/tableTpl.html":11,"./mixins/optionHelper.es6":13,"./style.less":14,"./view.html":15}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    computed: {
        colSpan: function colSpan() {
            if (!this.multiple && !this.showIndex && !this.colSelect) {
                return this.defaultColumns.length;
            } else if (this.multiple && this.colSelect) {
                return this.defaultColumns.length + 2;
            } else {
                return this.defaultColumns.length + 1;
            }
        },

        totalPage: function totalPage() {
            var total = Math.ceil(this.count / this.pageSize);
            if (total <= 0) {
                return 1;
            }
            return total;
        },

        totalChunk: function totalChunk() {
            return Math.ceil(this.totalPage / this.chunkNum);
        },

        pageChunk: function pageChunk() {
            return Math.ceil(this.page / this.chunkNum);
        },

        pageStart: function pageStart() {
            return (this.pageChunk - 1) * this.chunkNum + 1;
        }
    }
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {

    data: function data() {

        return {
            container_w: null,
            table_w: null,
            defaultColumns: [],
            operColumns: [],
            allColumns: [],
            sortColumns: {},
            colWidths: {},
            minWidth: 40,
            titles: {},
            templates: {},
            records: [],
            count: 0,
            pageSize: 10,
            page: 1,
            pageModel: 1,
            chunkNum: 10,
            orderBy: "",
            ascending: 1,
            searchParams: {},
            showJson: false,
            loaded: false,
            chkAll: false,
            chkIds: [],
            currRecord: {
                shown: false,
                record: {}
            },
            resizeAble: false,
            resizeLine: {
                col: '',
                left: 0
            },
            prePage: false,
            nextPage: false,
            preChunk: false,
            nextChunk: false
        };
    }
};

},{}],6:[function(require,module,exports){
module.exports = "<nav>\r\n    <label @click=\"showJson = false\" :class=\"{active: !showJson}\">键 / 值</label>\r\n    <label @click=\"showJson = true\" :class=\"{active: showJson}\">JSON</label>\r\n</nav>\r\n<pre v-html=\"currRecord.record | colFilter | json | highlight | xssFilter\" v-show=\"showJson\">\r\n</pre>\r\n\r\n<table class=\"detail-table\" v-show=\"!showJson\">\r\n    <col width=\"200px\"></col>\r\n    <col width=\"60px\"></col>\r\n    <tbody>\r\n        <tr v-for=\"val in currRecord.record\">\r\n            <template v-if=\"showField($key)\">\r\n\r\n                <td v-text=\"$key | colName\"></td>\r\n                <td class=\"oper-cell\">\r\n                    <a href=\"javascript:void(0)\" @click=\"filterAdd($key, val, true)\" title=\"过滤该条件\">\r\n                        <i class=\"glyphicon glyphicon-zoom-in\"></i>\r\n                    </a>\r\n                    <a href=\"javascript:void(0)\" @click=\"filterAdd($key, val, false)\" title=\"排除该条件\">\r\n                        <i class=\"glyphicon glyphicon-zoom-out\"></i>\r\n                    </a>\r\n                </td>\r\n                <td class=\"value-cell\" v-html=\"val | highlight | xssFilter\"></td>\r\n            </template>\r\n        </tr>\r\n    </tbody>\r\n</table>";

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = {
    ready: function ready() {
        var self = this,
            _tableParam = this._tableParam;

        window.onresize = function resize() {
            self.calcWidth();
        };

        this.$on("melon.grid.resize", function () {
            this.calcWidth();
        });

        this.$on("melon.grid.loaded", function (data) {
            this.loaded = true;
            this.chkAll = false;
            this.chkIds = [];

            this.$nextTick(function () {
                var tbody = this.$els.tbody;
                this.$compile(tbody);
            });
        });

        this.$on("melon.grid.refresh", function () {
            this.setPage();
        });

        this.$on("melon.grid.search", function (url, param) {
            if (arguments.length == 1) {
                if (typeof url == "string") {
                    this.url = url;
                } else if ((typeof url === "undefined" ? "undefined" : _typeof(url)) == "object" && !(url instanceof Array)) {
                    for (var k in url) {
                        if (url.hasOwnProperty(k)) {
                            if ($.inArray(k, _tableParam) != -1) {
                                this[k] = url[k];
                            } else {
                                this.searchParams[k] = url[k];
                            }
                        }
                    }
                }
            } else if (arguments.length == 2) {
                if (typeof url == "string") {
                    this.url = url;
                } else if ((typeof param === "undefined" ? "undefined" : _typeof(param)) == "object" && !(param instanceof Array)) {
                    for (var k in param) {
                        if (param.hasOwnProperty(k)) {
                            if ($.inArray(k, _tableParam) != -1) {
                                this[k] = param[k];
                            } else {
                                this.searchParams[k] = param[k];
                            }
                        }
                    }
                }
            }
            this.setPage(1);
        });

        this.scrollLeft = 0;

        var gridBody = $('.grid-body', this.$el),
            gridHead = $('.grid-head', this.$el);

        gridBody.scroll(function () {
            gridHead[0].scrollLeft = this.scrollLeft;
            self.scrollLeft = this.scrollLeft;
        });
    }
};

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = {

	filters: {

		formatterNum: function formatterNum(number) {
			if (typeof number != "string" && typeof number != "number") {
				return number;
			}
			var numStr = number.toString(),
			    len = numStr.length,
			    tmp = [];
			for (var i = len; i > 0;) {
				if (i < 3) {
					tmp.unshift(numStr.slice(0, i));
					break;
				}
				tmp.unshift(numStr.slice(i - 3, i));
				i -= 3;
			}
			return tmp.join(",");
		},

		highlight: function highlight(scontent) {
			if (!this.query || typeof scontent != "string") {
				return scontent;
			}

			var query = new RegExp(this.query, "ig");

			var content = scontent.replace(query, function (match) {
				return "<b class='soc-highlight'>" + match + "</b>";
			});

			return content;
		},

		xssFilter: function xssFilter(content) {
			if (typeof content != "string") {
				return content;
			}
			var regExp = new RegExp("<script.*?>.*?<\/script>", "ig");
			return content.replace(regExp, "");
		},

		colName: function colName(value) {
			if (this.titles[value]) return this.titles[value];
			return value;
		},

		tplRender: function tplRender(content, col, row) {
			var templates = this.templates;

			if (!templates[col]) return content;

			content = templates[col];

			if (typeof content == 'function') {
				content = content(row);
			}

			var regex;

			for (var key in row) {
				regex = new RegExp("{" + key + "}", "g");
				content = content.replace(regex, String(row[key]));
			}

			return content;
		},

		colFilter: function colFilter(value) {
			if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
				var filterCols = ["_id", "shown"];

				if (value instanceof Array) {
					return value.filter(function (col) {
						return _.indexOf(filterCols, col) == -1;
					});
				}

				var record = {};

				for (var k in value) {
					if (value.hasOwnProperty(k) && _.indexOf(filterCols, k) == -1) {
						record[k] = value[k];
					}
				}

				return record;
			}
		}

	}
};

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _data = require("./data.es6");

var _data2 = _interopRequireDefault(_data);

var _computed = require("./computed.es6");

var _computed2 = _interopRequireDefault(_computed);

var _watch = require("./watch.es6");

var _watch2 = _interopRequireDefault(_watch);

var _event = require("./event.es6");

var _event2 = _interopRequireDefault(_event);

var _filter = require("./filter.es6");

var _filter2 = _interopRequireDefault(_filter);

var _methods = require("./methods.es6");

var _methods2 = _interopRequireDefault(_methods);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

    mixins: [_data2.default, _computed2.default, _watch2.default, _methods2.default, _filter2.default, _event2.default],

    created: function created() {
        this._chkIds = [];
        this._tableParam = ['pageSize', 'page', 'orderBy', 'ascending'];
    },

    ready: function ready() {
        var self = this,
            _tableParam = this._tableParam;

        var initParam = this.initParam;

        if ((typeof initParam === "undefined" ? "undefined" : _typeof(initParam)) == "object" && Object.prototype.toString.call(initParam) !== '[object Array]') {
            for (var k in initParam) {
                if (initParam.hasOwnProperty(k)) {
                    if ($.inArray(k, _tableParam) != -1) {
                        this[k] = initParam[k];
                    } else {
                        this.searchParams[k] = initParam[k];
                    }
                }
            }
        }

        if (!this.primaryKey) {
            this.primaryKey = "id";
        }

        this.setPage();
    }

};

},{"./computed.es6":4,"./data.es6":5,"./event.es6":7,"./filter.es6":8,"./methods.es6":10,"./watch.es6":12}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _http = require("../../bases/http.es6");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    methods: {
        getElementLeft: function getElementLeft(element) {
            var actualLeft = element.offsetLeft;
            var current = element.offsetParent;
            while (current !== null) {
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        },

        resizeStart: function resizeStart(col, event) {
            this.resizeAble = true;
            this.resizeLine.col = col;
            this.resizeLine.left = event.clientX - this.getElementLeft(this.$els.content) + document.documentElement.scrollLeft + document.body.scrollLeft;
            this.mouseX = event.clientX;
        },

        resize: function resize(event) {
            if (this.resizeAble) {
                var dx = event.clientX - this.mouseX,
                    width = this.colWidths[this.resizeLine.col] + dx;

                if (width > this.minWidth) {
                    this.resizeLine.left = event.clientX - this.getElementLeft(this.$els.content) + document.documentElement.scrollLeft + document.body.scrollLeft;
                }
            }
        },

        resizeStop: function resizeStop(event) {
            if (this.resizeAble) {
                var dx = event.clientX - this.mouseX,
                    width = this.colWidths[this.resizeLine.col] + dx;

                if (width > this.minWidth) {
                    this.colWidths[this.resizeLine.col] = width;
                } else {
                    this.colWidths[this.resizeLine.col] = this.minWidth;
                }
                this.resizeAble = false;
            }
        },

        initId: function initId(col) {
            var prefix = 'mnGrid_';
            return prefix + col;
        },

        showField: function showField(key) {
            var filterCols = ["_id", "shown"];
            return _.indexOf(filterCols, key) == -1;
        },

        calcWidth: function calcWidth() {
            var self = this,
                columns = this.$children.filter(function (comp) {
                return comp.cname == "vColumn";
            }),
                childrens = columns.map(function (comp) {
                var props = comp._props,
                    col = {};
                for (var k in props) {
                    Object.prototype.hasOwnProperty.call(props, k) && (col[k] = comp[k]);
                }
                return col;
            });

            this.$nextTick(function () {
                this.initWidth(childrens);
            });
        },

        selectCol: function selectCol(col) {
            if (_.indexOf(this.defaultColumns, col) != -1) return false;
            return true;
        },

        changeCols: function changeCols() {
            this.showCols = true;
        },

        collapseClass: function collapseClass(record) {
            var isCurrent = !!this.currRecord.record && this.currRecord.record[this.primaryKey] == record[this.primaryKey];
            return {
                "glyphicon": true,
                "glyphicon-chevron-down": isCurrent,
                "glyphicon-chevron-right": !isCurrent
            };
        },

        sort: function sort(col) {
            if (!this.sortColumns[col]) return false;

            if (col === this.orderBy) {
                this.ascending = !!this.ascending ? 0 : 1;
            } else {
                this.ascending = 1;
            }

            this.orderBy = col;

            this.setPage(1);
        },

        collapse: function collapse(record) {
            var self = this;
            this.showJson && (this.showJson = false);
            if (this.currRecord.shown) {
                this.records.$remove(this.currRecord);
            }
            if (this.currRecord.record[this.primaryKey] == record[this.primaryKey]) {
                this.currRecord.record = {};
            } else {
                for (var i = 0; i < this.records.length; i++) {
                    if (record == this.records[i]) {
                        break;
                    }
                }
                var last = this.records.splice(i + 1);
                this.currRecord.shown = true;
                this.currRecord.record = this.records[i];
                this.records = this.records.concat(this.currRecord, last);
                this.$nextTick(function () {
                    var detail = document.getElementById('grid-detail');
                    this.$compile(detail);
                });
            }

            this.$emit("melon.grid.resize");
        },

        formatData: function formatData(data) {

            for (var k in data) {
                var value = data[k];

                if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {

                    if ($.isArray(value)) {

                        value.forEach(function (d, i) {
                            data[k + "[" + i + "]"] = d;
                        });
                    } else {

                        for (var j in value) {
                            data[k + "." + j] = value[j];
                        }
                    }

                    delete data[k];
                }
            }
        },

        serverCollection: function serverCollection() {
            var self = this,
                params = {};

            params.limit = this.pageSize;
            params.page = this.page;
            params.orderBy = this.orderBy;
            params.ascending = this.ascending;

            for (var key in this.searchParams) {
                params[key] = this.searchParams[key];
            }

            var method = this.method.toUpperCase();

            if ($.inArray(method, ['GET', 'POST']) == -1) method = 'GET';

            return _http2.default.request(method, this.url, params).then(function (res) {

                self.currRecord.record = {};
                var data = res.data;
                if (res && data && data.data instanceof Array) {
                    self.records = [];
                    self.records = data.data.map(function (d, i) {
                        self.formatData(d);
                        d._grid_index = (self.page - 1) * self.pageSize + i + 1;
                        d.shown = false;
                        return d;
                    });
                    self.count = data.count;
                    if (typeof data.page === 'number') {
                        self.page = data.page;
                    }
                } else {
                    self.records = [];
                    self.count = 0;
                    self.page = 1;
                }

                setTimeout(function () {
                    this.$dispatch("melon.grid.loaded", this.records);
                }.bind(self), 0);
            }, function (res) {
                self.records = [];
                self.count = 0;
            });
        },

        clientCollection: function clientCollection() {
            var self = this,
                page = this.page,
                limit = this.pageSize;

            this.records = this.data.slice((page - 1) * limit, page * limit).map(function (d, i) {
                self.formatData(d);
                d._grid_index = (self.page - 1) * self.pageSize + i + 1;
                d.shown = false;
                return d;
            });
            this.count = this.data.length;

            setTimeout(function () {
                this.$dispatch("melon.grid.loaded", this.records);
            }.bind(this), 0);
        },

        getData: function getData() {
            var self = this,
                params = {};
            this.loaded = false;

            if (this.data !== undefined) {
                this.clientCollection();
            } else {
                this.serverCollection();
            }
        },

        setPage: function setPage(page) {
            if (typeof page !== 'undefined') {
                this.page = page;
            }
            this.pageModel = this.page;
            this.getData();
        },

        gotoPage: function gotoPage() {
            if (isNaN(this.pageModel) || this.pageModel < 1) {
                this.pageModel = 1;
            } else if (parseInt(this.pageModel) > this.totalPage) {
                this.pageModel = this.totalPage;
            }

            this.setPage(this.pageModel);
        },

        setChunk: function setChunk(chunk) {
            var page = (this.pageChunk - 1 + chunk) * this.chunkNum + 1;
            this.setPage(page);
        }
    }
};

},{"../../bases/http.es6":1}],11:[function(require,module,exports){
module.exports = "\r\n<div class=\"grid-content\" :class=\"{hidden: calculating}\" v-el:content>\r\n    <!-- 标注线 -->\r\n    <div class=\"resize-line\" :style=\"{left : resizeLine.left + 'px'}\" v-show=\"resizeAble\" @mouseup.stop=\"resizeStop($event)\"></div>\r\n    <!-- 列表头部 -->\r\n    <div class=\"grid-head\" :style=\"{ width : container_w + 'px'}\" @mousemove=\"resize($event)\">\r\n        <div class=\"head-box head-scrollbar\">\r\n            <table class=\"table table-hover table-bordered table-striped head-table\" :style=\"{width: table_w + 'px'}\" :class=\"tableClass\" @mouseup.stop=\"resizeStop\">\r\n                <thead>\r\n                    <tr>\r\n                        <td v-if=\"multiple\" style=\"width : 50px;\">\r\n                            <div class=\"head-content\">\r\n                                <input type=\"checkbox\" v-model=\"chkAll\" :disabled=\"count == 0\">\r\n                            </div>\r\n                        </td>\r\n                        <td v-if=\"(showIndex && !multiple) || colSelect\" class=\"head-index\" style=\"width : 50px;\" >\r\n                            <div class=\"head-content\">\r\n                                <span v-if=\"!colSelect\">#</span>\r\n                            </div>\r\n                        </td>\r\n                        <th :id=\"initId(col)\" :style=\"{width: colWidths[col] + 'px'}\"  :class=\"{ 'resize-tr': resizeAble, 'sortable': sortColumns[col]}\" v-for=\"col in defaultColumns\"  >\r\n                            <span class=\"head-resize\" @mousedown.stop=\"resizeStart(col, $event)\" @click.stop>&nbsp;</span>\r\n                            <div class=\"head-content\" :title=\"col | colName\" @click=\"sort(col)\">\r\n                                {{col | colName}}\r\n                                <span class=\"head-sortable\" v-show=\"sortColumns[col] && orderBy != '' && col == orderBy\">\r\n                                  <span class=\"glyphicon glyphicon-triangle-top\" :class=\"{ 'sort-disabled': !ascending}\"></span>\r\n                                  <span class=\"glyphicon glyphicon-triangle-bottom\" :class=\"{ 'sort-disabled': ascending}\"></span>\r\n                                </span>\r\n                            </div>\r\n                        </th>\r\n                    </tr>\r\n                </thead>\r\n            </table>\r\n        </div>\r\n    </div>\r\n    <!-- 列表内容 -->\r\n    <div class=\"grid-body\" :style=\"{ width : container_w  + 'px'}\">\r\n        <div class=\"body-box\" :class=\"{ 'box-borderd': table_w < container_w, 'box-empty': count == 0}\">\r\n            <table class=\"table table-hover table-bordered table-striped grid-table\" :style=\"{width: table_w + 'px'}\" :class=\"tableClass\">\r\n                <tbody v-el:tbody>\r\n                <!--数据加载-->\r\n                <tr class=\"grid-loading\" v-if=\"!loaded\">\r\n                    <td colspan=\"{{colSpan}}\">\r\n                        <ul class=\"loading-content\">\r\n                            <li class=\"loading-circle\"></li>\r\n                            <li class=\"loading-circle\"></li>\r\n                            <li class=\"loading-circle\"></li>\r\n                        </ul>\r\n                    </td>\r\n                </tr>\r\n\r\n                <tr v-for=\"rec in records\" v-if=\"loaded\">\r\n                    <td v-if=\"multiple && !rec.shown\" style=\"width: 50px\">\r\n                        <div class=\"head-content\">\r\n                            <input type=\"checkbox\" v-model=\"chkIds\" value=\"{{rec[primaryKey]}}\" @click=\"\">\r\n                        </div>\r\n                    </td>\r\n                    <td v-if=\"((showIndex && !multiple) || colSelect) && !rec.shown\" class=\"grid-arrow\" style=\"width: 50px\">\r\n                        <a v-if=\"colSelect\" href=\"javascript:void(0);\" :class=\"collapseClass(rec)\" @click=\"collapse(rec)\"></a>\r\n                        <span v-else>{{rec._grid_index}}</span>\r\n                    </td>\r\n                    <td :tr-id=\"'td_' + initId(col)\" v-for=\"col in defaultColumns\" v-if=\"!rec.shown\" :style=\"{width: colWidths[col] + 'px'}\" v-html=\"rec[col] | tplRender col rec | highlight | xssFilter \">\r\n                    </td>\r\n                    <!--下拉详情列-->\r\n                    <td id=\"grid-detail\" class=\"detail-wrap\" v-if=\"rec.shown\" colspan=\"{{colSpan}}\" v-html=\"detail\">\r\n                    </td>\r\n                </tr>\r\n                <tr v-if=\"loaded && count == 0\">\r\n                    <td colspan=\"{{colSpan}}\">\r\n                        无数据显示\r\n                    </td>\r\n                </tr>\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>\r\n\r\n<!-- 分页控制 -->\r\n<nav class=\"grid-footer\">\r\n\r\n    <ul class=\"pagination grid-pagination\" v-if=\"showPage\">\r\n        <li :class=\"{'pagination-disabled': page == 0 || pageChunk == 1}\">\r\n            <a href=\"javascript:void(0);\" @click=\" (page != 0 && pageChunk != 1) && (setChunk(-1))\"><<</a>\r\n        </li>\r\n\r\n        <li :class=\"{'pagination-disabled': page == 0 || page == 1}\">\r\n            <a href=\"javascript:void(0);\" @click=\"(page != 1 && page != 0) && (setPage(page - 1))\"><</a>\r\n        </li>\r\n\r\n        <li>\r\n            <span>共{{totalPage}}页，跳转至</span>\r\n            <input class=\"pagination-page\" type=\"text\" size=\"2\" v-model=\"pageModel\" @keyup.13.stop.prevent=\"gotoPage()\" number lazy>\r\n        </li>\r\n\r\n        <li :class=\"{'pagination-disabled': page == 0 || page == totalPage }\">\r\n            <a href=\"javascript:void(0);\" @click=\"(page != 0 && page != totalPage) && (setPage(page + 1))\">></a>\r\n        </li>\r\n\r\n        <li :class=\"{'pagination-disabled': page == 0 || pageChunk == totalChunk}\">\r\n            <a href=\"javascript:void(0);\" @click=\"(page != 0 && pageChunk != totalChunk) && (setChunk(1))\">>></a>\r\n        </li>\r\n    </ul>\r\n\r\n    <span class=\"pagination-info\">\r\n        共{{count | formatterNum}}记录\r\n    </span>\r\n\r\n</nav>";

},{}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    watch: {
        "chkAll": function chkAll(value) {
            if (value) {
                for (var i = 0; i < this.records.length; i++) {
                    var primaryKey = this.records[i][this.primaryKey];
                    if (_.indexOf(this.chkIds, primaryKey) == -1) {
                        this.chkIds.push(primaryKey);
                    }
                }
            } else {
                this.chkIds = [];
            }

            this.$dispatch(this.tableId + 'mn_table.checkAll', this.chkIds.slice());
        },

        "chkIds": function chkIds(value) {
            var curLen = value.length,
                preLen = this._chkIds.length;

            if (curLen > 0) {
                if (curLen > preLen) {
                    this.$dispatch(this.tableId + 'mn_table.check', value.slice(-1)[0], value);
                }
            }
            this._chkIds = value.slice();
        },

        "defaultColumns": function defaultColumns(val) {
            this.$emit("melon.grid.resize");
        },

        "pageSize": function pageSize() {
            this.setPage();
        },

        "colWidths": {
            deep: true,
            handler: function handler(val, oldVal) {
                var table_w;
                if (!this.multiple && !this.showIndex && !this.colSelect) {
                    table_w = 0;
                } else if (this.multiple && this.colSelect) {
                    table_w = 100;
                } else {
                    table_w = 50;
                }
                for (var col in val) {
                    table_w += val[col];
                }
                this.$nextTick(function () {
                    this.table_w = table_w;
                });
            }
        }
    }
};

},{}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * 表格列格式化
 */
exports.default = {

	methods: {

		initColumns: function initColumns(columns) {
			var self = this,
			    childrens = columns.map(function (comp) {
				var props = comp._props,
				    col = {};

				for (var k in props) {
					if (Object.prototype.hasOwnProperty.call(props, k)) col[k] = comp[k];
				}

				return col;
			}),
			    i = 0,
			    len = childrens.length;

			childrens.sort(function (cur, next) {
				return parseInt(cur.index) - parseInt(next.index);
			});

			this.initWidth(childrens);

			for (; i < len; i++) {
				this.setColumn(childrens[i], true);
			}
		},

		setColumn: function setColumn(col, initWidth) {
			this.defaultColumns.push(col.name);
			this.sortColumns[col.name] = col.sortAble;
			this.titles[col.name] = col.title;
			this.templates[col.name] = col.template;
		},

		initWidth: function initWidth(columns) {
			var self = this;

			var colWidths = this.colWidths,
			    reg = /^([1-9]\d*)(px|%)$/i,
			    perTd = [],
			    pxTd = [],
			    indexWidth = 50,
			    reportW = 0,
			    width = this.$el.offsetWidth;

			this.container_w = width;

			if (!this.multiple && !this.showIndex && !this.colSelect) {
				reportW = width;
			} else if (this.multiple && this.colSelect) {
				reportW = width - indexWidth * 2;
			} else {
				reportW = width - indexWidth;
			}

			var len = columns.length,
			    i = 0;

			if (len == 0) return;

			var defaultWidth = 120,
			    pxSum = 0,
			    perSum = 0;

			for (; i < len; i++) {
				var tdWidth = columns[i].width,
				    result = reg.exec(tdWidth);

				if (result === null) {
					pxTd.push({ name: columns[i].name, width: defaultWidth });
					pxSum += defaultWidth;
				} else {
					tdWidth = +result[1];
					if (result[2] === 'px') {
						pxTd.push({ name: columns[i].name, width: tdWidth });
						pxSum += tdWidth;
					} else {
						perTd.push({ name: columns[i].name, width: tdWidth });
						perSum += tdWidth;
					}
				}
			}

			if (pxSum >= reportW) {
				perTd.forEach(function (td) {
					self.$set('colWidths.' + td.name, 120);
				});
			} else {
				var usable = reportW - pxSum;

				if (perTd.length == 0) {
					pxTd[0].width += usable;
				} else {
					if (perSum < 100) {
						perTd[0].width += 100 - perSum;
					}
					perTd.forEach(function (td) {
						self.$set('colWidths.' + td.name, Math.floor(td.width / 100 * usable));
					});
				}
			}

			pxTd.forEach(function (td) {
				self.$set('colWidths.' + td.name, td.width);
			});
		}
	}
};

},{}],14:[function(require,module,exports){
(function() { var head = document.getElementsByTagName('head')[0]; var style = document.createElement('style'); style.type = 'text/css';var css = "@-webkit-keyframes 'loading'{from{opacity:.2}to{-webkit-transform:scale(1.2);opacity:1}}.melon-grid{width:100%;border:1px solid #ddd;border-radius:4px;overflow:hidden}.melon-grid .col-label{display:block;margin:10px 0}.melon-grid .grid-content{width:100%;position:relative}.melon-grid .grid-content .resize-line{position:absolute;height:100%;border:1px dashed #CBCBCB;cursor:col-resize}.melon-grid .grid-content .grid-head{border-bottom:1px solid #ddd;background-color:#f2f2f2;overflow:hidden}.melon-grid .grid-content .grid-head .head-scrollbar{padding-right:20px}.melon-grid .grid-content .grid-head .head-scrollbar::-webkit-scrollbar{visibility:hidden}.melon-grid .grid-content .grid-head .head-scrollbar::-webkit-scrollbar-track{background:#f1f1f1}.melon-grid .grid-content .grid-head .head-box{float:left;box-sizing:content-box;overflow-x:hidden}.melon-grid .grid-content .grid-head .head-box .head-table{margin:0;table-layout:fixed;border:none}.melon-grid .grid-content .grid-head .head-box .head-table tr>th,.melon-grid .grid-content .grid-head .head-box .head-table tr>td{text-align:left;vertical-align:middle;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;border-left:none;border-top:none;border-bottom:none;padding:2px;padding-right:0}.melon-grid .grid-content .grid-head .head-box .head-table tr>th.sortable,.melon-grid .grid-content .grid-head .head-box .head-table tr>th.sortable{cursor:pointer}.melon-grid .grid-content .grid-head .head-box .head-table .resize-tr{cursor:col-resize}.melon-grid .grid-content .grid-head .head-box .head-table .head-content{height:35px;line-height:35px;padding:0 6px}.melon-grid .grid-content .grid-head .head-box .head-table .head-resize{height:35px;display:block;float:right;cursor:col-resize}.melon-grid .grid-content .grid-head .head-box .head-table .head-resize:hover{background-color:#E2E2E2}.melon-grid .grid-content .grid-head .head-box .head-table .head-sortable{font-size:12px;position:relative}.melon-grid .grid-content .grid-head .head-box .head-table .head-sortable>span:first-child{position:absolute;top:-3px;left:3px}.melon-grid .grid-content .grid-head .head-box .head-table .head-sortable>span:last-child{position:absolute;top:6px;left:3px}.melon-grid .grid-content .grid-head .head-box .head-table .head-sortable .sort-disabled{opacity:.35}.melon-grid .grid-content .grid-body{height:402px;overflow-y:auto}.melon-grid .grid-content .grid-body .body-box{border-bottom:1px solid #ddd;float:left}.melon-grid .grid-content .grid-body .body-box .grid-table{margin-bottom:0;table-layout:fixed;box-sizing:content-box;border:none}.melon-grid .grid-content .grid-body .body-box .grid-table tr>th,.melon-grid .grid-content .grid-body .body-box .grid-table tr>td{height:40px;text-align:left;vertical-align:middle;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;border-left:none;border-top:none}.melon-grid .grid-content .grid-body .body-box .grid-table tr>td:last-child{border-right:none}.melon-grid .grid-content .grid-body .body-box .grid-table tr:last-child>td{border-bottom:none}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-loading{height:400px;background-color:inherit}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-loading .loading-content{width:200px;height:50px;margin:0 auto;list-style:none;display:-webkit-flex;-webkit-align-items:center;-webkit-justify-content:center}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-loading .loading-content .loading-circle{width:20px;height:20px;border-radius:10px;background-color:#DDD;margin:0 10px;float:left}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-loading .loading-content .loading-circle:first-child{-webkit-transform:scale(0);-webkit-animation:loading .8s infinite alternate}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-loading .loading-content .loading-circle:nth-child(2){-webkit-transform:scale(0);-webkit-animation:loading .8s .3s infinite alternate}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-loading .loading-content .loading-circle:last-child{-webkit-transform:scale(0);-webkit-animation:loading .8s .6s infinite alternate}.melon-grid .grid-content .grid-body .body-box .grid-table .grid-arrow a{text-decoration:none}.melon-grid .grid-content .grid-body .body-box .grid-table pre{text-align:left;background-color:inherit;border:0}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-wrap{padding:20px}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-wrap nav{height:40px;line-height:40px;border-bottom:1px solid #ddd;margin-bottom:10px;text-align:left}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-wrap nav label{width:120px;text-align:center;cursor:pointer}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-wrap nav label:hover{border-bottom:2px solid #42a9f4}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-wrap nav label.active{border-bottom:2px solid #42a9f4}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-table{width:100%}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-table tr>th,.melon-grid .grid-content .grid-body .body-box .grid-table .detail-table tr>td{text-align:left;vertical-align:middle}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-table .oper-cell{width:60px}.melon-grid .grid-content .grid-body .body-box .grid-table .detail-table .value-cell{word-break:break-all;word-wrap:break-word}.melon-grid .grid-content .grid-body .body-box.box-borderd tr>td:last-child{border-right:1px solid #ddd}.melon-grid .grid-content .grid-body .body-box.box-empty{border-bottom:none}.melon-grid .grid-content .grid-body .body-box.box-empty tr{background-color:transparent}.melon-grid .grid-content .grid-body .body-box.box-empty tr:hover{background-color:transparent}.melon-grid .grid-content .grid-body .body-box.box-empty tr>td:last-child{border:none}.melon-grid .hidden{visibility:hidden}.melon-grid .grid-footer{overflow:hidden;background-color:#f2f2f2}.melon-grid .grid-footer ul.grid-pagination{margin:0;float:left;position:relative;left:50%}.melon-grid .grid-footer ul.grid-pagination li{float:left;position:relative;right:50%}.melon-grid .grid-footer ul.grid-pagination li span,.melon-grid .grid-footer ul.grid-pagination li a{margin:0;color:#91a0ad;padding:6px 6px;border:0;background-color:inherit}.melon-grid .grid-footer ul.grid-pagination li a:focus,.melon-grid .grid-footer ul.grid-pagination li a:hover{background-color:#fff}.melon-grid .grid-footer ul.grid-pagination li .pagination-page{line-height:1.42857143;border:1px solid #ddd;border-radius:4px;padding:2px;margin-top:3px;margin-right:6px}.melon-grid .grid-footer ul.grid-pagination li.pagination-disabled{opacity:.35;cursor:default}.melon-grid .grid-footer ul.grid-pagination li.pagination-disabled a{cursor:default}.melon-grid .grid-footer ul.grid-pagination li.pagination-disabled a:focus,.melon-grid .grid-footer ul.grid-pagination li.pagination-disabled a:hover{background-color:transparent}.melon-grid .grid-footer ul.grid-pagination .grid-info span{margin:0;border-top:0;border-right:0;border-bottom:0;color:#333;background-color:inherit}.melon-grid .grid-footer ul.grid-pagination .grid-info span:hover{background-color:rgba(255,255,255,0)}.melon-grid .grid-footer ul.grid-pagination .grid-empty-info span{border:0;color:#333;background-color:inherit}.melon-grid .grid-footer .pagination-info{float:right;line-height:1.42857143;padding:6px 6px}.melon-grid .grid-footer .grid-limit{margin-bottom:0}.grid-resize{user-select:none}";if (style.styleSheet){ style.styleSheet.cssText = css; } else { style.appendChild(document.createTextNode(css)); } head.appendChild(style);}())
},{}],15:[function(require,module,exports){
module.exports = "<div class=\"melon-grid\" :class=\"{'grid-resize': resizeAble}\" >\r\n\t<slot></slot>\r\n    <partial name=\"tableTpl\"></partial>\r\n</div>";

},{}]},{},[3])(3)
});