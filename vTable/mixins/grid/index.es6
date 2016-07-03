import data from "./data.es6";
import computed from "./computed.es6";
import watch from "./watch.es6";
import event from './event.es6';
import filter from './filter.es6';
import methods from './methods.es6'

export default {

    mixins: [data, computed, watch, methods, filter, event],

    created: function() {
        this._chkIds = [];
        this._tableParam = ['pageSize', 'page', 'orderBy', 'ascending'];
    },

    ready: function() {
        var self = this,
            _tableParam = this._tableParam;

        var initParam  = this.initParam;

        if(typeof initParam == "object" && Object.prototype.toString.call(initParam) !== '[object Array]') {
            for(var k in initParam) {
                if(initParam.hasOwnProperty(k)) {
                    if($.inArray(k, _tableParam) != -1) {
                        this[k] = initParam[k]
                    } else {
                        this.searchParams[k] = initParam[k]
                    }
                }
            }
        }

        if(!this.primaryKey) {
            this.primaryKey = "id";
        }

        this.setPage(1, true);
    }

}


