# vue-table
table, sort, page, resize, template

# Demo
```html
#server-table
<div id="vueTable" style="height: 500px;padding: 15px">
	<v-table
		:multiple = "true"
		table-id="test" 
		:url="dataUrl"
		:col-select="true">
		<v-column name="name" title="NAME" ></v-column>
		<v-column name="sex" title="SEX" :template="sexFormat"></v-column>
		<v-column name="depart" title="DEP" ></v-column>
		<v-column name="tel" title="TEL" ></v-column>
		<v-column name="oper" title="OPERTION" :sort-able="false" :template="operTpl"></v-column>
	</v-table>
</div>
#client table
<div id="vueTable" style="height: 500px;padding: 15px">
	<v-table
		:multiple = "true"
		table-id="test" 
		:data="[
			{
				'id': 1,
				'name': 'ZHANG',
				'sex': 1,
				'depart': 'Finance',
				'tel': '156xxxx2321',
				'district': 'Bejing',
				'school': 'Tsinghua'
			},{
			    'id': 2,
				'name': 'LI',
				'sex': 2,
				'depart': 'Research',
				'tel': '155xxxx2325',
				'district': 'Bejing',
				'school': 'BUPT'
			},{
				'id': 3,
				'name': 'WANG',
				'sex': 1,
				'depart': 'Test',
				'tel': '185xxxx1093',
				'district': 'Bejing',
				'school': 'Beihang'
			},{
				'id': 4,
				'name': 'ZHAO',
				'sex': 2,
				'depart': 'Logistics',
				'tel': '131xxxx2023',
				'district': 'Bejing',
				'school': 'Tsinghua'
			},{
				'id': 5,
				'name': 'CHENG',
				'sex': 1,
				'depart': 'Office',
				'tel': '156xxxx4345',
				'district': 'Bejing',
				'school': 'Beihang'
			}
		]"
		:col-select="true">
		<v-column name="name" title="NAME" ></v-column>
		<v-column name="sex" title="SEX" :template="sexFormat"></v-column>
		<v-column name="depart" title="DEP" ></v-column>
		<v-column name="tel" title="TEL" ></v-column>
		<v-column name="oper" title="OPERTION" :sort-able="false" :template="operTpl"></v-column>
	</v-table>
</div>
```
```javascript
	Vue.use(VueTable.default)

	var table = new Vue({
		el: '#vueTable',
		data: {
			operTpl: '<span class="glyphicon glyphicon-phone" aria-hidden="true"></span>'
			+ '<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span>'
			+ '<span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>'
			+ '<span class="glyphicon glyphicon-trash" aria-hidden="true"></span>'
			
		},
		methods: {
			sexFormat: function(row) {
				if(row.sex == 1) return 'Male'
				return 'Female'
			}
		}
	})
```
![img](https://github.com/hahacoo/vue-table/raw/master/img/img.png)

# Build Setup
npm install

npm run build

