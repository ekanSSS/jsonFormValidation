describe('Json Form Validator Options Tests', function() {

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

	it('Options selectPlaceholder test', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test2 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//test with placeholder value (considered as "")
		expect(ValidateForm.validate(rules)).toBe(false);

		//test with another placeholder select configured
		form.querySelector('option[value=placeholder]').value = 'testmodif';
		expect(ValidateForm.validate(rules, null, {selectPlaceholder: "testmodif"})).toBe(false);


		//test for validate a select
		form.querySelector('select[name=test2]').value=2;
		expect(ValidateForm.validate(rules)).toBe(true);
	});

	it('Options skipEmpty test', function() {
		var form = document.querySelector('form');
		var options = {skipEmpty: true};
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test1"
				},
				equals: {
					value: "2",
					message: "this is a test2"
				},
				notequals: {
					value: 3,
					message: "this is a test3"
				},
				regex: {
					value: /^[a-z]*$/,
					message: "regex"
				}
			}
		}

		//test with no value (should be false without skip required)
		expect(ValidateForm.validate(rules)).toBe(false);

		//test with no value (should be true with skip required)
		expect(ValidateForm.validate(rules, null, options)).toBe(true);

		form.querySelector('input[name=test1]').value = '2';

		//test with value, regex shoumd be trigger
		expect(ValidateForm.validate(rules, null, options)).toBe(false);
		expect(form.querySelector('.error-message').innerHTML).toBe("regex");
	});

	it('Options error test', function() {
		var form = document.querySelector('form');
		var options = {error: false};
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//test should be false and error message should be displayed
		expect(ValidateForm.validate(rules)).toBe(false);
		expect(form.querySelectorAll('.error-message').length).toBe(1);

		//validation should be false and existing error message should not disappear
		expect(ValidateForm.validate(rules, null, options)).toBe(false);
		expect(form.querySelectorAll('.error-message').length).toBe(1);

		ValidateForm.removeErrors('has-error');

		//validation should be false and no error message should appear
		expect(ValidateForm.validate(rules, null, options)).toBe(false);
		expect(form.querySelectorAll('.error-message').length).toBe(0);

		
	});

	it('Options returnInput test', function() {
		var form = document.querySelector('form');
		var options = {returnInput: true};
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//return only valid input with rules
		expect(ValidateForm.getValidInputs(rules, null, options).length).toBe(0);

		form.querySelector('input[name=test1]').value = '2';

		//return only valid input with rules
		var inputValid = ValidateForm.getValidInputs(rules, null, options);
		
		expect(inputValid.test1).toBe('2');
		expect(inputValid.length).toBe(1);



		
	});

	it('Options errorClass test', function() {
		var form = document.querySelector('form');
		var options = {errorClass: 'testClass'};
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}
		
		//error class should be changed
		ValidateForm.validate(rules, null, options)
		expect(form.childNodes[0].className.indexOf(options.errorClass)).not.toBe(-1);




		
	});
})