var clients = new Vue({
	el: '#clients',
	data: {
		clients: [],
		register: false
	},
	methods: {
		new: function (event) {
			clients.register = true;
		},
		back: function (event) {
			clients.register = false;
		}
	}
});