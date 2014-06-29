#!/usr/local/bin/python2.7
# -*- coding: UTF-8 -*-

from pylint.epylint import lint
import os
import tempfile
import cgi
import cgitb

cgitb.enable()
form = cgi.FieldStorage()
file = tempfile.NamedTemporaryFile(delete=False)
file.write(form.getfirst("code"))
file.close()

print '''Content-type: text/html

'''

options = ['--reports', 'no',
           '--output-format', 'JSONReporter']

result = lint(file.name, options)


os.remove(file.name)