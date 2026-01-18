pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.50.0-jammy'
            args '--ipc=host' // Recommended for Playwright
        }
    }

    environment {
        CI = 'true'
        // Ensure paths for local npm installs are found
        PATH = "${WORKSPACE}/node_modules/.bin:${PATH}"
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo 'Installing Root Dependencies (Playwright)...'
                sh 'npm ci'
                
                echo 'Installing Backend Dependencies...'
                dir('backend') {
                    sh 'npm ci'
                }

                echo 'Installing Frontend Dependencies...'
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Start Backend in background
                    echo 'Starting Backend...'
                    sh 'cd backend && npm start &'
                    
                    // Start Frontend in background
                    echo 'Starting Frontend...'
                    sh 'cd frontend && npm run dev &'

                    // Wait for services to be up (simple wait)
                    sleep 10
                    
                    // Run Playwright
                    echo 'Running E2E Tests...'
                    // Ensure Playwright installs browsers if not in docker (or use installed ones)
                    // Since we are in the playwright docker image, browsers are there.
                    sh 'npx playwright test'
                }
            }
            post {
                always {
                    // Archive the report
                    publishHTML (target : [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report'
                    ])
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building Frontend...'
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
    }
}
