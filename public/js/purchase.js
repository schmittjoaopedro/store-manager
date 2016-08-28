var scope = new Vue({
	el: '#purchase',
	data: {
		register: false,
		parcels: [],
		parcellCount: 1,
		parcellDateStart: null,
		purchase: {},
		purchases: [],
		purchasePage: 0,
		purchaseName: '',
		purchaseCnpj: '',
		purchaseCount: 0,
		purchasePage: 0,
		supplierView: false,
		suppliers: [],
		supplier: {},
		supplierPage: 0,
		supplierCount: null,
		supplierVisiblePage: 5,
		supplierCurrentPage: 1,		
		supplierPages: 0,
		supplierName: null,
		supplierCnpj: null,
		msgAmount: '',
		msgPaymentType: ''
	},
	methods: {
		new: function() {
			this.register = true;
			this.parcellCount = 1;
			this.parcels = [];
			this.purchasePage = 0;
			this.purchase = {
				purchaseDate: moment(new Date()).format("YYYY-MM-DD")
			};
			this.parcellDateStart = moment(new Date()).format("YYYY-MM-DD");
		},
		back: function() {
			this.register = false;
			this.purchase = {};
		},
		//Filter and pagination supplier - start
		supplierNext: function() {
			this.supplierCurrentPage++;
			var totalPages = parseInt(this.supplierCount / this.supplierVisiblePage) + 1;
			if(this.supplierCurrentPage > totalPages) this.supplierCurrentPage = totalPages;
			this.supplierFitPages();
		},
		supplierMiddle: function(idx) {
			this.supplierPage = idx;
			this.findSuppliers();
		},
		supplierPrevious: function() {
			this.supplierCurrentPage--;
			if(this.supplierCurrentPage < 1) this.supplierCurrentPage = 1;
			this.supplierFitPages();
		},
		supplierFitPages: function() {
			this.supplierPages = [];
			if(this.supplierCurrentPage * this.supplierVisiblePage <= this.supplierCount) {
				for(var i = (this.supplierCurrentPage - 1) * this.supplierVisiblePage; 
					i < (this.supplierCurrentPage * this.supplierVisiblePage);
					this.supplierPages.push(i), i++);
			} else {
				for(var i = (this.supplierCurrentPage - 1) * this.supplierVisiblePage; 
					i <= this.supplierCount;
					this.supplierPages.push(i), i++);
			}
		},
		findSuppliers: function() {
			$.get('/suppliers/list', { 
				page: this.supplierPage, 
				limit: 5, 
				name: this.supplierName, 
				cnpj: this.supplierCnpj 
			}).done(function (resp) {
				if(resp.data) {
					scope.suppliers = resp.data;
					scope.supplierCount = parseInt((resp.total - 1) / 5);
					scope.supplierFitPages();
				}
			});
		},
		supplierApplyFilter: function() {
			this.supplierView = true;
			this.supplierPage = 0;
			this.supplierCurrentPage = 1;
			this.findSuppliers();
		},
		//Filter and pagination supplier - end
		cancelPurchases: function() {
			this.supplierView = false;
		},
		selectSupplier: function(supplier) {
			this.purchase.supplier = supplier;
			this.supplierView = false;
		},
		generateParcels: function() {
			var value = this.purchase.amount / this.parcellCount;
			var sum = 0;
			this.parcels = [];
			this.purchase.parcels = this.parcels;
			for(var i = 0; i < this.parcellCount; i++) {
				var temp = parseFloat(value.toFixed(2));
				if(i === this.parcellCount - 1) {
					temp = parseFloat((this.purchase.amount - sum).toFixed(2));
				} else {
					sum += temp;
				}
				this.purchase.parcels.push({
					value: temp,
					paymentDate: moment(this.parcellDateStart).add(i, 'month').format('YYYY-MM-DD'),
					payed: false
				});
			}
			this.validValueParcels();
			this.validDateParcels();
		},
		save: function() {
			if(!this.validFields()) return;
			if(!this.purchase.supplier) {
				alert("Selecione um fornecedor!");
				return;
			}
			if(!this.validFields()) {
				return false;
			}
			if(this.purchase)
				this.purchase.purchaseDate = moment(this.purchase.purchaseDate, "YYYY-MM-DD").toDate().getTime();
			$.ajax({
				method: 'POST',
				url: '/purchases', 
				data: JSON.stringify(this.purchase), 
				dataType: 'json',
				contentType: 'application/json'
			}).done(function (response) {
				alert("Venda salva com sucesso!");
				scope.purchase = {};
				scope.register = false;
				scope.loadData();
			});
		},
		//Filter pagination purchases - start
		purchaseNext: function() {
			this.purchaseCurrentPage++;
			var totalPages = parseInt(this.purchaseCount / this.purchaseVisiblePage) + 1;
			if(this.purchaseCurrentPage > totalPages) this.purchaseCurrentPage = totalPages;
			this.purchaseFitPages();
		},
		purchaseMiddle: function(idx) {
			this.purchasePage = idx;
			this.loadData();
		},
		purchasePrevious: function() {
			this.purchaseCurrentPage--;
			if(this.purchaseCurrentPage < 1) this.purchaseCurrentPage = 1;
			this.purchaseFitPages();
		},
		purchaseFitPages: function() {
			this.purchasePages = [];
			if(this.purchaseCurrentPage * this.purchaseVisiblePage <= this.purchaseCount) {
				for(var i = (this.purchaseCurrentPage - 1) * this.purchaseVisiblePage; 
					i < (this.purchaseCurrentPage * this.purchaseVisiblePage);
					this.purchasePages.push(i), i++);
			} else {
				for(var i = (this.purchaseCurrentPage - 1) * this.purchaseVisiblePage; 
					i <= this.purchaseCount;
					this.purchasePages.push(i), i++);
			}
		},
		loadData: function() {
			$.get('/purchases/list/open', { 
				page: this.purchasePage, 
				limit: 20, 
				name: this.purchaseName, 
				cpf: this.purchaseCnpj 
			}).done(function(resp) {
				if(resp.data) {
					resp.data.forEach(function(item) {
						item.purchaseDate = moment(new Date(item.purchaseDate)).format("DD/MM/YYYY");
					});
					scope.purchases = resp.data;
					scope.purchaseCount = parseInt((resp.total - 1) / 20);
					scope.purchasePage = 0;
					scope.purchaseFitPages();
				}
			});
		},
		//Filter pagination purchases - end
		edit: function(entity) {
			this.register = true;
			this.parcellCount = 1;
			this.purchase = JSON.parse(JSON.stringify(entity));
			this.parcels = this.purchase.parcels;
			this.purchase.purchaseDate = moment(entity.purchaseDate, "DD/MM/AAAA").format("YYYY-MM-DD");
		},
		remove: function(purchase) {
			$.ajax({
				url: '/purchases/' + purchase.id,
				method: 'DELETE'
			}).done(function() {
				alert("Compra removida com sucesso!");
				scope.register = false;
				scope.purchase = {};
				scope.loadData();
			})
		},
		//Validations
		validFields: function() {
			var status = this.validPaymentType();
			status &= this.validAmount();
			status &= this.validPaymentType();
			status &= this.validValueParcels();
			status &= this.validDateParcels();
			return status;
		},
		validPaymentType: function() {
			if(!this.purchase.paymentType) {
				this.msgPaymentType = 'O tipo de pagamento é obrigatório';
				return false;
			}
			this.msgPaymentType = null;
			return true;
		},
		validAmount: function() {
			if(!this.purchase.amount) {
				this.msgAmount = 'Campo obrigatório';
				return false;
			} else if(!(new RegExp(/^[1-9]\d*(\.\d+)?$/)).test("" + this.purchase.amount)) {
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
		}
	}
});

scope.loadData();