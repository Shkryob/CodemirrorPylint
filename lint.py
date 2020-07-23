from pylint import epylint
import os
import tempfile
from flask import Flask, jsonify, request, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/lint', methods=['POST'])
def lint_action():
    file = tempfile.NamedTemporaryFile(delete=False, mode='w')
    file.write(request.form['code'])
    file.close()

    options = ' '.join([
        file.name,
        '--output-format', 'json',
    ])

    (lint_stdout, lint_stderr) = epylint.py_run(return_std=True, command_options=options)

    os.remove(file.name)
    return lint_stdout.getvalue()
