describe('Json Form Validator Rules Conditions Test', function() {
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

	it('Test base condition', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test2",
			 		operator: "equals",
			 		value: "2",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("select[name=test2]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on radio button', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "notequals",
			 		value: "5",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on equals', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "equals",
			 		value: "2",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on notequals', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "notequals",
			 		value: "5",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on lessthan', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "lessthan",
			 		value: "2",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 1

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on morethan', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "morethan",
			 		value: "2",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		form.querySelector("[name=test3]").value = 1

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 5

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on lessthanequal', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "lessthanequal",
			 		value: "2",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		//condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

		form.querySelector("[name=test3]").value = 1

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});

	it('Test condition on morethanequal', function() {
		var form = document.querySelectorAll('form')[0];
		var rules = {
			test1 :{
			 	condition:{
			 		field: "test3",
			 		operator: "morethanequal",
			 		value: "2",
					validation: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}
				
			}
		}

		form.querySelector("[name=test3]").value = 1

		// condition are not meet, so test1 isn't required
		expect(ValidateForm(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

		form.querySelector("[name=test3]").value = 5

		// condition meet, so test1 is required
		expect(ValidateForm(rules)).toBe(false);

	});
})