var scope = new Vue({
	el: '#clients',
	data: {
		clients: [],
		register: false,
		client: {},
		pages: 0,
		page: 0,
		name: null,
		cpf: null
	},
	methods: {
		new: function(event) {
			scope.register = true;
		},
		back: function(event) {
			scope.register = false;
		},
		save: function(event) {
			$.post('/clients', scope.client,'json').done(function (response) {
				alert("Client salvo com sucesso!");
				scope.register = false;
				scope.client = null;
				loadData();
			});
		},
		pagination: function(value) {
			scope.page = value;
			loadData();
		},
		filterData: function(event) {

		},
		loadData: function loadData() {
			$.get('/clients/list', { 
				page: scope.page, 
				limit: 20, 
				name: scope.name, 
				cpf: scope.cpf 
			}).done(function (data) {
				scope.clients = data.data;
				scope.pages = [];
				for(var i = -1; i < parseInt((data.total - 1) / 20); i++, scope.pages.push(i));
			});
		}
	}
});

scope.loadData();