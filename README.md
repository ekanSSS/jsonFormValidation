Form Validator
===================

This is an extremely light weight javascript form validation class.

a js form validator with customizable with json rules

This plugin make js form validation really easy, and it's fully customizable with json.

Check out example.html for a fully working demonstration.

Configuration
===================

To use json Form Validator, you need to include the script on the page, define the validation rules and call it,
and finally tell the validator when to run validation.

```html
<script type='text/javascript' src='jsonValidator.js'></script>
<script>
var options = {};
var rules = {};
var inputs = document.querySelectorAll('input, select')
 if(ValidateForm(rules, inputs, options)){
    //do action
 }
}
</script>
```

Here are the different configuration options.  They can either be set globally (see below) or
passed in when creating the FormValidator object.

error
---------------
Do you want to display error message ? You can choose ! (default = true)

```javascript
options.error = false;
ValidateForm(rules, inputs, options);
```

skipRequired
----------------
When you do live validation on some field you can skip rules when the field is empty for a best user experience (default = false)

```javascript

options.skipRequired = true;
ValidateForm(rules, inputs, options);
};
```

returnInput
----------------
You may want to get all valid field in your form, this options is for you, instead of a true|false return you get all valid field in an [name]=value object (default = false)

```javascript

options.returnInput = true;
valid field = ValidateForm(rules, inputs, options);
};
```
selectPlaceholder
----------------
Select often have a placeholder option so we want to exclude it from validation and consider the field value like null when we find it e.g. <option value="placeholder">sometext</option> will be excluded (default = "placeholder")

```javascript

options.selectPlaceholder = "anothervalue";
valid field = ValidateForm(rules, inputs, options);
};
```

errorClass
----------------
You can customize your error class to display for your field, by default I use a simple bootstrap architecture (default = "has-error")

```javascript

options.errorClass = "anotherClass";
valid field = ValidateForm(rules, inputs, options);
};
```

rules
--------------------
This is an object containing all the validation logic.
The keys are field name and the values are objects containing a 'RulesName' with 'value' and 'message'

Default RulesName are : 
-required
-min
-max
-equals
-notequals
-lessthan
-morethan
-lessthanequal
-morethanequal
-regex

"value" contains value to compare e.g:
```javascript
min: {
  value: 3
  message:"error message"
}
//this rules accept only field with a number superior than 3, if the value is 2 it will display an error
```

"message" contains custom error string to display.

You can declare dependicies on field with the word : condition, Then you add a level in object with some field :
"field" :  name of the field dependancies,
"operator": name of rule to test 
"value": value for the test
"validation": if the condition is valid, then apply rules in it

```javascript
rules = {
  someFieldName: {
      required : {
        value:true,
        message:"This field is required"
      },
      regexp:{
          value: /^[0-9A-Za-zéèêëâàäçî\s\-\']{1,50}$/,
          message: "error message"
      }
  },
  otherFieldname:{
    min: {
      value: 3,
      message:"this field should be 3 at minimum"
    }
  }
  fieldwithdependanties:{
    condition:{
      field: "otherFieldName",
      operator: "equals",
      value: 4,
      validation:{
        required: {
          value: true,
          message: "this field is require for otherfield equals 4"
        }
      }
    }
  }
};
```
You can also specied a target container for received errorClass and message by setting the target options with a jquery selector

```javascript
rules = {
  someFieldName: {
    required : {
      value:true,
      message:"This field is required"
    },
    target: ".someClassContainer"
  }
};
```

If you try and validate a field that doesn't have a rule associated, it will automatically pass validation.

Running Validation
=====================

After all that configuration, it's finally time to tell the validator when to run.

The most common case is to run validation when a form submits.

```javascript
var rules = ...;
var options = ...;
var inputs = document.querySelectorAll('input, select');
var specInputs = document.querySelectorAll('input[name=login], input[name=password]');

document.getElementById('my_form')addEventListener.('submit',function() {
  //this will run all the validation rules
  return ValidateForm(rules, inputs, options);
  
  //this will only run the selected field rules

  return ValidateForm(rules, specInputs, options);
});
```

Another common use case is to validate an input when it loses focus.

```javascript
document.getElementById('my_form')addEventListener('blur',function(ev) {
  if(ev.target.tagName.toLowerCase() == "input" || ev.target.tagName.toLowerCase() == "select" || ev.target.tagName.toLowerCase() == "textarea"){
    var optionsLive = options;
    optionsLive.skipRequired = true;
    ValidateForm(rules, [ev.target], optionsLive);
  }
}, true);
```

It is also common to remove an error as soon as a field gains focus again.

```javascript
document.getElementById('my_form')addEventListener('blur',function(ev) {
  if(ev.target.tagName.toLowerCase() == "input" || ev.target.tagName.toLowerCase() == "select" || ev.target.tagName.toLowerCase() == "textarea"){
     ValidateForm.removeErrorMessage(ev.target.parentNode, options.errorClass);
  }
}, true);
```
To clear multiple errors at once:

```javascript
//clear all errors
ValidateForm.removeAllErrorMessages = function(options.errorClass)

```

#Expending and Overwritting rules 

You can adding new rules easily by define comparative function for them : 

```javascript
//just after the js call, write in script tag : 

// definition for equals rules
ValidateForm.equals = function(valueInField,ValueInRulesJson){
    return valueInField === ValueInRulesJson;
};

ValidateForm.email = function(valueInField){
    return valueInField.test(/someEmailRegexp/);
};
// now you can use the email rules

```

And you can overwritten the existing function 


```javascript
//if you have a custom error message treatment
ValidateForm.addErrorMessage = function(target, message, errorClass){
    target.className += " " + errorClass;
    // here you just want a new class in your container, no error message
    
};


//don't forget the remove function 


ValidateForm.removeErrorMessage = function(target, errorClass){
        removeClass(target, errorClass);
        //no more treatment, there is no message
}

ValidateForm.removeAllErrorMessages = function(errorClass){
    var errors = document.querySelectorAll('.' + errorClass)
    for( var i =0; i < errors.length; i++){
         ValidateForm.removeErrorMessage(errors[i], errorClass);
    }
};

```
the first options is always the one given by the user and the second is the one stored in the rules
