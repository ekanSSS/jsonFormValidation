"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},ValidateForm=ValidateForm||function(){var v={},r=["removeErrorMessage","addErrorMessage","removeAllErrorMessage"],e={},g={error:!0,returnInput:!1,selectPlaceholder:"placeholder",errorClass:"has-error",ignoreMethod:["required","equals","notequals","regex"]};return e.core=function(e,r,o){null==r&&(r=document.querySelectorAll("input:not(.disabled), select:not(.disabled)")),console.log(g),"object"!==(void 0===o?"undefined":_typeof(o))&&(o=Object.assign({},g));for(var t={length:0},n=!0,a=0;a<r.length;a++){var l,i=r[a],u=i.name,s=e[u],c=i.value;if(c===o.selectPlaceholder&&0<i.getElementsByTagName("option").length&&(c=""),void 0!==s){if(l=void 0!==s.target?document.querySelectorAll(s.target)[0]:i.parentNode,"radio"===i.getAttribute("type")){if(hasClass(l,o.errorClass))continue;c=document.querySelectorAll("[name="+i.getAttribute("name")+"]:checked")[0].value}if(o.error&&v.removeErrorMessage(l,o.errorClass),void 0!==s.condition){var d=document.querySelectorAll("form [name="+s.condition.field+"]")[0];"radio"===d.getAttribute("type")&&(d=document.querySelectorAll("form [name="+s.condition.field+"]:checked")[0]);var m=d.value;if(""===m||null===m||!("equals"===s.condition.operator&&m==s.condition.value||"notequals"===s.condition.operator&&m!=s.condition.value||"lessthan"===s.condition.operator&&m<s.condition.value||"morethan"===s.condition.operator&&m>s.condition.value||"lessthanequal"===s.condition.operator&&m<=s.condition.value||"morethanequal"===s.condition.operator&&m>=s.condition.value))continue;s=s.condition.validation}for(var f in s)if(!("target"===f||o.ignoreMethod&&(o.ignoreMethod.includes(f)||o.ignoreMethod.includes("regex")&&""===c)||v[f](c,void 0===s[f].value?"":s[f].value))){n=!1,o.error&&v.addErrorMessage(l,s[f].message,o.errorClass);break}n&&o.returnInput&&(t[u]=c,t.length++)}}return o.returnInput?t:n},e.addMethod=function(e,r){return"string"==typeof e&&"function"==typeof r&&(v[e]=r,!0)},e.removeMethod=function(e){return"string"==typeof e&&!r.includes(e)&&(delete v[e],!0)},v.required=function(e){return null!==e&&""!==e.trim()},v.equals=function(e,r){return e===r},v.notequals=function(e,r){return e!==r},v.regex=function(e,r){return r.test(e)},v.max=function(e,r){return e<r},v.min=function(e,r){return r<e},v.lessthan=function(e,r){var o=document.querySelector("form [name="+r+"]").value;return v.max(e,o)},v.morethan=function(e,r){var o=document.querySelector("form [name="+r+"]").value;return v.min(e,o)},v.lessthanequals=function(e,r){var o=document.querySelector("form [name="+r+"]").value;return v.max(e,o)||v.equals(o,e)},v.morethanequals=function(e,r){var o=document.querySelector("form [name="+r+"]").value;return v.min(e,o)||v.equals(o,e)},v.removeErrorMessage=function(e,r){removeClass(e,r);var o=e.querySelector(":scope > .error-message");o&&e.removeChild(o)},v.removeAllErrorMessages=function(e){for(var r=document.querySelectorAll("."+e),o=0;o<r.length;o++)v.removeErrorMessage(r[o],e)},v.addErrorMessage=function(e,r,o){var t=document.createElement("div");t.className="error-message",t.innerHTML=r,e.className+=" "+o,e.appendChild(t)},e}();function hasClass(e,r){return e.className&&new RegExp("(\\s|^)"+r+"(\\s|$)").test(e.className)}"function"!=typeof String.prototype.trim&&(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")});var removeClass=function(e,r){e.classList?e.classList.remove(r):e.className=e.className.replace(new RegExp("(^|\\b)"+r.split(" ").join("|")+"(\\b|$)","gi")," ")};