$('input').each(function (idx, el) {
	var supplierName = $(el).attr('name');
	switch (supplierName) {
		case "supplierName":
		case "supplierCountry":
		case "supplierState":
		case "supplierCity":
		case "supplierAddress":
			$(el).change(function(data) {
				$(el).val (function () {
				    return this.value.toUpperCase();
				});
		    });
			break;
		case "supplierCnpj":
			VMasker(el).maskPattern("99.999.999/9999-99");
			break;
		case "supplierPhoneOne":
		case "supplierPhoneTwo":
			VMasker(el).maskPattern("(99) 9999-9999");
			break;
		default:
			break; 
	}
});