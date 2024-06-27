
$( document ).ready(function() {
    $('#editorDiv').hide();
    $('#firstArrow').hide();
    $('#submitEditor').hide();

});

$(".toggle-password").click(function() {    
    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
      input.attr("type", "text");
    } else {
      input.attr("type", "password");
    }
  }); 

var transferOrDownload = 'transfer';

$('#dataDownload').click(function(){
    if ($('#dataDownload').is(":checked"))
        {
            $("#MyButton").prop('value', 'Download user data');
            $('#importFields').hide();
            $('#secondArrow').hide();
            transferOrDownload = 'download';
        }
    else {
            $("#MyButton").prop('value', 'Transfer account settings');
            $('#importFields').show();
            $('#secondArrow').show();
            transferOrDownload = 'transfer';
    }
});

var modifyJSON = false;

$('#modifyJSON').click(function(){
    if ($('#modifyJSON').is(":checked"))
        {
            modifyJSON = true;
            $('#editorDiv').show();
            $('#firstArrow').show();
        }
    else {
            modifyJSON = false;
            $('#editorDiv').hide();
            $('#firstArrow').hide();
    }
    
});


function formatTime(number) {
    return number < 10 ? '0' + number : number;
}

let now = new Date();
let hours = formatTime(now.getHours());
let minutes = formatTime(now.getMinutes());
let seconds = formatTime(now.getSeconds());
let ms = formatTime(now.getMilliseconds());

  $('#MyButton').click(function (e) {
    $('#MyButton').hide();
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

    if(!$.trim($("[name='export2FA']").value).length) {
        var jsonExportAuthData = JSON.stringify(exportAuthData);
    } else {
        exportAuthData.totp_2fa_token = $("[name='export2FA']").val();
        var jsonExportAuthData = JSON.stringify(exportAuthData);
    }

    

    var importAuthData = new Object();
    importAuthData.username_or_email = importUsernameVal;
    importAuthData.password = importPasswordFieldVal;

    if(!$.trim($("[name='import2FA']").value).length) {
        var jsonImportAuthData = JSON.stringify(importAuthData);
    } else {
        exportAuthData.totp_2fa_token = $("[name='import2FA']").val();
        var jsonImportAuthData = JSON.stringify(importAuthData);
    }

    var exportedUserDataJSON = null;
    var exportJWT = null;
    var importJWT = null;

    $.ajax({
        type: "POST",
        //dataType: "json",
        url: exportloginURL,
        data: jsonExportAuthData,
        contentType: "application/json",
        success: function(result){
            exportJWT = result.jwt;
            console.log("Export JWT: " + exportJWT);
            appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Successfully got authentication from ${exportUsernameVal}@${exportInstanceVal}.`);
            $.ajax({
                url: exportURL,
                headers: {'Authorization': `Bearer ${exportJWT}`},
                //dataType: "json",
                success: function(result){
                    exportedUserDataJSON = JSON.stringify(result);
                    //console.log(`Exported user data from ${exportUsernameVal}@${exportInstanceVal}:`);
                    appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Successfully exported user data from ${exportUsernameVal}@${exportInstanceVal}.`);
                    console.log(exportedUserDataJSON);
                    if (transferOrDownload == 'download' && modifyJSON == false) {
                        exportedUserDataJSONblobby = [exportedUserDataJSON];
                        var blob1 = new Blob(exportedUserDataJSONblobby, { type: "text/plain;charset=utf-8" });
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob1);
                        appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Operations complete, Download initiated. Enjoy!`);
                        var a = $("<a />");
                        a.attr("download", `${exportUsernameVal}@${exportInstanceVal}.json`);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                        
                    } else if (transferOrDownload == 'download' && modifyJSON == true) {
                        appendToLogField("success", 'Building your editor.');
                        var editor = new JSONEditor(document.getElementById('editor_holder'),{
                            schema: {},
                            startval: result,
                            theme: 'bootstrap3'
                        });
                        $('#submitEditor').show();

                        // Hook up the submit button to log to the console
                        document.getElementById('submitEditor').addEventListener('click',function() {
                        // Get the value from the editor
                        console.log(editor.getValue());
                        exportedUserDataJSONblobby = [JSON.stringify(editor.getValue())];
                        var blob1 = new Blob(exportedUserDataJSONblobby, { type: "text/plain;charset=utf-8" });
                        var url = window.URL || window.webkitURL;
                        link = url.createObjectURL(blob1);
                        appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Operations complete, Download initiated. Enjoy!`);
                        var a = $("<a />");
                        a.attr("download", `${exportUsernameVal}@${exportInstanceVal}.json`);
                        a.attr("href", link);
                        $("body").append(a);
                        a[0].click();
                        $("body").remove(a);
                        appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Operations complete, Download initiated. Enjoy!`);
                        $('#editorDiv').hide();
                        $('#firstArrow').hide();
                        editor.destroy();
                        });
                    } else if (transferOrDownload == 'transfer' && modifyJSON == false) {
                        $.ajax({
                            type: "POST",
                            //dataType: "json",
                            url: importloginURL,
                            data: jsonImportAuthData,
                            contentType: "application/json",
                            success: function(result){
                                importJWT = result.jwt;
                                console.log("Import JWT: " + importJWT);
                                appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Successfully authenticated to ${importUsernameVal}@${importInstanceVal}.`);
                                $.ajax({
                                    type: "POST",
                                    url: importURL,
                                    headers: {'Authorization': `Bearer ${importJWT}`},
                                    contentType: "application/json",
                                    //dataType: "json",
                                    data: exportedUserDataJSON,
                                    success: function(result){
                                        appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Successfully imported user data from ${exportUsernameVal}@${exportInstanceVal} to ${importUsernameVal}@${importInstanceVal}.`);
                                        appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Operations complete. Enjoy!`);
                                        
                    
                                    },
                                    error: function(xhr, textStatus, errorThrown) { 
                                        appendToLogField("error", `${hours}:${minutes}:${seconds}:${ms} - Couldn't import user data from ${exportUsernameVal}@${exportInstanceVal} to ${importUsernameVal}@${importInstanceVal}. Error - ` + xhr.status + ': ' + xhr.responseText); 
                                        $('#MyButton').show();
                                    } 
                                });
                            },
                            error: function(xhr, textStatus, errorThrown) { 
                                appendToLogField("error", `${hours}:${minutes}:${seconds}:${ms} - Couldn't authenticate to ${importUsernameVal}@${importInstanceVal}. Error - ` + xhr.status + ': ' + xhr.responseText);
                                $('#MyButton').show();
                            }       
                        });
                    } else {
                        appendToLogField("success", 'Building your editor.');
                        var editor = new JSONEditor(document.getElementById('editor_holder'),{
                            schema: {},
                            startval: result,
                            theme: 'bootstrap3'
                        });
                        $('#submitEditor').show();
                         // Hook up the submit button to log to the console
                         document.getElementById('submitEditor').addEventListener('click',function() {
                                exportedUserDataJSON = JSON.stringify(editor.getValue());
                                appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Editing finished, importing data to target instance.`);
                                $.ajax({
                                    type: "POST",
                                    //dataType: "json",
                                    url: importloginURL,
                                    data: jsonImportAuthData,
                                    contentType: "application/json",
                                    success: function(result){
                                        importJWT = result.jwt;
                                        console.log("Import JWT: " + importJWT);
                                        appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Successfully authenticated to ${importUsernameVal}@${importInstanceVal}.`);
                                        $.ajax({
                                            type: "POST",
                                            url: importURL,
                                            headers: {'Authorization': `Bearer ${importJWT}`},
                                            contentType: "application/json",
                                            //dataType: "json",
                                            data: exportedUserDataJSON,
                                            success: function(result){
                                                appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Successfully imported user data from ${exportUsernameVal}@${exportInstanceVal} to ${importUsernameVal}@${importInstanceVal}.`);
                                                appendToLogField("success", `${hours}:${minutes}:${seconds}:${ms} - Operations complete. Enjoy!`);
                                                $('#editorDiv').hide();
                                                $('#firstArrow').hide();
                                                editor.destroy();
                                                
                            
                                            },
                                            error: function(xhr, textStatus, errorThrown) { 
                                                appendToLogField("error", `${hours}:${minutes}:${seconds}:${ms} - Couldn't import user data from ${exportUsernameVal}@${exportInstanceVal} to ${importUsernameVal}@${importInstanceVal}. Error - ` + xhr.status + ': ' + xhr.responseText); 
                                                $('#MyButton').show();
                                            } 
                                        });
                                    },
                                    error: function(xhr, textStatus, errorThrown) { 
                                        appendToLogField("error", `${hours}:${minutes}:${seconds}:${ms} - Couldn't authenticate to ${importUsernameVal}@${importInstanceVal}. Error - ` + xhr.status + ': ' + xhr.responseText);
                                        $('#MyButton').show();
                                    }       
                                });
                            
                            });
                    }
                },
                error: function(xhr, textStatus, errorThrown) { 
                    appendToLogField("error", `${hours}:${minutes}:${seconds}:${ms} - Couldn't export user data from ${exportUsernameVal}@${exportInstanceVal}. Error - ` + xhr.status + ': ' + xhr.responseText); 
                    $('#MyButton').show();
                }       
            });
        },
        error: function(xhr, textStatus, errorThrown) { 
            appendToLogField("error", `${hours}:${minutes}:${seconds}:${ms} - Couldn't get authentication from ${exportUsernameVal}@${exportInstanceVal}. Error - ` + xhr.status + ': ' + xhr.responseText);
            $('#MyButton').show();
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
