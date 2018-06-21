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
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		equals:{
				 		field: "test2",
				 		value: "2"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("select[name=test2]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);
	});

	it('Test condition on radio button', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		notequals:{
				 		field: "test3",
				 		value: "5"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});

	it('Test condition on equals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	
			 	conditions:[{
			 		equals:{
				 		field: "test3",
				 		value: "2"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});

	it('Test condition on notequals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		notequals:{
				 		field: "test3",
				 		value: "5"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});

	it('Test condition on lessthan', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		lessthan:{
				 		field: "test3",
				 		value: "2"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]				
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 1

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});

	it('Test condition on morethan', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		morethan:{
				 		field: "test3",
				 		value: "2"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]
			}
		}

		form.querySelector("[name=test3]").value = 1

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 5

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});

	it('Test condition on lessthanequals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		lessthanequals:{
				 		field: "test3",
				 		value: "2"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]
			}
		}

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		//condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector("[name=test3]").value = 1

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});

	it('Test condition on morethanequals', function() {
		var form = document.querySelector('form');
		var rules = {
			test1 :{
			 	conditions:[{
			 		morethanequals:{
				 		field: "test3",
				 		value: "2"
				 	},
					rules: {
						required : {
							value: true,
							message: "this is a test"
						}
			 		}
			 	}]
			}
		}

		form.querySelector("[name=test3]").value = 1

		// condition are not meet, so test1 isn't required
		expect(ValidateForm.validate(rules)).toBe(true);

		form.querySelector("[name=test3]").value = 2

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

		form.querySelector("[name=test3]").value = 5

		// condition meet, so test1 is required
		expect(ValidateForm.validate(rules)).toBe(false);

	});
})