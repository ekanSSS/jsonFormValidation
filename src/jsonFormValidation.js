    /**
     * validate a form from json condition array
     * @params Object validationRules a json object with all the rules
     * @params Object inputs a jquery input list
     * @params Object options the options past for the form
     * @return {boolean} ou Object true/false is form valide or object with valid form
     */
    const ValidateForm = (function(){

        const method = {};
        const methodRequired = ['removeErrorMessage','addErrorMessage', 'removeAllErrorMessages']
        const noTestMethod = ['target', 'conditions', 'rules'];
        const self = {};
        const basicOptions = {
            error: true,
            selectPlaceholder: 'placeholder',
            errorClass: 'has-error',
            skipEmpty: false
        };
        const conditionOptions = {
            error: false,
            skipEmpty: false
        }

        /**
        * return all valid input from entry
        *
        * @param {object} validationRules json validation rules
        * @param {array} inputs list of input to validate
        * @param {object} options
        * @return {object} all input valid
        **/ 

        self.getValidInputs = function (validationRules, inputs, options) {
            return isValid(validationRules, inputs, options, true)
        }

        /**
        * return is all input from entry valid
        *
        * @param {object} validationRules json validation rules
        * @param {array} inputs list of input to validate
        * @param {object} options
        * @return {bool} is all input valid
        **/
        self.validate = function (validationRules, inputs, options) {
            return isValid(validationRules, inputs, options, false)
        }

        /**
        * remove all error message
        *
        * @param {string} classname of error
        **/
        self.removeErrors = function(errorClass) {
            if(!errorClass){
                errorClass = basicOptions.errorClass;
            }

            method.removeAllErrorMessages(errorClass);
        }
        
        /**
        * get given input value
        *
        * @param {DOMNODE} input
        * @param {object} options
        * @return {string} input value
        **/
        const getInputValue = function (input, options) {
            if(!input){
                return null;
            }

            let value = input.value

            //if select is on placeholder item, consider it ad null
            if(value === options.selectPlaceholder && input.getElementsByTagName('option').length > 0){
                value = '';
            }

            //if it's a radio button, make validation only on checked one
            if(input.getAttribute('type') === 'radio'){
                value = document.querySelectorAll('[name=' + input.getAttribute('name') + ']:checked')[0].value;
            }

            return value;
        }

        const isValid = function(validationRules, inputs, options, returnInput){
            //if not input are provided get all input or select without class disabled
            if(typeof inputs === 'undefined' || inputs === null) {
                inputs = document.querySelectorAll('input:not(.disabled), select:not(.disabled)');
            }

            //test options and set default
            if(typeof options !== 'object'){
                options = Object.assign({}, basicOptions);
            } else {
                options = Object.assign({}, basicOptions, options);
            }

            const retour = {};
            retour.length = 0;
            let valid = true;

            //parse all inputs
            for(let i = 0; i < inputs.length; i++){

                const input = inputs[i];
                const name = input.name;
                let rules = validationRules[name];
                let value = getInputValue(input, options) || '' ;
                let target;
                
                // does we are a rules for this input
                if(typeof rules !== 'undefined'){

                    //if target is defined, get this target, else take parent item
                    if(typeof rules.target !== 'undefined'){
                        target = document.querySelectorAll(rules.target)[0];
                    }else{
                        target = input.parentNode;
                    }

                    //if it's a radio button, make validation only on checked one
                    if(input.getAttribute('type') === 'radio'){
                        if(hasClass(target, options.errorClass)){
                            continue;
                        }
                    }

                    //hide or not error message
                    if(options.error) 
                        method.removeErrorMessage(target, options.errorClass);

                    valid = core(rules, value, target, valid, options)

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

        const conditions = function(rules, value, target, valid, options){
            const specificOptions = Object.assign({}, options, conditionOptions);
            rules.conditions.forEach( rule => {
                if(core(rule, value, target, true, specificOptions)) {
                    valid = core(rule.rules, value, target, valid, options)
                }
            });
            
            return valid;
        }

        const core = function(rules, value, target, valid, options){
            //test if conditions
            if(typeof rules.conditions === 'object'){
                valid = conditions(rules, value, target, valid, options)
            }
            //check all rules
            for(let rule in rules){
                //skip some rules for real time validation to prevent error message poping
                if( 
                    !noTestMethod.includes(rule)
                    && !(
                        options.skipEmpty
                        && value === ''
                    )
                ){
                    let ruleValue = '';
                    let testValue = value
                    if (rules[rule].value) {
                        ruleValue = rules[rule].value ? rules[rule].value : '';
                    }

                    if(rules[rule].field){
                        const fieldValue = getInputValue(document.querySelector(`[name=${rules[rule].field}]`), options)
                        if (typeof fieldValue === "string") {
                            if(rules[rule].value){
                                testValue = fieldValue;
                            }else{
                                ruleValue = fieldValue;
                            }
                        }

                    }

                    //call validation function and add error message; break on first error
                    if(!method[rule](testValue, ruleValue)){
                        valid = false;
                        if(options.error)
                            method.addErrorMessage(target, rules[rule].message, options.errorClass);
                        break; 
                    }
                
                }
            } 

            return valid;
        } 

        self.addMethod = function(methodName, methodFunction){
            if(typeof methodName === 'string' && typeof methodFunction === 'function'){
                method[methodName] = methodFunction;
                return true;
            }
            return false;
        }

        self.removeMethod = function(methodName){
            if(typeof methodName === 'string' && !methodRequired.includes(methodName)){
                delete method[methodName];
                return true;
            }
            return false;
        }

        method.required = function(a){
            return a && a !== null && a.trim() !== '';
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
            return method.max(a, b);
        };
        method.morethan = function(a,b){
            return method.min(a, b);
        };
        method.lessthanequals = function(a,b){
            return (method.max(a, b) || method.equals(a, b));
        };
        method.morethanequals = function(a,b){
            return (method.min(a, b) || method.equals(a, b));
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
            var error = document.createElement('div')
            error.className = 'error-message';
            error.innerHTML = message
            target.className += ' ' + errorClass;

            target.appendChild(error);
        };

        return self;
    })()