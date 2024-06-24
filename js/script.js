$(".toggle-password").click(function() {    
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }); 

  $('#MyButton').click(function (e) {
    var exportInstanceVal = $("[name='exportInstance']").val().replace(/^https?\:\/\//i, "");
    var exportUsernameVal = $("[name='exportUsername']").val();
    var exportPasswordFieldVal = $("[name='exportPasswordField']").val();

    var importInstanceVal = $("[name='importInstance']").val().replace(/^https?\:\/\//i, "");
    var importUsernameVal = $("[name='importUsername']").val();
    var importPasswordFieldVal = $("[name='importPasswordField']").val();

    var api= "api/v3"
    var loginEndpoint = "user/login"

    var exportEndpoint = "user/export_settings"
    var exportloginURL = `https://${exportInstanceVal}/${api}/${loginEndpoint}` 
    var exportURL = `https://${exportInstanceVal}/${api}/${exportEndpoint}` 

    var importEndpoint = "user/import_settings"
    var importloginURL = `https://${importInstanceVal}/${api}/${loginEndpoint}` 
    var importURL = `https://${importInstanceVal}/${api}/${importEndpoint}` 

    var exportAuthData = new Object();
    exportAuthData.username_or_email = exportUsernameVal;
    exportAuthData.password = exportPasswordFieldVal;
    var jsonExportAuthData = JSON.stringify(exportAuthData);

    var importAuthData = new Object();
    importAuthData.username_or_email = importUsernameVal;
    importAuthData.password = importPasswordFieldVal;
    var jsonImportAuthData = JSON.stringify(importAuthData);

    var exportedUserDataJSON = null;

    $.ajax({
        type: "POST",
        //dataType: "json",
        url: exportloginURL,
        data: jsonExportAuthData,
        contentType: "application/json",
        success: function(result){
            var exportJWT = result.jwt;
            console.log("Export JWT: " + exportJWT);
            appendToLogField("success", `Successfully got authentication from ${exportUsernameVal}@${exportInstanceVal}.`);
            $.ajax({
                url: exportURL,
                headers: {'Authorization': `Bearer ${exportJWT}`},
                //dataType: "json",
                success: function(result){
                    exportedUserDataJSON = JSON.stringify(result);
                    //console.log(`Exported user data from ${exportUsernameVal}@${exportInstanceVal}:`);
                    appendToLogField("success", `Successfully exported user data from ${exportUsernameVal}@${exportInstanceVal}.`);
                    console.log(exportedUserDataJSON);
                    $.ajax({
                        type: "POST",
                        //dataType: "json",
                        url: importloginURL,
                        data: jsonImportAuthData,
                        contentType: "application/json",
                        success: function(result){
                            var importJWT = result.jwt;
                            console.log("Import JWT: " + importJWT);
                            appendToLogField("success", `Successfully authenticated to ${importUsernameVal}@${importInstanceVal}.`);
                            $.ajax({
                                type: "POST",
                                url: importURL,
                                headers: {'Authorization': `Bearer ${importJWT}`},
                                contentType: "application/json",
                                //dataType: "json",
                                data: exportedUserDataJSON,
                                success: function(result){
                                    appendToLogField("success", `Successfully imported user data from ${exportUsernameVal}@${exportInstanceVal} to ${importUsernameVal}@${importInstanceVal}.`);
                                    appendToLogField("success", 'Operations complete. Enjoy!');
                                    
                
                                },
                                error: function(xhr, textStatus, errorThrown) { 
                                    appendToLogField("error", `Couldn't import user data from ${exportUsernameVal}@${exportInstanceVal} to ${importUsernameVal}@${importInstanceVal}. Error - ` + xhr.status + ': ' + xhr.statusText); 
                                } 
                            });
                        },
                        error: function(xhr, textStatus, errorThrown) { 
                            appendToLogField("error", `Couldn't authenticate to ${importUsernameVal}@${importInstanceVal}. Error - ` + xhr.status + ': ' + xhr.statusText);
                        }       
                    });

                },
                error: function(xhr, textStatus, errorThrown) { 
                    appendToLogField("error", `Couldn't export user data from ${exportUsernameVal}@${exportInstanceVal}. Error - ` + xhr.status + ': ' + xhr.statusText); 
                }       
            });
        },
        error: function(xhr, textStatus, errorThrown) { 
            appendToLogField("error", `Couldn't get authentication from ${exportUsernameVal}@${exportInstanceVal}. Error - ` + xhr.status + ': ' + xhr.statusText);
        }       
    });
});

function appendToLogField(nature, text){
    var logField = document.getElementById("logField");
    var container = document.createElement("span");
    var text = document.createTextNode(text);
    var br = document.createElement("br");
    container.appendChild(text);
    container.appendChild(br);
    if (nature == "error"){
        container.style.color = "red";
    } else {
        container.style.color = "green";
    }
    

    logField.appendChild(container);
    
    
}
