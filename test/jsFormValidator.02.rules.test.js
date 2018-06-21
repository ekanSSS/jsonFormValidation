describe('Json Form Validator Rules Tests', function() { 
	beforeEach(function() {
		var fixture = '<div id="fixture">' +
					'<form>' +
						'<div>'+
							'<input type="text" name="test1">' +
						'</div>'+
						'<div>'+
							'<select name="test2" id="test2">' +
								'<option value="placeholder" selected>placeholder</option>'+
								'<option value="1">1</option>'+
								'<option value="2">2</option>'+
								'<option value="5">5</option>'+
							'</select>'+
						'</div>'+
						'<div class="radio-container">'+
							'<div>'+
								'<input type="radio" name="test3" value="5" checked>'+
								'<input type="radio" name="test3" value="2">'+
								'<input type="radio" name="test3" value="1">'+
							'</div>'+
						'</div>'+
					'</form>'
				'</div>';

		document.body.insertAdjacentHTML('afterbegin', fixture);
	});

	afterEach(function() {
		document.body.removeChild(document.getElementById('fixture'));
	});

	it('Test required', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "test";

		//now validation should be true
		expect(ValidateForm.validate(rules)).toBe(true);
	});
	
	it('Test regex', function() {
		var form = document.querySelector('form');
		var input = form.querySelector('input[name=test1]');
		var rules = {
			test1 :{ 
				regex : {
					value: /^\d*$/, //only number
					message: "this is a test"
				}
			}
		}
		input.value = "testfalse";

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		input.value = "testf54alse5";

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		input.value = "9";

		//now validation should be true
		expect(ValidateForm.validate(rules)).toBe(true);
	});

	it('Test equals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				equals : {
					value: "2",
					message: "this is a test"
				}
			}
		}

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "2";

		//now validation should be true
		expect(ValidateForm.validate(rules)).toBe(true);
	});

	it('Test notequals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				notequals : {
					value: "2",
					message: "this is a test"
				}
			}
		}

		//should be true
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector('input[name=test1]').value = "2";

		//now validation should be false
		expect(ValidateForm.validate(rules)).toBe(false);
	});

	it('Test min', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				min : {
					value: 2,
					message: "this is a test"
				}
			}
		}
		form.querySelector('input[name=test1]').value = "1";
		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "2";

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "3";

		//now validation should be true
		expect(ValidateForm.validate(rules)).toBe(true);
	});

	it('Test max', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				max : {
					value: 2,
					message: "this is a test"
				}
			}
		}
		form.querySelector('input[name=test1]').value = "1";
		//should be true
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector('input[name=test1]').value = "2";

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "3";

		//now validation should be false
		expect(ValidateForm.validate(rules)).toBe(false);
	});

	it('Test morethan', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				morethan : {
					field: "test2",
					message: "this is a test"
				}
			}
		}
		form.querySelector('select[name=test2]').value = 2;
		form.querySelector('input[name=test1]').value = "1";
		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "2";

		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "3";

		//now validation should be true
		expect(ValidateForm.validate(rules)).toBe(true);
	});

	it('Test morethanequals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				morethanequals : {
					field: "test2",
					message: "this is a test"
				}
			}
		}
		form.querySelector('select[name=test2]').value = 2;
		form.querySelector('input[name=test1]').value = "1";
		//should be false
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "2";

		//should be true
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector('input[name=test1]').value = "3";

		//now validation should be true
		expect(ValidateForm.validate(rules)).toBe(true);
	});

	it('Test lessthan', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				lessthan : {
					field: "test2",
					message: "this is a test"
				}
			}
		}
		form.querySelector('select[name=test2]').value = 2;
		form.querySelector('input[name=test1]').value = "1";
		
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector('input[name=test1]').value = "2";

		
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector('input[name=test1]').value = "3";

		
		expect(ValidateForm.validate(rules)).toBe(false);
	});

	it('Test lessthanequals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{ 
				lessthanequals : {
					field: "test2",
					message: "this is a test"
				}
			}
		}
		form.querySelector('select[name=test2]').value = 2;
		form.querySelector('input[name=test1]').value = "1";
		
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector('input[name=test1]').value = "2";

		
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector('input[name=test1]').value = "3";

		
		expect(ValidateForm.validate(rules)).toBe(false);
	});

	it('Test target', function() {
		var form = document.querySelector('form');
		var rules = {
			test3 :{ 
				target: ".radio-container",
				equals : {
					value: "2",
					message: "this is a test"
				}
			}
		}

		ValidateForm.validate(rules);		

		//now radio container should have error classe
		expect(form.querySelector(".radio-container").className.indexOf("has-error")).not.toBe(-1);
	});


})