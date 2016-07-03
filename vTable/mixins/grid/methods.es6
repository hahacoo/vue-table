import http from "../../bases/http.es6";

export default {
    methods : {
        getElementLeft : function(element) {
            var actualLeft = element.offsetLeft;
            var current = element.offsetParent;
            while (current !== null){
                actualLeft += current.offsetLeft;
                current = current.offsetParent;
            }
            return actualLeft;
        },

        resizeStart: function(col, event) {
            this.resizeAble = true;
            this.resizeLine.col = col;
            this.resizeLine.left = event.clientX - this.getElementLeft(this.$els.content) + document.documentElement.scrollLeft + document.body.scrollLeft
            this.mouseX = event.clientX;
        },

        resize: function(event) {
            if(this.resizeAble) {
                var dx = event.clientX - this.mouseX,
                    width = this.colWidths[this.resizeLine.col] + dx;

                if( width > this.minWidth) {
                    this.resizeLine.left = event.clientX - this.getElementLeft(this.$els.content) + document.documentElement.scrollLeft + document.body.scrollLeft;
                }
            }
        },

        resizeStop: function(event) {
            if(this.resizeAble) {
                var dx = event.clientX - this.mouseX,
                    width = this.colWidths[this.resizeLine.col] + dx;

                if(width > this.minWidth) {
                    this.colWidths[this.resizeLine.col] = width;
                } else {
                    this.colWidths[this.resizeLine.col] = this.minWidth;
                }
                this.resizeAble = false;
            }
        },

        initId: function(col) {
            var prefix = 'mnGrid_';
            return prefix + col;
        },

        showField: function(key) {
            var filterCols = ["_id", "shown"];
            return _.indexOf(filterCols, key) == -1
        },

        calcWidth: function() {
            var self = this,
                columns = this.$children.filter(function(comp) {
                    return comp.cname == "vColumn";
                }),
                childrens = columns.map(function(comp) {
                    var props = comp._props,
                        col = {};
                    for(var k in props) {
                        Object.prototype.hasOwnProperty.call(props, k) && (col[k] = comp[k])
                    }
                    return col;
                });

            this.$nextTick(function() {
                this.initWidth(childrens);
            })
        },

        selectCol: function(col) {
            if(_.indexOf(this.defaultColumns, col) != -1) return false;
            return true;
        },

        changeCols   : function() {
            this.showCols = true;
        },

        collapseClass : function(record) {
            var isCurrent = (!!this.currRecord.record && this.currRecord.record[this.primaryKey] == record[this.primaryKey]);
            return {
                "glyphicon"                : true,
                "glyphicon-chevron-down"  : isCurrent,
                "glyphicon-chevron-right" : !isCurrent
            };
        },

        sort: function(col) {
            if(!this.sortColumns[col]) return false
            
            if(col === this.orderBy) {
                this.ascending = !!this.ascending ? 0 : 1;
            } else {
                this.ascending = 1;
            }

            this.orderBy = col;

            this.setPage(1, true)
        },

        collapse    : function(record) {
            var self = this;
            if(this.currRecord.shown) {
                this.records.$remove(this.currRecord);
            }
            if(this.currRecord.record[this.primaryKey] == record[this.primaryKey]) {
                this.currRecord.record = {};
            } else {
                for(var i = 0; i < this.records.length; i ++) {
                    if(record == this.records[i]) {
                        break;
                    }
                }
                this.currRecord.shown = true;
                this.currRecord.record = this.records[i];
                this.$dispatch(this.tableId + 'vue.table.collapse', this.currRecord)
                this.records.splice(i + 1, 0, this.currRecord)
                this.$nextTick(function() {
                    var detail = document.getElementById('grid-detail');
                    this.$compile(detail);
                })

            }

        },

        formatData: function(data) {

            for(var k in data) {
                var value = data[k];

                if(typeof value === "object") {

                    if($.isArray(value)) {

                        value.forEach(function(d, i) {
                            data[k + "[" + i + "]"] = d
                        })

                    } else {

                        for(var j in value) {
                            data[k + "." + j] = value[j]
                        }

                    }

                    delete data[k]
                }

            }
        },

        serverCollection: function() {
            var self = this,
                params = {};
            
            params.limit = this.pageSize;
            params.page = this.page;
            params.orderBy = this.orderBy;
            params.ascending = this.ascending;

            for(var key in this.searchParams) {
                params[key] = this.searchParams[key]
            }

            var method = this.method.toUpperCase();

            if($.inArray(method, ['GET', 'POST']) == -1) method = 'GET'

            return http.request(method, this.url, params).then(function(res){

                self.currRecord.record = {};
                var data = res.data;
                if(res && data && data.data instanceof Array) {
                    self.records = [];
                    self.records = data.data.map(function(d, i) {
                        self.formatData(d);
                        d._grid_index = (self.page - 1) * self.pageSize + i + 1
                        d.shown = false;
                        return d;
                    });
                    self.count = data.count;
                    if(typeof data.page === 'number') {
                        self.page = data.page;
                    }
                } else {
                    self.records = [];
                    self.count = 0;
                    self.page = 1;
                }

                setTimeout(function(){
                    this.$dispatch(this.tableId + "vue.table.loaded", this.records)
                }.bind(self), 0);

            }, function(res) {
                self.records = [];
                self.count = 0;
            })
        },

        clientCollection: function(sort) {
            var self = this,
                page = this.page,
                limit = this.pageSize,
                orderBy = this.orderBy,
                ascending = this.ascending ? 1 : -1;

            if(sort) {
                this.data.sort(function(preData, nextData) {

                    var pre = preData[orderBy],
                        next = nextData[orderBy];

                    if(typeof pre == "string" && typeof next == "string"){
                        return ascending * pre.localeCompare(next);
                    }
                    if(typeof pre == "number" && typeof next == "string"){
                        return -ascending;
                    }
                    if(typeof pre == "string" && typeof next == "number"){
                        return ascending;
                    }
                    if(typeof pre == "number" && typeof next == "number"){
                        if(pre > next) return ascending;
                        if(pre == next) return 0;
                        if(pre < next) return -ascending;
                    }

                })
            }

            this.records = this.data.slice( (page - 1) * limit, page * limit)
                .map(function(d, i) {
                    self.formatData(d);
                    d._grid_index = (self.page - 1) * self.pageSize + i + 1
                    d.shown = false;
                    return d;
                });
            this.count = this.data.length;

            setTimeout(function(){
                this.$dispatch(this.tableId + "vue.table.loaded", this.records)
            }.bind(this), 0);
        },

        getData: function(sort) {
            var self = this,
                params = {};
            this.loaded = false;

            if(this.data !== undefined) {
                this.clientCollection(sort);
            } else {
                this.serverCollection();
            }
        },

        setPage: function(page, sort) {
            if(typeof  page !== 'undefined') {
                this.page = page
            }
            this.pageModel = this.page;
            this.getData(sort);
        },

        gotoPage: function() {
            if(isNaN(this.pageModel) || this.pageModel < 1) {
                this.pageModel = 1;
            } else if(parseInt(this.pageModel) > this.totalPage) {
                this.pageModel = this.totalPage;
            }

            this.setPage(this.pageModel)

        },

        setChunk: function(chunk) {
            var page = ((this.pageChunk -1) + chunk) * this.chunkNum + 1;
            this.setPage(page);
        }
    }
}