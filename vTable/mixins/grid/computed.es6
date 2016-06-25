
export default {
    computed: {
        colSpan  : function() {
            if(!this.multiple && !this.showIndex && !this.colSelect) {
                return this.defaultColumns.length;
            } else if(this.multiple && this.colSelect) {
                return this.defaultColumns.length + 2;
            } else {
                return this.defaultColumns.length + 1;
            }
        },

        totalPage: function() {
            var total = Math.ceil( this.count / this.pageSize );
            if(total <= 0) {
                return 1;
            }
            return total
        },

        totalChunk: function() {
            return Math.ceil( this.totalPage / this.chunkNum )
        },

        pageChunk: function() {
            return Math.ceil( this.page / this.chunkNum );
        },

        pageStart: function() {
            return (this.pageChunk - 1) * this.chunkNum + 1
        }
    }
}