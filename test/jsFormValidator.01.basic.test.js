describe('Json Form Validator basics', function() {


	var submitEvent = document.createEvent('CustomEvent');
	submitEvent.initCustomEvent('submit', true, false, null);

	var domReadyEvent = document.createEvent('CustomEvent');
	domReadyEvent.initCustomEvent('DOMContentLoaded', false, false, null);
	document.dispatchEvent(domReadyEvent);

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

		testFuncVar = false;
		testScrollVar = 0;
		clicked = false;

		document.body.insertAdjacentHTML('afterbegin', fixture);
	});

	afterEach(function() {
		document.body.removeChild(document.getElementById('fixture'));
	});

	it('The validator should be loaded', function() {
		expect(ValidateForm).toBeDefined();
	});

	it('Error messages test', function() {
		var form = document.querySelectorAll('form')[0]
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//should be false
		expect(ValidateForm(rules)).toBe(false);

		//error class should be present
		expect(form.childNodes[0].className).toBe(" has-error");

		var error = form.querySelector('.error-message');

		//error message should be present
		expect(error).not.toBe(null);

		//error message should be rule message
		expect(error.innerHTML).toBe(rules.test1.required.message);

		form.querySelector('input[name=test1]').value = "test";

		//now validation should be true
		expect(ValidateForm(rules)).toBe(true);

		error = form.querySelector('.error-message');

		//error class shouldn't be present
		expect(form.childNodes[0].className).toBe("");

		//error message shouldn't be present
		expect(error).toBe(null);
	});

	it('select validation test', function() {
		var form = document.querySelectorAll('form')[0]
		var rules = {
			test2 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//test with placeholder value (considered as "")
		expect(ValidateForm(rules)).toBe(false);

		//test for validate a select
		form.querySelector('select[name=test2]').value=2;
		expect(ValidateForm(rules)).toBe(true);
	});

	it('validation of radio button with same name', function() {
		var form = document.querySelectorAll('form')[0]
		var rules = {
			test3 :{ 
				equals : {
					value: "2",
					message: "this is a test of equals"
				}
			}
		}

		var radio = form.querySelectorAll('input[type=radio]');

		expect(ValidateForm(rules, radio)).toBe(false);


		//test for validate a radio value 
		radio[1].checked = true;
		expect(ValidateForm(rules, radio)).toBe(true);
	});

	it('remove all error message',function() {
		var form = document.querySelectorAll('form')[0]
		var rules = {
			test1 :{ 
				required : {
					value: true,
					message: "this is a test"
				}
			}
		}

		//should be false
		expect(ValidateForm(rules)).toBe(false);

		//error class should be present
		expect(form.childNodes[0].className).toBe(" has-error");

		var error = form.querySelectorAll('.error-message');

		expect(error.length).toBe(1);

		ValidateForm.removeAllErrorMessages('has-error');

		error = form.querySelectorAll('.error-message');

		expect(error.length).toBe(0);
	});

	it('validation with missing value in ruels', function() {
		var form = document.querySelectorAll('form')[0]
		var rules = {
			test1 :{ 
				equals : {
					message: "this is a test of equals"
				}
			}
		}

		//missing value is considered as "" so it's true
		expect(ValidateForm(rules)).toBe(true);


		//with real value
		form.querySelector('input[name=test1]').value = 2;
		expect(ValidateForm(rules)).toBe(false);
	});

});