var scope = new Vue({
	el: '#clients',
	data: {
		clients: [],
		register: false,
		client: {},
		pages: 0,
		page: 0,
		count: null,
		visiblePage: 5,
		currentPage: 1,
		name: null,
		cpf: null,
		msgName: '',
		msgCpf: '',
		msgDate: '',
		msgCountry: '',
		msgState: '',
		msgCity: '',
		msgAddress: '',
		msgPhoneOne: '',
		msgPhoneTwo: '',
		msgEmail: ''
	},
	methods: {
		new: function(event) {
			this.client = {};
			this.register = true;
		},
		back: function(event) {
			this.register = false;
		},
		save: function(event) {
			if(!this.validFields()) return;
			if(this.client.bornDate)
				this.client.bornDate = moment(this.client.bornDate, "YYYY-MM-DD").toDate().getTime();
			$.post('/clients', this.client,'json').done(function (response) {
				alert("Cliente cadastrado com sucesso!");
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
			this.client = client;
			this.register = true;
		},
		next: function() {
			this.currentPage++;
			var totalPages = parseInt(this.count / this.visiblePage) + 1;
			if(this.currentPage > totalPages) this.currentPage = totalPages;
			this.fitPages();
		},
		middle: function(idx) {
			this.page = idx;
			this.loadData();
		},
		previous: function() {
			this.currentPage--;
			if(this.currentPage < 1) this.currentPage = 1;
			this.fitPages();
		},
		fitPages: function() {
			this.pages = [];
			if(this.currentPage * this.visiblePage <= this.count) {
				for(var i = (this.currentPage - 1) * this.visiblePage; 
					i < (this.currentPage * this.visiblePage);
					this.pages.push(i), i++);
			} else {
				for(var i = (this.currentPage - 1) * this.visiblePage; 
					i <= this.count;
					this.pages.push(i), i++);
			}
		},
		loadData: function loadData() {
			$.get('/clients/list', { 
				page: this.page, 
				limit: 10, 
				name: this.name, 
				cpf: this.cpf 
			}).done(function (resp) {
				if(resp.data) {
					resp.data.forEach(function(item) {
						if(item.bornDate)
							item.bornDate = moment(new Date(item.bornDate)).format("YYYY-MM-DD");
					});
					scope.clients = resp.data;
					scope.count = parseInt((resp.total - 1) / 10);
					scope.page = 0;
					if(scope.currentPage > scope.count) scope.currentPage = 1;
					scope.fitPages();
				}
			});
		},
		//Validations
		validFields: function() {
			var state = this.validName();
			state &= this.validCpf();
			state &= this.validDate();
			state &= this.validCountry();
			state &= this.validState();
			state &= this.validCity();
			state &= this.validAddress();
			state &= this.validPhoneOne();
			state &= this.validPhoneTwo();
			state &= this.validEmail();
			return state;
		},
		validName: function() {
			if(!this.client.name) {
				this.msgName = "Campo obrigatório!";
				return false;
			} else if(!(new RegExp(/^[a-zA-Z ]+$/)).test(this.client.name)) {
				this.msgName= "Nome inválido, use somente letras sem acentos!";
				return false;
			}
			this.msgName = null;
			return true;
		},
		validCpf: function() {
			if(!this.client.cpf) {
				this.msgCpf = "Campo obrigatório!";
				return false;
			} else if(!(new RegExp(/^[0-9][0-9][0-9].[0-9][0-9][0-9].[0-9][0-9][0-9]-[0-9][0-9]$/)).test(this.client.cpf)) {
				this.msgCpf = "CPF inválido!";
				return false;
			}
			this.msgCpf = null;
			return true;
		},
		validDate: function() {
			if(!this.client.bornDate) {
				this.msgDate = "Campo obrigatório!";
				return false;
			}
			this.msgDate = null;
			return true;
		},
		validCountry: function() {
			if(!this.client.country) {
				this.msgCountry = "Campo obrigatório!";
				return false;
			} else if(!(new RegExp(/^[a-zA-Z ]+$/)).test(this.client.country)) {
				this.msgCountry= "Nome inválido, use somente letras sem acentos!";
				return false;
			}
			this.msgCountry = null;
			return true;
		},
		validState: function() {
			if(!this.client.state) {
				this.msgState = "Campo obrigatório!";
				return false;
			} else if(!(new RegExp(/^[A-Z][A-Z]$/)).test(this.client.state)) {
				this.msgState = "Estado inválido, use somente acrônimos, ex: SC, RS, SP, PR!";
				return false;
			}
			this.msgState = null;
			return true;
		},
		validCity: function() {
			if(!this.client.city) {
				this.msgCity = "Campo obrigatório!";
				return false;
			} else if(!(new RegExp(/^[a-zA-Z ]+$/)).test(this.client.city)) {
				this.msgCity = "Nome inválido, use somente letras sem acentos!";
				return false;
			}
			this.msgCity = null;
			return true;
		},
		validAddress: function() {
			if(!this.client.address) {
				this.msgAddress = "Campo obrigatório!";
				return false;
			}
			this.msgAddress = null;
			return true;
		},
		validPhoneOne: function() {
			if(this.client.phoneOne && !(new RegExp(/^\([0-9][0-9]\) [0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]$/)).test(this.client.phoneOne)) {
				this.msgPhoneOne = "Telefone inválido!";
				return false;
			}
			this.msgPhoneOne = null;
			return true;
		},
		validPhoneTwo: function() {
			if(this.client.phoneTwo && !(new RegExp(/^\([0-9][0-9]\) [0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]$/)).test(this.client.phoneTwo)) {
				this.msgPhoneTwo = "Telefone inválido!";
				return false;
			}
			this.msgPhoneTwo = null;
			return true;
		},
		validEmail: function() {
			if(this.client.email && !(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)).test(this.client.email)) {
				this.msgEmail = "Email inválido!";
				return false;
			}
			this.msgEmail = null;
			return true;	
		}
	}
});

scope.loadData();