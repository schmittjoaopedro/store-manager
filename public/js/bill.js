var scope = new Vue({
	el: '#bill',
	data: {
		register: false,
		bill: { },
		client: {},
		clients: [],
		clientView: false,
		pages: 0,
		page: 0,
		name: null,
		cpf: null
	},
	methods: {
		new: function() {
			this.register = true;
			this.bill = {
				puchaseDate: moment(new Date()).format("YYYY-MM-DD")
			};
		},
		back: function() {
			this.register = false;
			this.bill = {};
		},
		list: function() {
			this.register = false;
			this.bill = {};
		},
		findClients: function() {
			this.clientView = true;
			$.get('/clients/list', { 
				page: this.page, 
				limit: 20, 
				name: this.name, 
				cpf: this.cpf 
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
		},
		selectClient: function(client) {
			console.info(client);
			this.client = client;
			this.clientView = false;
		},
		cancelClients: function() {
			this.clientView = false;
		},
		save: function() {
			this.bill.client = this.client;
			$.post('/bills', this.bill,'json').done(function (response) {
				alert("Venda salva com sucesso!");
			});
		}
	}
});