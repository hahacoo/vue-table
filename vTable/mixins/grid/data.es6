
export default {
    
    data: function() {

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
            loaded: false,
            chkAll : false,
            chkIds   : [],
            currRecord : {
                shown  : false,
                record   : {}
            },
            resizeAble: false,
            resizeLine: {
                col: '',
                left: 0
            },
            prePage: false,
            nextPage: false,
            preChunk: false,
            nextChunk: false,
        };
    }
}