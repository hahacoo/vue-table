export default {
	
	filters: {

		formatterNum: function(number) {
			if(typeof number != "string" && typeof number != "number") {
				return number
			}
			var numStr = number.toString(),
				len = numStr.length,
				tmp = [];
			for(var i = len; i>0;) {
				if(i < 3) {
					tmp.unshift(numStr.slice(0, i));
					break;
				}
				tmp.unshift(numStr.slice(i - 3, i));
				i -= 3;
			}
			return tmp.join(",")
		},

		highlight: function(scontent) {
			if(!this.query || typeof scontent != "string") {
				return scontent
			}

			var query = new RegExp(this.query, "ig");

  			var content = scontent.replace(query, function(match) {
    			return "<b class='soc-highlight'>" + match + "</b>";
  			});

  			return content
		},

		xssFilter: function(content) {
			if(typeof content != "string") {
				return content
			}
			var regExp = new RegExp("<script.*?>.*?<\/script>", "ig");
			return content.replace(regExp, "");
		},

		colName: function(value) {
			if( this.titles[value] ) return this.titles[value];
			return value
		},

		tplRender: function(content, col, row) {
			var templates = this.templates;

			if (!templates[col]) return content;

			content = templates[col];

			if (typeof content=='function') {
				content = content(row);
			}

			var regex;

			for(var key in row) {
				regex = new RegExp("{"+ key + "}","g");
				content = content.replace(regex, String(row[key]));
			}

			return content;

		},

		colFilter: function(value) {
			if(typeof value === "object") {
				var filterCols = ["_id", "shown"];

				if(value instanceof Array) {
					return value.filter(function(col) {
						return _.indexOf(filterCols, col) == -1
					})
				}

				var record = {};

				for(var k in value) {
					if(value.hasOwnProperty(k) && (_.indexOf(filterCols, k) == -1)) {
						record[k] = value[k]
					}
				}

				return record
			}

		}

	}
}