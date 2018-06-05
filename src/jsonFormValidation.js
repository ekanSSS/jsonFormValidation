/**
 * validate a form from json condition array
 * @params Object validationRules a json object with all the rules
 * @params Object inputs a jquery input list
 * @params Object options the options past for the form
 * @return {boolean} ou Object true/false is form valide or object with valid form
 */
const ValidateForm = ValidateForm || (function(){

    const method = {};
    const methodRequired = ["removeErrorMessage","addErrorMessage", "removeAllErrorMessage"]
    const self = {};
    const basicOptions = {
        error: true,
        selectPlaceholder: 'placeholder',
        errorClass: 'has-error',
        //ignoreMethod: ["required", "equals", "notequals", "regex"]
    };

    self.getValidInput = function (validationRules, inputs, options) {
        core(ValidateForm, inputs, options, true)
    }

    self.validate = function (validationRules, inputs, options) {
        core(ValidateForm, inputs, options, false)
    }
    
    const core = function(validationRules, inputs, options, returnInput){

        //if not input are provided get all input or select without class disabled
        if(typeof inputs === "undefined" || inputs === null) {
            inputs = document.querySelectorAll('input:not(.disabled), select:not(.disabled)');
        }

        //test options and set default
        console.log(basicOptions);
        if(typeof options !== "object"){
            options = Object.assign({}, basicOptions);
        }

        var retour = {};
        retour.length = 0;
        var valid = true;

        //parse all inputs
        for(var i = 0; i < inputs.length; i++){

            var input = inputs[i];
            var name = input.name;
            var rules = validationRules[name];
            var value = input.value;
            var target;

            //if select is on placeholder item, consider it ad null
            if(value === options.selectPlaceholder && input.getElementsByTagName('option').length > 0){
                value="";
            }

            
            // does we are a rules for this input
            if(typeof rules !== "undefined"){

                //if target is defined, get this target, else take parent item
                if(typeof rules.target !== "undefined"){
                    target = document.querySelectorAll(rules.target)[0];
                }else{
                    target = input.parentNode;
                }

                //if it's a radio button, make validation only on checked one
                if(input.getAttribute("type") === "radio"){
                    if(hasClass(target, options.errorClass)){
                        continue;
                    }
                    value = document.querySelectorAll('[name=' + input.getAttribute('name') + ']:checked')[0].value;
                }

                //hide or not error message
                if(options.error) 
                    method.removeErrorMessage(target, options.errorClass);

                //are we in condition case
                if(typeof rules.condition !== "undefined"){
                    var field = document.querySelectorAll('form [name='+ rules.condition.field +']')[0];
                    if(field.getAttribute('type') === "radio"){
                        field = document.querySelectorAll('form [name='+ rules.condition.field +']:checked')[0];
                    }
                    var valtest = field.value;

                    if(
                        (valtest !== "" && valtest !== null) &&
                        (
                            (rules.condition.operator === "equals" && valtest == rules.condition.value) ||
                            (rules.condition.operator === "notequals" && valtest != rules.condition.value) ||
                            (rules.condition.operator === "lessthan" && valtest < rules.condition.value) ||
                            (rules.condition.operator === "morethan" && valtest > rules.condition.value) ||
                            (rules.condition.operator === "lessthanequal" && valtest <= rules.condition.value) ||
                            (rules.condition.operator === "morethanequal" && valtest >= rules.condition.value)
                        )
                    ){
                        rules = rules.condition.validation;
                    }else{
                        continue;
                    }
                }

                //check all rules
                for(var rule in rules){
                    //skip some rules for real time validation to prevent error message poping
                    if( 
                        rule !== "target"
                        && !(
                            options.ignoreMethod
                            &&(
                                options.ignoreMethod.includes(rule) 
                                ||(
                                    options.ignoreMethod.includes("regex")
                                    && value === ""
                                )
                            )
                        )
                    ){
                        //call validation function and add error message; break on first error
                        if(!method[rule](value, typeof rules[rule].value === "undefined"?"":rules[rule].value)){
                            valid = false;
                            if(options.error)
                                method.addErrorMessage(target, rules[rule].message, options.errorClass);
                            break; 
                        }
                    
                    }
                }  

                //if we need all valid fields          
                if(valid && returnInput){
                    retour[name] = value;
                    retour.length++;
                }
            }
        }

        // return true/false or all valid field
        if(!returnInput) {
            return valid;
        }

        return retour;
    }

    self.addMethod = function(methodName, methodFunction){
        if(typeof methodName === "string" && typeof methodFunction === "function"){
            method[methodName] = methodFunction;
            return true;
        }
        return false;
    }

    self.removeMethod = function(methodName){
        if(typeof methodName === "string" && !methodRequired.includes(methodName)){
            delete method[methodName];
            return true;
        }
        return false;
    }

    method.required = function(a){
        return a !== null && a.trim() !== "";
    };
    method.equals = function(a,b){
        return a === b;
    };
    method.notequals = function(a,b){
        return a !== b;
    };
    method.regex = function(a,b){
        return b.test(a);
    };
    method.max = function(a,b){
        return a < b;
    };
    method.min = function(a,b){
        return a > b;
    };
    method.lessthan = function(a,b){
        var compare = document.querySelector('form [name='+ b +']').value;
        return method.max(a, compare);
    };
    method.morethan = function(a,b){
        var compare = document.querySelector('form [name='+ b +']').value;
        return method.min(a, compare);
    };
    method.lessthanequals = function(a,b){
        var compare = document.querySelector('form [name='+ b +']').value;
        return (method.max(a, compare) || method.equals(compare,a));
    };
    method.morethanequals = function(a,b){
        var compare = document.querySelector('form [name='+ b +']').value;
        return (method.min(a, compare) || method.equals(compare,a));
    };
    method.removeErrorMessage = function(target, errorClass){
            removeClass(target, errorClass);
            var error =  target.querySelector(':scope > .error-message');
            if(error)
                target.removeChild(error);
    };
    method.removeAllErrorMessages = function(errorClass){
        var errors = document.querySelectorAll('.' + errorClass)
        for( var i =0; i < errors.length; i++){
             method.removeErrorMessage(errors[i], errorClass);
        }
    };
    method.addErrorMessage = function(target, message, errorClass){
        var error = document.createElement("div")
        error.className = "error-message";
        error.innerHTML = message
        target.className += " " + errorClass;

        target.appendChild(error);
    };

    return self;
})()