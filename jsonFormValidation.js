/**
 * validate a form from json condition array
 * @params Object validationRules a json object with all the rules
 * @params Object $input a jquery input list
 * @params Object options the options past for the form
 * @returns {boolean} ou Object true/false is form valide or object with valid form
 */
var ValidateForm = function(validationRules, $input, options){

        //if not input are provided get all input or select without class disabled
    if(typeof $input === "undefined" || $input === null) {
        $input = $('input:not(.disabled), select:not(.disabled)');
    }
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
    var valid = true;
    $input.each(function(){
        var name = this.name;
        var rules = validationRules[name];
        var value = $(this).val();
        if(value === options.selectPlaceholder && input.getElementsByTagName('option').length > 0){
            value="";
        }
        var target, compare ;
        if(typeof rules !== "undefined"){
            if(typeof rules.target !== "undefined"){
                target = $(rules.target);
            }else{
                target = $(this).parent();
            }
            if(options.error) ValidateForm.removeErrorMessage(target, options.errorClass);
            if(this.attributes.type === "radio"){
                if(target.hasClass(options.errorClass)){
                    return true;
                }
                value = $('.[name=' + $(this).attr('name') + ']:checked').val();
            }
            if(typeof rules.condition !== "undefined"){
                var field = $('form [name='+ rules.condition.field +']');
                if(field.first().attr('type') === "radio"){
                    field = $('form [name='+ rules.condition.field +']:checked');
                }
                var valtest = field.val();

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
                    return true;
                }
            }
            for(var i in rules){
                //skip some rules for real time validation to prevent error message poping
                if( 
                    i !== "target" &&
                    !(
                        options.skipRequired  && 
                        (
                            i === "required" || 
                            i === "equals" || 
                            i === "notequals" || 
                            (i === "regexp" && value === "")
                        )
                    )
                ){
                    if(ValidateForm[i](value, typeof rules[i].value === "undefined"?"":rules[i].value)){
                        valid = false;
                        ValidateForm.addErrorMessage(target, rules[i].message, options.errorClass);
                        break;
                    }
                
                }
            }            
            if(this.valid && options.returnInput){
                retour[name] = value;
            }
        }
    });

    if(!options.returnInput) {
        return valid;
    }else{
        return retour;
    }
    
}

ValidateForm.required = function(a){
    return a === null || $.trim(a) === "";
};
ValidateForm.equals = function(a,b){
    return a === b;
};
ValidateForm.notequals = function(a,b){
    return a !== b;
};
ValidateForm.regex = function(a,b){
    return a.test(b);
};
ValidateForm.max = function(a,b){
    return a > b;
};
ValidateForm.min = function(a,b){
    return a < b;
};
ValidateForm.lessthan = function(a,b){
    compare = $('form [name='+ b +']').val();
    return ValidateForm.max(compare, a);
};
ValidateForm.morethan = function(a,b){
    compare = $('form [name='+ b +']').val();
    return ValidateForm.min(compare, a);
};
ValidateForm.lessthanequal = function(a,b){
    compare = $('form [name='+ b +']').val();
    return (ValidateForm.max(compare, a) || this.equals(compare,a));
};
ValidateForm.morethanequals = function(a,b){
    compare = $('form [name='+ b +']').val();
    return (ValidateForm.min(compare, a) || this.equals(compare,a));
};
ValidateForm.removeErrorMessage = function(target, errorClass){
    target.removeClass(errorClass).find('> .error-message').remove();
};
ValidateForm.removeAllErrorMessages = function(errorClass){
    $('.' + errorClass).removeClass(errorClass).find('> .error-message').remove();
};
ValidateForm.addErrorMessage = function(target, message, errorClass){
    target.addClass(errorClass).append('<div class="error-message">' + message + '</div>');
};
