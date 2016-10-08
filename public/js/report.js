var scope = new Vue({
	el: '#report',
	data: {
		filter: {
			startDate: undefined,
			endDate: undefined,
			client: undefined,
			cpf: undefined,
			filterType: undefined,
			paymentType: undefined
		},
		results: [],
		totalAmount: 0,
		totalReceived: 0,
		totalBalance: 0
	},
	methods: {
		filterData: function() {
			var sDate = moment(this.filter.startDate, "YYYY-MM-DD").toDate().getTime();
			var eDate = moment(this.filter.endDate, "YYYY-MM-DD").toDate().getTime();
			var type = undefined;
			if(this.filter.filterType) {
				type = this.filter.filterType === "Pago" ? true : false;
			}
			var filter = { payed: type };
			if(sDate) filter.startDate = sDate;
			if(eDate) filter.endDate = eDate;
			if(this.filter.client) filter.client = this.filter.client;
			if(this.filter.cpf) filter.cpf = this.filter.cpf;
			if(this.filter.paymentType) filter.paymentType = this.filter.paymentType;
			scope.totalAmount = 0;
			scope.totalBalance = 0;
			scope.totalReceived = 0;
			$.get('/report/filter', filter, 'json').then(function (data) {
				data.forEach(function(item) {
					scope.totalAmount += item.amount;
					scope.totalBalance += item.balance;
					scope.totalReceived += item.received;
					item.amount = parseFloat(item.amount).toFixed(2);
					item.received = parseFloat(item.received).toFixed(2);
					item.balance = parseFloat(item.balance).toFixed(2);
					item.purchaseDate = moment(new Date(item.purchaseDate)).format("DD/MM/YYYY");
				});
				scope.totalAmount = parseFloat(scope.totalAmount).toFixed(2);
				scope.totalBalance = parseFloat(scope.totalBalance).toFixed(2);
				scope.totalReceived = parseFloat(scope.totalReceived).toFixed(2);
				scope.results = data;
			});
		}
	}
});