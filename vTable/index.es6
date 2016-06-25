/**
 * vue-table component
 * 基于vue表格组件，支持分页、排序、列宽自调整
 * 数据集包括服务端数据、客户端数据
 */
import "./style.less"
import template from "./view.html";
import vColumn from "./comps/vColumn/index.es6";
import grid from "./mixins/grid/index.es6";
import optionHelper from "./mixins/optionHelper.es6";
import tableTpl from "./mixins/grid/tableTpl.html";
import detailTpl from "./mixins/grid/detailTpl.html";

let vTable = {
	
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
			default: detailTpl
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

	template,

	mixins: [grid, optionHelper],

	partials: {
		tableTpl
	},
	
	ready: function() {
		var self = this,
			columns = this.$children.filter(function(comp) {
				return comp.cname == "vColumn";
			});

		this.initColumns(columns);

	}

}

export default {
	install: function(Vue, option) {
		Vue.component('v-column', vColumn)
		Vue.component('v-table', vTable)
	}
}

