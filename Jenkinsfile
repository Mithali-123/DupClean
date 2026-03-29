pipeline {
    agent any
    environment {
        PYTHON_EXE = 'C:\\Users\\vaish\\AppData\\Local\\Microsoft\\WindowsApps\\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\\python.exe'
        PROJECT_DIR = 'C:\\project'
    }
    stages {
        stage('Build Standalone EXE') {
            steps {
                script {
                    // Using single quotes for the add-data paths to avoid syntax errors
                    bat """
                    cd /d ${PROJECT_DIR} && ^
                    \"${env.PYTHON_EXE}\" -m PyInstaller --noconsole --onefile --clean ^
                    --add-data 'templates;templates' ^
                    app.py
                    """
                }
            }
        }
    }
}