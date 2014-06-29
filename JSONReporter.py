import json

from pylint.interfaces import IReporter
from pylint.reporters import BaseReporter, Message

from logilab.common.ureports import TextWriter

class JSONReporter(BaseReporter):
    """reports messages and layouts in plain text"""

    __implements__ = IReporter
    name = 'json'
    extension = 'json'

    def __init__(self, output=None):
        BaseReporter.__init__(self, output)
        self.msgs = []
    
    def set_output(self, output=None):
        """set output stream

        messages buffered for old output is processed first"""
        if self.out and self.msgs:
            self._display(Section())
        BaseReporter.set_output(self, output)
    
    def add_message(self, msg_id, location, msg):
        """manage message of different type and in the context of path"""
        m = Message(self, msg_id, location, msg)
        if m.C == 'E' or m.C == 'F':
            code = 'error'
        else:
            code = 'warning'
        message = {
            'message': m.msg,
            'line': m.line,
            'column': m.column,
            'code': code
        }
        self.msgs.append(message)
        
    def on_close(self, stats, previous_stats):
        """global end of analyzis"""
        self.writeln(json.dumps(self.msgs))