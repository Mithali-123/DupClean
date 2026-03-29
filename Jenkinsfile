pipeline {
    agent any
    environment {
        // The path to your Python executable we found earlier
        PYTHON_EXE = 'C:\\Users\\vaish\\AppData\\Local\\Microsoft\\WindowsApps\\PythonSoftwareFoundation.Python.3.12_qbz5n2kfra8p0\\python.exe'
        // Your project directory
        PROJECT_DIR = 'C:\\project'
    }
    stages {
        stage('Install Dependencies') {
            steps {
                // Ensures all libraries are present before building
                bat "cd /d ${PROJECT_DIR} && \"${env.PYTHON_EXE}\" -m pip install flask send2trash pyinstaller"
            }
        }
        stage('Build Standalone EXE') {
            steps {
                // The command that creates your app.exe
                bat "cd /d ${PROJECT_DIR} && \"${env.PYTHON_EXE}\" -m PyInstaller --noconsole --onefile --add-data \"templates;templates\" app.py"
            }
        }
    }
    post {
        success {
            echo "Successfully built DupClean! Check the dist folder."
        }
    }
}