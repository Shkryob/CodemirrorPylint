// Distributed under an MIT license: http://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {


  function validator(text, options) {
    var xmlhttp = getXmlHttp()
    xmlhttp.open("POST", "lint.py", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.send("code=" + encodeURIComponent(text));
    result = [];
    var messages = JSON.parse(xmlhttp.responseText);
    for (var i in messages) {
        var message = messages[i];
        result.push({message: message.message,
                    severity: message.code,
                    from: CodeMirror.Pos(message.line-1, message.column),
                    to: CodeMirror.Pos(message.line-1, message.column)});
    }
    return result;
  }

  CodeMirror.registerHelper("lint", "python", validator);
 
 function getXmlHttp(){
    try {
        return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (ee) {
        }
    }
    if (typeof XMLHttpRequest!='undefined') {
        return new XMLHttpRequest();
    }
}
});
