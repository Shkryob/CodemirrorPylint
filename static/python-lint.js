function pythonValidator(value, lintAsync, options, cm) {
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

    var xmlhttp = getXmlHttp()
    xmlhttp.open("POST", "/lint", true);
    xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                var result = [];
                var messages = JSON.parse(xmlhttp.responseText);
                for (var i in messages) {
                    var message = messages[i];
                    var severity = 'warning';
                    if (message.type === 'error' || message.type === 'fatal') {
                        severity = 'error';
                    }

                    result.push({message: message.message,
                                severity:severity,
                                from: CodeMirror.Pos(message.line - 1, message.column),
                                to: CodeMirror.Pos(message.line - 1, message.column)});
                }

                lintAsync(cm, result);
            }
        }
    };

    xmlhttp.send("code=" + encodeURIComponent(value));
}
