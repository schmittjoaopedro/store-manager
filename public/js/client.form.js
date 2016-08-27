$('input').each(function (idx, el) {
	var clientName = $(el).attr('name');
	switch (clientName) {
		case "clientName":
		case "clientCountry":
		case "clientState":
		case "clientCity":
		case "clientAddress":
		case "name":
			$(el).change(function(data) {
				$(el).val (function () {
				    return this.value.toUpperCase();
				});
		    });
			break;
		case "clientCpf":
		case "cpf":
			VMasker(el).maskPattern("999.999.999-99");
			break;
		case "clientPhoneOne":
		case "clientPhoneTwo":
			VMasker(el).maskPattern("(99) 9999-9999");
			break;
		default:
			break; 
	}
});