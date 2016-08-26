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
			scope.client = {};
			scope.register = true;
		},
		back: function(event) {
			scope.register = false;
		},
		save: function(event) {
			if(scope.client.bornDate)
				scope.client.bornDate = moment(scope.client.bornDate, "YYYY-MM-DD").toDate().getTime();
			$.post('/clients', scope.client,'json').done(function (response) {
				alert("Client salvo com sucesso!");
				scope.register = false;
				scope.client = {};
				scope.loadData();
			});
		},
		remove: function(client) {
			$.ajax({
				url: '/clients/' + client.id,
				method: 'DELETE'
			}).done(function() {
				alert("Client removido com sucesso!");
				scope.register = false;
				scope.client = {};
				scope.loadData();
			})
		},
		edit: function(client) {
			scope.client = client;
			scope.register = true;
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
			}).done(function (resp) {
				if(resp.data) {
					resp.data.forEach(function(item) {
						if(item.bornDate)
							item.bornDate = moment(new Date(item.bornDate)).format("YYYY-MM-DD");
					});
					scope.clients = resp.data;
					scope.pages = [];
					for(var i = -1; i < parseInt((resp.total - 1) / 20); i++, scope.pages.push(i));
				}
			});
		}
	}
});

scope.loadData();