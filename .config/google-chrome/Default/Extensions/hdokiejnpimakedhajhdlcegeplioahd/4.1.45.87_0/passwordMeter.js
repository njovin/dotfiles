!function(t){var e=function(t,e,n){var a=0;if(""===e&&""===t)return 0;var r=t.toLowerCase(),s=e.toLowerCase();if(r===s||s&&r.indexOf(s)!==-1||s&&s.indexOf(r)!==-1)return 1;if(a+=t.length,t.length>0&&t.length<=7)return 1;t.length>=8&&t.length<=15?a+=12:t.length>=16&&(a+=18),t.match(/[a-z]/)&&(a+=1),t.match(/[A-Z]/)&&(a+=5),t.match(/\d/)&&(a+=5),t.match(/.*\d.*\d.*\d/)&&(a+=5),t.match(/[!,@,#,$,%,^,&,*,?,_,~]/)&&(a+=5),t.match(/.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~]/)&&(a+=5),t.match(/(?=.*[a-z])(?=.*[A-Z])/)&&(a+=2),t.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)&&(a+=2),t.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!,@,#,$,%,^,&,*,?,_,~])/)&&(a+=2);for(var i={},o=0,l=0,d=t.length;l<d;++l){var h=t.charAt(l);void 0===i[h]&&(i[h]=1,++o)}return 1===o?2:(a*=2,a<0?a=0:a>100&&(a=100),a)},n=function(n,a,r,s){var i=e(n,r),o="poor",l=Strings.translateString("Invalid");i<17||(i<34?(o="bad",l=Strings.translateString("Weak")):i<51?(o="ok",l=Strings.translateString("Okay")):i<68?(o="good",l=Strings.translateString("Good")):i<85?(o="great",l=Strings.translateString("Secure")):(o="best",l=Strings.translateString("Super!"))),a.attr("class",o),a.css("width",i+"%"),s&&(n?(t(s.parent()).css("opacity",1),s.text(l),s.removeClass("strength")):(t(s.parent()).css("opacity",.5),s.text(Strings.translateString("Strength")),a.attr("class","strength"),a.css("width","100%")))};jQuery.fn.LP_addGeneratePasswordMeter=function(){if(this&&this.length>0){var e=t(LPTools.createElement("div","meter-gen-pass")),a=t(LPTools.createElement("div"));this.parent().append(e.append(a));var r=function(){n(t(this).val(),a,"somestringthathopefullydoesnotmatchpassword")};this.on("input",r).on("change",r)}},jQuery.fn.LP_addPasswordMeter=function(e,a){var r=LPTools.createElement("div","meterContainer"),s=LPTools.createElement("div","meter"),i=LPTools.createElement("div"),o=null;s.appendChild(i),r.appendChild(s),s=t(s),i=t(i),a&&(o=LPTools.createElement("label","meterLabel","Strength"),r.appendChild(o),o=t(o),s.css("width","88%"),o.css("width","12%")),this.parent().append(r),this.LP_input("passwordMeter",function(t){n(t,i,e?e.val():"",o)})}}(jQuery);