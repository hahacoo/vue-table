export default {
	
	data: function() {
		return {
			cname: "vColumn"
		}
	},

	props: {
		"name": {
	        type: String,
	        required: true,
	        default: "attr",
	        validator: function (value) {
		        return value != "operate"
		    }
	    }, 
	    "title": {
			type: String,
			required: true,
			default: ""
	    },
	    "width": {
	    	default: '120px',
	    },
	    "template": null, 
	    "sortAble": {
	   	 	type: Boolean,
	        default: true
	    },
		"index": {
			default: 0
		}
	}

}