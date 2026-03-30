pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
    }
    stages {
        stage('Cleanup') {
            steps { deleteDir() }
        }
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Build Python Backend') {
            steps {
                bat "pip install -r backend/requirements.txt"
                bat "python -m PyInstaller --noconsole --onefile backend/app.py"
            }
        }
        stage('Build React Frontend') {
            steps {
                dir('frontend') {
                    bat "npm install"
                    bat "npm run build"
                }
            }
        }
        stage('Package Electron App') {
            steps {
                bat "npm install"
                bat "npm run dist"
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'dist/*.exe', fingerprint: true
            echo "Build Successful! Grab your EXE from the artifacts."
        }
    }
}