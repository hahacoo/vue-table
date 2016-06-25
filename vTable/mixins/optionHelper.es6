/**
 * 表格列格式化
 */
export default {

	methods: {

		initColumns: function(columns) {
			var self = this,
				childrens = columns.map(function(comp) {
					var props = comp._props,
						col = {};

					for(var k in props) {
						if(Object.prototype.hasOwnProperty.call(props, k)) col[k] = comp[k]
					}

					return col;
				}),
				i = 0,
				len = childrens.length;

			childrens.sort(function(cur, next) {
				return parseInt(cur.index) - parseInt(next.index)
			})

			this.initWidth(childrens);

			for(; i < len; i++) {
				this.setColumn(childrens[i], true);
			}
		},

		setColumn: function(col, initWidth) {
			this.defaultColumns.push(col.name);
			this.sortColumns[col.name] = col.sortAble;
			this.titles[col.name] = col.title;
			this.templates[col.name] = col.template;

		},

		initWidth: function(columns) {
			var self = this;

			var colWidths = this.colWidths,
				reg = /^([1-9]\d*)(px|%)$/i,
				perTd = [],
				pxTd = [],
				indexWidth = 50,
				reportW = 0,
				width = this.$el.offsetWidth;

			this.container_w = width;

			if(!this.multiple && !this.showIndex && !this.colSelect) {
				reportW = width
			} else if(this.multiple && this.colSelect) {
				reportW = width - indexWidth * 2
			} else {
				reportW = width - indexWidth
			}

			var len = columns.length,
				i = 0;

			if(len == 0) return

			var defaultWidth = 120,
				pxSum = 0,
				perSum = 0;

			for(; i < len; i++) {
				var tdWidth = columns[i].width,
					result = reg.exec(tdWidth);

				if(result === null) {
					pxTd.push({name: columns[i].name, width: defaultWidth})
					pxSum += defaultWidth;
				} else {
					tdWidth = +result[1];
					if(result[2] === 'px') {
						pxTd.push({name: columns[i].name, width: tdWidth});
						pxSum += tdWidth;
					} else {
						perTd.push({name: columns[i].name, width: tdWidth});
						perSum += tdWidth;
					}
				}

			}

			if(pxSum >= reportW) {
				perTd.forEach(function(td) {
					self.$set('colWidths.' + td.name, 120)
				})
			} else {
				var usable = reportW - pxSum;

				if(perTd.length == 0) {
					pxTd[0].width += usable;
				} else{
					if(perSum < 100) {
						perTd[0].width += 100-perSum;
					}
					perTd.forEach(function(td) {
						self.$set('colWidths.' + td.name, Math.floor(td.width / 100 * usable))
					})
				}
			}
			
			pxTd.forEach(function(td) {
				self.$set('colWidths.' + td.name, td.width)
			});
		}
	}
}