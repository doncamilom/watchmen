# import logging
# from colorama import Fore, Back, Style, init

# # Initialize colorama
# init(autoreset=True)

# class ColoredFormatter(logging.Formatter):
#     COLORS = {
#         'DEBUG': Fore.BLUE,
#         'INFO': Fore.GREEN,
#         'WARNING': Fore.YELLOW,
#         'ERROR': Fore.RED,
#         'CRITICAL': Fore.RED + Back.WHITE
#     }

#     def format(self, record):
#         log_message = super().format(record)
#         return f"{self.COLORS.get(record.levelname, '')}{log_message}{Style.RESET_ALL}"

# def setup_logger():
#     handler = logging.StreamHandler()
#     formatter = ColoredFormatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
#     handler.setFormatter(formatter)

#     logger = logging.getLogger()
#     logger.addHandler(handler)
#     logger.setLevel(logging.INFO)
#     return logger

# if __name__ == "__main__":
#     logger = setup_logger()
#     logger.info("This is an info message")
#     logger.warning("This is a warning message")
#     logger.error("This is an error message")
# #     logger.critical("This is a critical message")

import logging
from colorama import Fore, Back, Style, init
from IPython import get_ipython

# Initialize colorama
init(autoreset=True)

class ColoredFormatter(logging.Formatter):
    COLORS = {
        'DEBUG': Fore.BLUE,
        'INFO': Fore.GREEN,
        'WARNING': Fore.YELLOW,
        'ERROR': Fore.RED,
        'CRITICAL': Fore.RED + Back.WHITE
    }

    def format(self, record):
        log_message = super().format(record)
        return f"{self.COLORS.get(record.levelname, '')}{log_message}{Style.RESET_ALL}"

def is_notebook():
    try:
        shell = get_ipython().__class__.__name__
        if shell == 'ZMQInteractiveShell':
            return True   # Jupyter notebook or qtconsole
        elif shell == 'TerminalInteractiveShell':
            return False  # Terminal running IPython
        else:
            return False  # Other type (?)
    except NameError:
        return False      # Probably standard Python interpreter

def setup_logger(name='logger'):
    logger = logging.getLogger(name)
    
    # Remove any existing handlers
    for handler in logger.handlers[:]:
        logger.removeHandler(handler)
    
    if is_notebook():
        from IPython.display import HTML, display
        
        class NotebookHandler(logging.Handler):
            def emit(self, record):
                log_entry = self.format(record)
                display(HTML(f'<pre style="margin:0;">{log_entry}</pre>'))
        
        handler = NotebookHandler()
    else:
        handler = logging.StreamHandler()
    
    formatter = ColoredFormatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False
    
    return logger

if __name__ == "__main__":
    logger = setup_logger()
    logger.info("This is an info message")
    logger.warning("This is a warning message")
    logger.error("This is an error message")
    logger.critical("This is a critical message")