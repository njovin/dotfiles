function do_continue(){dounload=!1,g_ismaxthon&&redirect_to_url("congratulations.html"),document.getElementById("yes").checked&&getBG().addprofile(),g_ismaxthon||redirect_to_url("congratulations.html")}document.title=gs("Configure Form Fill"),document.getElementById("lp_docwrite_configure_formfill1")&&set_innertext(document.getElementById("lp_docwrite_configure_formfill1"),gs("Configure Form Fill")),document.getElementById("lp_docwrite_configure_formfill2")&&set_innertext(document.getElementById("lp_docwrite_configure_formfill2"),gs("LastPass can automatically fill web page forms with a single click.  Using automatic 'Form Filling' will not only save you time, but will also enhance your security when shopping online.")),document.getElementById("lp_docwrite_configure_formfill3")&&set_innertext(document.getElementById("lp_docwrite_configure_formfill3"),gs("Would you like to set up a Form Filling profile now?")),document.getElementById("lp_docwrite_configure_formfill4")&&set_innertext(document.getElementById("lp_docwrite_configure_formfill4"),gs("Yes, let me enter and review data that will be used when filling forms")),document.getElementById("lp_docwrite_configure_formfill5")&&set_innertext(document.getElementById("lp_docwrite_configure_formfill5"),gs("No, I do not want LastPass to help me fill forms automatically")),document.addEventListener("DOMContentLoaded",function(){window.addEventListener("unload",welcome_unload),document.getElementById("continue").addEventListener("click",do_continue),document.getElementById("cancel").addEventListener("click",function(){getBG().closecurrenttab("configure_formfill.html")})});