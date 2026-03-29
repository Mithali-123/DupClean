bat """
cd /d ${PROJECT_DIR} && ^
\"${env.PYTHON_EXE}\" -m PyInstaller --noconsole --onefile --clean ^
--hidden-import plyer.platforms.win.filechooser ^
--add-data \"templates;templates\" ^
app.py
"""