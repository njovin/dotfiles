DialogInput=function(){var t=function(r){var n={};for(var o in r)r.hasOwnProperty(o)&&(r[o]instanceof e?n[o]=t(r[o]):n[o]=!0);return n},e=function(){};e.prototype.validate=function(){var t=!0;for(var e in this)this.hasOwnProperty(e)&&(t=this[e].validate()&&t);return t},e.prototype.clear=function(){for(var t in this)this.hasOwnProperty(t)&&this[t].clear()},e.prototype.clearErrors=function(){for(var t in this)this.hasOwnProperty(t)&&this[t].clearErrors()},e.prototype.adjustView=function(){for(var t in this)if(this.hasOwnProperty(t)){var e=this[t];"function"==typeof e.adjustView&&e.adjustView()}},e.prototype.getValue=function(t){var e={};for(var r in this)this.hasOwnProperty(r)&&(e[r]=this[r].getValue(t));return e},e.prototype.setValue=function(t){for(var e in this)this.hasOwnProperty(e)&&this[e].setValue(void 0===t[e]?"":t[e])},e.prototype.hasError=function(){for(var t in this)if(this.hasOwnProperty(t)&&this[t].hasError())return!0;return!1};var r=function(t){this.items={},this.groupName=t};r.prototype.getValue=function(){for(var t in this.items)if(this.items[t].prop("checked"))return t},r.prototype.setValue=function(t){var e=this.items[t];if(e)e.prop("checked",!0);else for(var r in this.items)this.items[r].prop("checked",!1)},r.prototype.addRadioInput=function(t){var e=t.attr("value");if(!e)throw"RadioGroup member must have a value!";if(t.attr("name")!==this.groupName)throw"RadioGroup member must have the same name attribute as the other radio inputs in the group (based on dialogField)!";this.items[e]=t};var n=function(){this._errors=[],this._errorContainer=null,this._errorOptions=null,this._hasError=!1};n.prototype.postValidate=function(){this._hasError=this._errors.length>0,this._hasError&&this._errorContainerWrapper.find("input,select,textarea").bind("focus",this.focusHandler).bind("blur",this.blurHandler).bind("change",this.changeHandler)},n.prototype.hasError=function(){return this._hasError},n.prototype.buildError=function(){var t=this.getElement(),e={element:t,alignTop:"SELECT"===this.input.prop("nodeName").toUpperCase()};return"checkbox"===t.attr("type")&&(e.element=e.element.add(t.next()),e.static=!0),this.buildErrorElement(e)},n.prototype.buildErrorElement=function(t){this._errorOptions=t=$.extend(this.getDialog().getErrorOptions(),t);var e=this._errorContainerWrapper=$(LPTools.createElement("div","relative"));this._errorContainer=$(LPTools.createElement("div","dialogErrorContainer")),t.element.before(e),t.static&&e.addClass("staticError"),t.alignTop&&this._errorContainer.addClass("alignTop"),t.static&&!t.alignTop?(e.append(t.element),e.append(this._errorContainer)):(e.append(this._errorContainer),e.append(t.element));var r=this.getDialog();this.focusHandler=function(){e.addClass("focus")},this.blurHandler=function(){e.removeClass("focus")},this.changeHandler=function(){r.performValidate({data:r.getData(),errorsOnly:!0})}},n.prototype.addError=function(t,e){e=this.dialog=this.getDialog()||e,(!this.disabled&&!LPTools.getOption(e.validateOptions,"errorsOnly",!1)||this.hasError())&&(this._hasError=!0,this._errors.push(t),this.buildErrorMessage())},n.prototype.clearErrors=function(){this._errors=[],this._errorContainer&&(this._errorContainer.empty(),this._errorContainerWrapper.removeClass("error"),this._errorContainerWrapper.find("input,select,textarea").unbind("focus",this.focusHandler).unbind("blur",this.blurHandler).unbind("change",this.changeHandler))},n.prototype.clear=function(){this._hasError=!1},n.prototype.adjustView=function(){},n.prototype.buildErrorMessage=function(){this._errorContainer||this.buildError(),this._errorContainerWrapper.addClass("error"),this._errors.forEach(function(t){var e=LPTools.createElement("div","dialogError");e.appendChild(LPTools.createElement("div","validation-img warning")),LPTools.getOption(this._errorOptions,"showErrorLabel",!0)&&e.appendChild(LPTools.createElement("span","errorLabel",Strings.translateString("ERROR")+": ")),e.appendChild(LPTools.createElement("span","",t)),this._errorContainer.append(e)},this)},n.prototype.getDialog=function(){return this.dialog},n.prototype.getElement=function(){return this.input};var o=function(t,e){n.call(this),this.setElement(t),this.disabled=!1,this.dialog=e,this.radioGroup=null};o.prototype=Object.create(n.prototype),o.prototype.constructor=o;var i=function(t){return t instanceof $?t:$(t)};o.prototype.getNativeElement=function(){return this.getElement().get(0)},o.prototype.setElement=function(t){this.input=i(t)},o.prototype.default=function(){this.setValue("")},o.prototype.validate=function(){return!0},o.prototype.focus=function(){this.input.focus()},o.prototype.disable=function(){this.disabled||(this.disabled=!0,this.input.prop("disabled",!0))},o.prototype.enable=function(){this.disabled&&(this.disabled=!1,this.input.prop("disabled",!1))},o.prototype.clear=function(){if(n.prototype.clear.apply(this,arguments),this.input){switch(this.input.attr("type")){case"checkbox":case"radio":this.setValue(!1);break;default:this.setValue("")}this.input.passwordShown&&this.input.hidePassword()}},o.prototype.getValue=function(){switch(this.input.attr("type")){case"radio":if(this.radioGroup)return this.radioGroup.getValue();case"checkbox":return this.input.prop("checked");default:return this.input.val()||""}},o.prototype.setValue=function(t){var e=this.getValue();switch(this.input.attr("type")){case"radio":if(this.radioGroup)return this.radioGroup.setValue(t);case"checkbox":this.input.prop("checked",t);break;default:this.input.val(t)}e!==t&&this.fireOnChange()},o.prototype.addRadioInput=function(t,e){null===this.radioGroup&&(this.radioGroup=new r(t),this.radioGroup.addRadioInput(this.input)),this.radioGroup.addRadioInput(i(e))},o.prototype.fireOnChange=function(){this.onChangeCallback&&this.onChangeCallback(this.getValue())},o.prototype.onChange=function(t){this.onChangeCallback=t,function(t){t.getElement().bind("change",function(){t.fireOnChange()})}(this)};var a=function(t,e){o.apply(this,arguments)};a.prototype=Object.create(o.prototype),a.prototype.constructor=a,a.prototype.setOptions=function(t){this.input.empty();for(var e=0,r=t.length;e<r;++e){var n=t[e],o=n.value,i=n.label;"string"==typeof n&&(o=i=n),this.input.append(LPTools.createElement("option",{value:o},i))}};var p=function(t,e){o.call(this),this.field=t,this.label=void 0===e?t:e?Strings.translateString(e):null};p.prototype=Object.create(o.prototype),p.prototype.constructor=p,p.prototype.build=function(){var t="settingLabel";this.isTopAlign()&&(t+=" topAlign");var e=LPTools.createElement("tr"),r=LPTools.createElement("td");return this.label&&e.appendChild(LPTools.createElement("td",t,this.label)),e.appendChild(r),r.appendChild(this.buildInput()),e},p.prototype.buildInput=function(){var t=this.buildInputElement();return this.setElement(t),t},p.prototype.isTopAlign=function(){return!1};var s=function(t,e,r){p.call(this,t,e),this.options=r};s.prototype=Object.create(p.prototype),s.prototype.constructor=s,s.prototype.buildInputElement=function(){return LPTools.createElement("input",{class:"dialogInput",type:"text"})},s.prototype.buildInput=function(){var t=p.prototype.buildInput.apply(this,arguments),e=LPTools.getOption(this.options,"inputButton",null);if(e){var r=LPTools.createElement("div","relative");r.appendChild(t),this.inputButtonElement=LPTools.createElement("button","dialogInputButton",e);var n=LPTools.getOption(this.options,"inputButtonHandler",null);return n&&function(t){LPPlatform.addEventListener(t.inputButtonElement,"click",function(){n.apply(t)})}(this),r.appendChild(this.inputButtonElement),r}return t},s.prototype.adjustView=function(){if(this.inputButtonElement){var t=parseInt(this.input.css("padding-right"));this.input.css("padding-right",t+$(this.inputButtonElement).outerWidth())}};var u=function(t,e){p.call(this,t,e)};u.prototype=Object.create(p.prototype),u.prototype.constructor=u,u.prototype.buildInput=function(){this.setElement(LPTools.createElement("input",{class:"dialogInput",type:"password"})),this.input.LP_addPasswordEye({includeGenerateButton:!0});var t=this.input.parents();return t[t.length-1]};var l=function(t,e,r,n){this.classToUse=r||"",this.options=n||"",p.call(this,t,e)};l.prototype=Object.create(p.prototype),l.prototype.constructor=l,l.prototype.buildInputElement=function(){return LPTools.createElement("textarea",["dialogInput",this.classToUse])},l.prototype.buildInput=function(){var t=p.prototype.buildInput.apply(this,arguments),e=LPTools.getOption(this.options,"inputButton",null);if(e){var r=LPTools.createElement("div","relative");r.appendChild(t),this.inputButtonElement=LPTools.createElement("button","dialogInputButton copy",e);var n=LPTools.getOption(this.options,"inputButtonHandler",null);return n&&function(t){LPPlatform.addEventListener(t.inputButtonElement,"click",function(){n.apply(t)})}(this),r.appendChild(this.inputButtonElement),r}return t},l.prototype.adjustView=function(){if(this.inputButtonElement){var t=parseInt(this.input.css("padding-right"));this.input.css("padding-right",t+$(this.inputButtonElement).outerWidth())}},l.prototype.isTopAlign=function(){return!0};var h=["January","February","March","April","May","June","July","August","September","October","November","December"],c=["01","02","03","04","05","06","07","08","09","10","11","12"],d=[];!function(){for(var t=0,e=h.length;t<e;++t){var r=t+1,n=(r<10?"0"+r:r)+" - ";d.push(n+Strings.translateString(h[t]))}}();var f=[{value:"",label:""}];!function(){for(var t=0,e=h.length;t<e;++t)f.push({value:h[t],label:d[t]})}();var y=[{value:"",label:""}];!function(){for(var t=0,e=h.length;t<e;++t)y.push({value:c[t],label:d[t]})}();var v=function(t,e){p.call(this,t,LPTools.getOption(e,"label",void 0)),this.includeDay=LPTools.getOption(e,"includeDay",!0)};v.prototype=Object.create(p.prototype),v.prototype.constructor=v,v.prototype.buildInputElement=function(){var t="";this.includeDay||(t="monthYearDate");var e=LPTools.createElement("div",t),r=LPTools.createElement("div","dateInputMonth");return this.monthInput=LPTools.createSelectElement(this.getMonthOptions()),this.dayInput=null,this.includeDay&&(this.dayInput=LPTools.createElement("input",{class:"dialogInput dateInputDay",type:"text"})),this.yearInput=LPTools.createElement("input",{class:"dialogInput dateInputYear",type:"text"}),r.appendChild(this.monthInput),e.appendChild(r),null!==this.dayInput&&e.appendChild(this.dayInput),e.appendChild(this.yearInput),e},v.prototype.clear=function(){this.monthInput&&(this.monthInput.value=""),this.dayInput&&(this.dayInput.value=""),this.yearInput&&(this.yearInput.value="")},v.prototype.getValue=function(){return this.toString()},v.prototype.setValue=function(t){var e=this.parse(t),r="",n="",o="";e&&(r=e.shift(),2===e.length&&(n=e.shift()),o=e.shift()),this.monthInput.value=r,this.includeDay&&(this.dayInput.value=n),this.yearInput.value=o};var g=function(t,e){v.call(this,t,e)};g.prototype=Object.create(v.prototype),g.prototype.constructor=g,g.prototype.toString=function(){var t=this.monthInput.value;return this.dayInput&&(t+=","+this.dayInput.value),t+=","+this.yearInput.value},g.prototype.parse=function(t){return t?t.split(","):null},g.prototype.getMonthOptions=function(){return f};var m=function(t,e){v.call(this,t,e)};return m.prototype=Object.create(v.prototype),m.prototype.constructor=m,m.prototype.toString=function(){var t=this.yearInput.value+"-"+this.monthInput.value;return this.includeDay&&(t+="-"+this.dayInput.value),"-"!==t&&"--"!==t||(t=""),t},m.prototype.parse=function(t){if(t){var e=t.split("-");return e.push(e.shift()),e}return null},m.prototype.getMonthOptions=function(){return y},{ErrorDisplayInput:n,Input:o,TextInput:s,PasswordInput:u,TextArea:l,NumericDateInput:m,AlphaDateInput:g,NestedFields:e,NativeSelect:a,getProperties:t}}();