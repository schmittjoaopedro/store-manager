var scope = new Vue({
	el: '#bill',
	data: {
		register: false,
		bill: { },
		bills: [],
		parcels: [],
		clients: [],
		clientView: false,
		pages: 0,
		page: 0,
		name: null,
		cpf: null,
		parcellCount: 1
	},
	methods: {
		new: function() {
			this.register = true;
			this.parcellCount = 1;
			this.parcels = [];
			this.bill = {
				purchaseDate: moment(new Date()).format("YYYY-MM-DD")
			};
		},
		back: function() {
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
			this.bill.client = client;
			this.clientView = false;
		},
		cancelClients: function() {
			this.clientView = false;
		},
		save: function() {
			if(!this.bill.client) {
				alert("Selecione um cliente!");
				return;
			}
			if(this.bill)
				this.bill.purchaseDate = moment(this.bill.purchaseDate, "YYYY-MM-DD").toDate().getTime();
			$.ajax({
				method: 'POST',
				url: '/bills', 
				data: JSON.stringify(this.bill), 
				dataType: 'json',
				contentType: 'application/json'
			}).done(function (response) {
				alert("Venda salva com sucesso!");
				scope.bill = {};
				scope.register = false;
				scope.loadOpenBills();
			});
		},
		loadOpenBills: function() {
			$.get('/bills/list/open').done(function(items) {
				items.forEach(function(item) {
					item.purchaseDate = moment(new Date(item.purchaseDate)).format("DD/MM/YYYY");
				});
				scope.bills = items;
			});
		},
		generateParcels: function() {
			var value = this.bill.amount / this.parcellCount;
			this.parcels = [];
			this.bill.parcels = this.parcels;
			for(var i = 0; i < this.parcellCount; i++) {
				this.bill.parcels.push({
					value: value,
					paymentDate: moment().add(i, 'month').format('YYYY-MM-DD'),
					payed: false
				});
			}
		},
		edit: function(entity) {
			this.register = true;
			this.parcellCount = 1;
			this.bill = JSON.parse(JSON.stringify(entity));
			this.parcels = this.bill.parcels;
			this.bill.purchaseDate = moment(entity.purchaseDate, "DD/MM/AAAA").format("YYYY-MM-DD");
		}
	}
});

scope.loadOpenBills();