pipeline {
    agent any  // Use any available agent (e.g., master, worker node)

    environment {
        // Set any environment variables you need
        PORT = 5002
        MONGO_URI = "mongodb+srv://vijay:7QNUpdIEvksw9oLH@clustermern.2ln8smt.mongodb.net/?retryWrites=true&w=majority&appName=Clustermern"
        GOOGLE_CLIENT_ID = "886338139374-6cjmhp3ua9949fdjn66indvu405qgf0k.apps.googleusercontent.com"
        GOOGLE_CLIENT_SECRET = "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"
        JWT_SECRET_KEY = "$$jwt_secret_key$$"
        GOOGLE_PASSWORD = "ctls funh mwyi hvjk"
        GMAIL = "vijayadaran@gmail.com"
        NODE_HOME = '/usr/local/bin'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    sh 'npm run start:nodemon'  
                }
            }
        }
    }

    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Something went wrong, check the logs!'
        }
    }
}