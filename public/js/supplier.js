var scope = new Vue({
	el: '#supplier',
	data: {
		register: false,
		supplier: {},
		suppliers: [],
		msgName: '',
		msgCnpj: '',
		msgCountry: '',
		msgState: '',
		msgCity: '',
		msgPhoneOne: '',
		msgPhoneTwo: '',
		msgEmail: '',
		msgSite: '',
		name: '',
		cnpj: '',
		pages: 0,
		page: 0,
		count: null,
		visiblePage: 5,
		currentPage: 1
	},
	methods: {
		back: function() {
			this.supplier = {};
			this.register = false;
		},
		new: function() {
			this.supplier = {};
			this.register = true;
		},
		save: function() {
			if(!this.validFields()) return;
			$.post('/suppliers', this.supplier, 'json').done(function(resp) {
				alert("Fornecedor cadastrado com sucesso!");
				scope.register = false;
				scope.supplier = {};
				scope.loadData();
			});
		},
		remove: function(supplier) {
			$.ajax({
				url: '/suppliers/' + supplier.id,
				method: 'DELETE'
			}).done(function() {
				alert("Fornecedor removido com sucesso!");
				scope.register = false;
				scope.supplier = {};
				scope.loadData();
			})
		},
		edit: function(supplier) {
			this.supplier = supplier;
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
		loadData: function() {
			$.get('/suppliers/list', {
				page: this.page, 
				limit: 10, 
				name: this.name, 
				cnpj: this.cnpj 
			}).done(function(resp) {
				if(resp.data) {
					resp.data.forEach(function(item) {
						if(item.bornDate)
							item.bornDate = moment(new Date(item.bornDate)).format("YYYY-MM-DD");
					});
					scope.suppliers = resp.data;
					scope.count = parseInt((resp.total - 1) / 10);
					scope.page = 0;
					scope.fitPages();
				}
			})
		},
		//Validations
		validFields: function() {
			var state = this.validName();
			state &= this.validCnpj();
			state &= this.validCountry();
			state &= this.validState();
			state &= this.validCity();
			state &= this.validPhoneOne();
			state &= this.validPhoneTwo();
			state &= this.validEmail();
			state &= this.validSite();
			return state;
		},
		validName: function() {
			if(!this.supplier.name) {
				this.msgName = "Campo obrigatório!";
				return false;
			} else if(!(new RegExp(/^[A-Z0-9 _]*[A-Z0-9][A-Z0-9 _]*$/)).test(this.supplier.name)) {
				this.msgName= "Nome inválido, não utilize acentos!";
				return false;
			}
			this.msgName = null;
			return true;
		},
		validCnpj: function() {
			if(this.supplier.cnpj && !(new RegExp(/^[0-9][0-9].[0-9][0-9][0-9].[0-9][0-9][0-9]\/[0-9][0-9][0-9][0-9]\-[0-9][0-9]$/)).test(this.supplier.cnpj)) {
				this.msgCnpj = "CNPJ inválido."
				return false;
			}
			this.msgCnpj = null;
			return true;
		},
		validCountry: function() {
			if(this.supplier.country && !(new RegExp(/^[a-zA-Z ]+$/)).test(this.supplier.country)) {
				this.msgCountry = "Nome inválido, use somente letras sem acentos!";
				return false;
			}
			this.msgCountry = null;
			return true;
		},
		validState: function() {
			if(this.supplier.state && !(new RegExp(/^[A-Z][A-Z]$/)).test(this.supplier.state)) {
				this.msgState = "Estado inválido, use somente acrônimos, ex: SC, RS, SP, PR!";
				return false;
			}
			this.msgState = null;
			return true;
		},
		validCity: function() {
			if(this.supplier.city && !(new RegExp(/^[a-zA-Z ]+$/)).test(this.supplier.city)) {
				this.msgCity = "Nome inválido, use somente letras sem acentos!";
				return false;
			}
			this.msgCity = null;
			return true;
		},
		validPhoneOne: function() {
			if(this.supplier.phoneOne && !(new RegExp(/^\([0-9][0-9]\) [0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]$/)).test(this.supplier.phoneOne)) {
				this.msgPhoneOne = "Telefone inválido!";
				return false;
			}
			this.msgPhoneOne = null;
			return true;
		},
		validPhoneTwo: function() {
			if(this.supplier.phoneTwo && !(new RegExp(/^\([0-9][0-9]\) [0-9][0-9][0-9][0-9]\-[0-9][0-9][0-9][0-9]$/)).test(this.supplier.phoneTwo)) {
				this.msgPhoneTwo = "Telefone inválido!";
				return false;
			}
			this.msgPhoneTwo = null;
			return true;
		},
		validSite: function() {
			if(this.supplier.site && !(new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)).test(this.supplier.site)) {
				this.msgSite = "Site inválido!";
				return false;
			}
			this.msgSite = null;
			return true;
		},
		validEmail: function() {
			if(this.supplier.email && !(new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)).test(this.supplier.email)) {
				this.msgEmail = "Email inválido!";
				return false;
			}
			this.msgEmail = null;
			return true;	
		}
	}
});


scope.loadData();