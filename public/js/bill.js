var scope = new Vue({
	el: '#bill',
	data: {
		register: false,
		bill: { },
		bills: [],
		billPages: 0,
		billPage: 0,
		billCount: null,
		billVisiblePage: 5,
		billCurrentPage: 1,
		parcels: [],
		clients: [],
		clientView: false,
		clientPages: 0,
		clientPage: 0,
		clientCount: null,
		clientVisiblePage: 5,
		clientCurrentPage: 1,
		clientName: null,
		clientCpf: null,
		parcellCount: 1,
		parcellDateStart: null,
		msgAmount: '',
		msgParcelAmount: '',
		msgDateAmount: '',
		msgPaymentType: ''
	},
	methods: {
		new: function() {
			this.register = true;
			this.parcellCount = 1;
			this.parcels = [];
			this.bill = {
				purchaseDate: moment(new Date()).format("YYYY-MM-DD")
			};
			this.parcellDateStart = moment(new Date()).format("YYYY-MM-DD");
		},
		back: function() {
			this.register = false;
			this.bill = {};
		},
		//Filter and pagination client - start
		clientNext: function() {
			this.clientCurrentPage++;
			var totalPages = parseInt(this.clientCount / this.clientVisiblePage) + 1;
			if(this.clientCurrentPage > totalPages) this.clientCurrentPage = totalPages;
			this.clientFitPages();
		},
		clientMiddle: function(idx) {
			this.clientPage = idx;
			this.findClients();
		},
		clientPrevious: function() {
			this.clientCurrentPage--;
			if(this.clientCurrentPage < 1) this.clientCurrentPage = 1;
			this.clientFitPages();
		},
		clientFitPages: function() {
			this.clientPages = [];
			if(this.clientCurrentPage * this.clientVisiblePage <= this.clientCount) {
				for(var i = (this.clientCurrentPage - 1) * this.clientVisiblePage; 
					i < (this.clientCurrentPage * this.clientVisiblePage);
					this.clientPages.push(i), i++);
			} else {
				for(var i = (this.clientCurrentPage - 1) * this.clientVisiblePage; 
					i <= this.clientCount;
					this.clientPages.push(i), i++);
			}
		},
		findClients: function() {
			this.clientView = true;
			$.get('/clients/list', { 
				page: this.clientPage, 
				limit: 5, 
				name: this.clientName, 
				cpf: this.clientCpf 
			}).done(function (resp) {
				if(resp.data) {
					resp.data.forEach(function(item) {
						if(item.bornDate)
							item.bornDate = moment(new Date(item.bornDate)).format("YYYY-MM-DD");
					});
					scope.clients = resp.data;
					scope.clientCount = parseInt((resp.total - 1) / 5);
					scope.clientPage = 0;
					scope.clientFitPages();
				}
			});
		},
		//Filter and pagination client - end
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
			if(!this.validFields()) {
				return false;
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
				scope.loadData();
			});
		},
		//Filter and pagination bill - start
		billNext: function() {
			this.billCurrentPage++;
			var totalPages = parseInt(this.billCount / this.billVisiblePage) + 1;
			if(this.billCurrentPage > totalPages) this.billCurrentPage = totalPages;
			this.billFitPages();
		},
		billMiddle: function(idx) {
			this.billPage = idx;
			this.loadData();
		},
		billPrevious: function() {
			this.billCurrentPage--;
			if(this.billCurrentPage < 1) this.billCurrentPage = 1;
			this.billFitPages();
		},
		billFitPages: function() {
			this.billPages = [];
			if(this.billCurrentPage * this.billVisiblePage <= this.billCount) {
				for(var i = (this.billCurrentPage - 1) * this.billVisiblePage; 
					i < (this.billCurrentPage * this.billVisiblePage);
					this.billPages.push(i), i++);
			} else {
				for(var i = (this.billCurrentPage - 1) * this.billVisiblePage; 
					i <= this.billCount;
					this.billPages.push(i), i++);
			}
		},
		loadData: function() {
			$.get('/bills/list/open', { 
				page: this.billPage, 
				limit: 20, 
				name: this.billName, 
				cpf: this.billCpf 
			}).done(function(resp) {
				if(resp.data) {
					resp.data.forEach(function(item) {
						item.purchaseDate = moment(new Date(item.purchaseDate)).format("DD/MM/YYYY");
					});
					scope.bills = resp.data;
					scope.billCount = parseInt((resp.total - 1) / 20);
					scope.billPage = 0;
					scope.billFitPages();
				}
			});
		},
		//Filter and pagination bill - end
		generateParcels: function() {
			var value = this.bill.amount / this.parcellCount;
			var sum = 0;
			this.parcels = [];
			this.bill.parcels = this.parcels;
			for(var i = 0; i < this.parcellCount; i++) {
				var temp = parseFloat(value.toFixed(2));
				if(i === this.parcellCount - 1) {
					temp = parseFloat((this.bill.amount - sum).toFixed(2));
				} else {
					sum += temp;
				}
				this.bill.parcels.push({
					value: temp,
					paymentDate: moment(this.parcellDateStart).add(i, 'month').format('YYYY-MM-DD'),
					payed: false
				});
			}
			this.validValueParcels();
			this.validDateParcels();
		},
		edit: function(entity) {
			this.register = true;
			this.parcellCount = 1;
			this.bill = JSON.parse(JSON.stringify(entity));
			this.parcels = this.bill.parcels;
			this.bill.purchaseDate = moment(entity.purchaseDate, "DD/MM/AAAA").format("YYYY-MM-DD");
		},
		remove: function(bill) {
			$.ajax({
				url: '/bills/' + bill.id,
				method: 'DELETE'
			}).done(function() {
				alert("Venda removida com sucesso!");
				scope.register = false;
				scope.bill = {};
				scope.loadData();
			})
		},
		//Validations
		validFields: function() {
			var status = this.validAmount();
			status &= this.validValueParcels();
			status &= this.validDateParcels();
			status &= this.validPaymentType();
			return status;
		},
		validAmount: function() {
			if(!this.bill.amount) {
				this.msgAmount = 'Campo obrigatório';
				return false;
			} else if(!(new RegExp(/^[1-9]\d*(\.\d+)?$/)).test("" + this.bill.amount)) {
				this.msgAmount = "Somente valores numéricos, use '.' (ponto) para as casas decimais se necessário."
				return false;
			}
			this.msgAmount = null;
			return true;
		},
		validValueParcels: function() {
			for(var idx in this.parcels) {
				if(!this.parcels[idx].value) {
					this.msgParcelAmount = 'Os valores são obrigatórios';
					return false;
				} else if(!(new RegExp(/^[1-9]\d*(\.\d+)?$/)).test("" + this.parcels[idx].value)) {
					this.msgParcelAmount = "Somente valores numéricos, use '.' (ponto) para as casas decimais se necessário."
					return false;
				}
			}
			if(this.parcels.length === 0) {
				this.msgParcelAmount = 'as parcelas são obrigatórias';
				return false;
			}
			this.msgParcelAmount = null;
			return true;
		},
		validDateParcels: function() {
			for(var idx in this.parcels) {
				if(!this.parcels[idx].paymentDate) {
					this.msgDateAmount = 'As data são obrigatórias';
					return false;
				}
			}
			this.msgDateAmount = null;
			return true;
		},
		validPaymentType: function() {
			if(!this.bill.paymentType) {
				this.msgPaymentType = 'O tipo de pagamento é obrigatório';
				return false;
			}
			this.msgPaymentType = null;
			return true;
		}
	}
});

scope.loadData();