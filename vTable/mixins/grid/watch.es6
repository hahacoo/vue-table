
export default {
    watch: {
        "chkAll"  : function(value) {
            if(value) {
                for(var i = 0; i < this.records.length; i ++) {
                    var primaryKey = this.records[i][this.primaryKey] + '';
                    if(_.indexOf(this.chkIds, primaryKey) == -1) {
                        this.chkIds.push(primaryKey);
                    }
                }
            } else {
                this.chkIds = [];
            }

            this.$dispatch(this.tableId + 'vue.table.checkAll', this.chkIds.slice())
        },

        "chkIds": function(value) {
            var curLen = value.length,
                preLen = this._chkIds.length;

            if(curLen > 0) {
                if(curLen > preLen) {
                    this.$dispatch(this.tableId + 'vue.table.check', value.slice(-1)[0], value)
                }
            }
            this._chkIds = value.slice();
        },

        "defaultColumns": function(val) {
            this.$emit(this.tableId + "vue.table.resize");
        },

        "pageSize" : function() {
            this.setPage();
        },

        "colWidths": {
            deep: true,
            handler: function (val, oldVal) {
                var table_w;
                if(!this.multiple && !this.showIndex && !this.colSelect) {
                    table_w = 0;
                } else if(this.multiple && this.colSelect) {
                    table_w = 100;
                } else {
                    table_w = 50
                }
                for(var col in val) {
                    table_w += val[col]
                }
                this.$nextTick(function() {
                    this.table_w = table_w
                })
            }
        }
    }
}