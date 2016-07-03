
export default {
    ready: function() {
        var self = this,
            _tableParam = this._tableParam;
        
        window.onresize = function resize() {
            self.calcWidth();
        }

        this.$on(this.tableId + "vue.table.resize", function() {
            this.calcWidth();
        })

        this.$on(this.tableId + "vue.table.loaded", function(data) {
            this.loaded = true;
            this.chkAll = false;
            this.chkIds = [];

            this.$nextTick(function() {
                var tbody = this.$els.tbody;
                this.$compile(tbody);
            })
        })

        this.$on(this.tableId + "vue.table.refresh", function() {
            this.setPage();
        });

        this.$on(this.tableId + "vue.table.search", function(url, param) {
            if(arguments.length == 1) {
                if(typeof url == "string") {
                    this.url = url
                } else if(typeof url == "object" && !( url instanceof Array)) {
                    for(var k in url) {
                        if(url.hasOwnProperty(k)) {
                            if($.inArray(k, _tableParam) != -1) {
                                this[k] = url[k]
                            } else {
                                this.searchParams[k] = url[k]
                            }
                        }
                    }
                }

            } else if(arguments.length == 2) {
                if(typeof url == "string") {
                    this.url = url;
                } else if(typeof param == "object" && !( param instanceof Array)) {
                    for(var k in param) {
                        if(param.hasOwnProperty(k)) {
                            if($.inArray(k, _tableParam) != -1) {
                                this[k] = param[k]
                            } else {
                                this.searchParams[k] = param[k]
                            }
                        }
                    }
                }

            }
            this.setPage(1);
        })

        this.scrollLeft = 0;

        var gridBody = $('.grid-body', this.$el),
            gridHead = $('.grid-head', this.$el);

        gridBody.scroll(function() {
            gridHead[0].scrollLeft = this.scrollLeft;
            self.scrollLeft = this.scrollLeft;
        })
    }
}