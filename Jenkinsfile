pipeline {
    // This assumes your Jenkins agent is running on Windows to compile the .exe
    agent any 

    environment {
        // You will need to add your GitHub Personal Access Token to Jenkins Credentials
        GITHUB_TOKEN = credentials('github-token-credentials-id')
        APP_VERSION = "1.0.${BUILD_NUMBER}" // Automatically increments version based on Jenkins build
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling latest code from GitHub...'
                checkout scm
            }
        }

        stage('Build Python Backend') {
            steps {
                echo 'Compiling Python to executable...'
                // Using 'bat' instead of 'sh' since we are on a Windows node
                bat 'pip install -r requirements.txt'
                bat 'pyinstaller app.spec'
            }
        }

        stage('Build React Frontend') {
            steps {
                echo 'Compiling Vite/React UI...'
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Package Electron App') {
            steps {
                echo 'Packaging the final Electron .exe...'
                bat 'npm install'
                // The -c.extraMetadata.version injects the Jenkins build number into the app!
                bat "npm run dist -- -c.extraMetadata.version=${APP_VERSION}"
            }
        }

        stage('Publish to GitHub') {
            steps {
                echo 'Uploading new release to GitHub...'
                // Uses the GitHub CLI (gh) to automatically create a release and upload the .exe
                bat """
                echo %GITHUB_TOKEN% | gh auth login --with-token
                gh release create v%APP_VERSION% "release/DupClean Pro Setup %APP_VERSION%.exe" --title "DupClean Pro v%APP_VERSION%" --notes "Automated CI/CD Release build #%BUILD_NUMBER%"
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully! New release published to GitHub."
        }
        failure {
            echo "❌ Pipeline failed. Check the Jenkins console output for errors."
        }
    }
}