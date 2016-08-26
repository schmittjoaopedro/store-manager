var scope = new Vue({
	el: '#bill',
	data: {
		register: false,
		bill: {}
	},
	methods: {
		new: function() {
			this.register = true;
			this.bill = {};
		},
		back: function() {
			this.register = false;
			this.bill = {};
		},
		list: function() {
			this.register = false;
			this.bill = {};
		}
	}
});