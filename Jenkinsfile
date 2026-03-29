pipeline {
    agent any
    environment {
        PYTHON_EXE = 'C:\\Users\\vaish\\AppData\\Local\\Microsoft\\WindowsApps\\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\\python.exe'
        PROJECT_DIR = 'C:\\project'
    }
    stages {
        stage('Environment Prep') {
            steps {
                // Ensure the templates folder is actually there before building
                bat "if not exist ${PROJECT_DIR}\\templates mkdir ${PROJECT_DIR}\\templates"
            }
        }
        stage('Build Standalone EXE') {
            steps {
                bat """
                cd /d ${PROJECT_DIR} && ^
                \"${env.PYTHON_EXE}\" -m PyInstaller --noconsole --onefile --clean ^
                --name DupClean_v1.0 ^
                --add-data \"templates;templates\" ^
                app.py
                """
            }
        }
    }
}