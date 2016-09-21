

/**
 * validate a form from json condition array
 * @params Object validationRules a json object with all the rules
 * @params Object inputs a jquery input list
 * @params Object options the options past for the form
 * @returns {boolean} ou Object true/false is form valide or object with valid form
 */
var ValidateForm = function(validationRules, inputs, options){

    //if not input are provided get all input or select without class disabled
    if(typeof inputs === "undefined" || inputs === null) {
        inputs = document.querySelectorAll('input:not(.disabled), select:not(.disabled)');
    }

    //test options and set default
    if(typeof options !== "object"){
        options = {};
    }
    if(typeof options.error === "undefined"){
        options.error = true;
    }
    if(typeof options.skipRequired === "undefined"){
        options.skipRequired = false;
    }
    if(typeof options.returnInput === "undefined"){
        options.returnInput = false;
    }
    if(typeof options.selectPlaceholder === "undefined"){
        options.selectPlaceholder = "placeholder";
    }
    if(typeof options.errorClass === "undefined"){
        options.errorClass = "has-error";
    }

    var retour = {};
    retour.length = 0
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
                ValidateForm.removeErrorMessage(target, options.errorClass);

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
            for(var j in rules){
                //skip some rules for real time validation to prevent error message poping
                if( 
                    j !== "target" &&
                    !(
                        options.skipRequired  && 
                        (
                            j === "required" || 
                            j === "equals" || 
                            j === "notequals" || 
                            (j === "regex" && value === "")
                        )
                    )
                ){
                    //call validation function and add error message; break on first error
                    if(!ValidateForm[j](value, typeof rules[j].value === "undefined"?"":rules[j].value)){
                        valid = false;
                        if(options.error)
                            ValidateForm.addErrorMessage(target, rules[j].message, options.errorClass);
                        break; 
                    }
                
                }
            }  

            //if we need all valid fields          
            if(valid && options.returnInput){
                retour[name] = value;
                retour.length++;
            }
        }
    }

    // return true/false or all valid field
    if(!options.returnInput) {
        return valid;
    }else{
        return retour;
    }
    
}

ValidateForm.required = function(a){
    return a !== null && a.trim() !== "";
};
ValidateForm.equals = function(a,b){
    return a === b;
};
ValidateForm.notequals = function(a,b){
    return a !== b;
};
ValidateForm.regex = function(a,b){
    return b.test(a);
};
ValidateForm.max = function(a,b){
    return a < b;
};
ValidateForm.min = function(a,b){
    return a > b;
};
ValidateForm.lessthan = function(a,b){
    var compare = document.querySelectorAll('form [name='+ b +']')[0].value;
    return ValidateForm.max(a, compare);
};
ValidateForm.morethan = function(a,b){
    var compare = document.querySelectorAll('form [name='+ b +']')[0].value;
    return ValidateForm.min(a, compare);
};
ValidateForm.lessthanequals = function(a,b){
    var compare = document.querySelectorAll('form [name='+ b +']')[0].value;
    return (ValidateForm.max(a, compare) || ValidateForm.equals(compare,a));
};
ValidateForm.morethanequals = function(a,b){
    var compare = document.querySelectorAll('form [name='+ b +']')[0].value;
    return (ValidateForm.min(a, compare) || ValidateForm.equals(compare,a));
};
ValidateForm.removeErrorMessage = function(target, errorClass){
        removeClass(target, errorClass);
        var error =  target.querySelector(':scope > .error-message');
        if(error)
            target.removeChild(error);
};
ValidateForm.removeAllErrorMessages = function(errorClass){
    var errors = document.querySelectorAll('.' + errorClass)
    for( var i =0; i < errors.length; i++){
         ValidateForm.removeErrorMessage(errors[i], errorClass);
    }
};
ValidateForm.addErrorMessage = function(target, message, errorClass){
    var error = document.createElement("div")
    error.className = "error-message";
    error.innerHTML = message
    target.className += " " + errorClass;

    target.appendChild(error);
};