pipeline {
  agent {
    docker {
      image 'docker:26-dind'
      args '-u root -v /var/run/docker.sock:/var/run/docker.sock'
    }
  }

  environment {
    IMAGE_PREFIX = 'pm-backend'
    DOCKER_CONFIG = "${WORKSPACE}/.docker"
  }

  stages {

    stage('Clone Repository') {
      steps {
        git branch: 'main',
            url: 'https://github.com/mohit838/project-management-backend.git'
      }
    }

    stage('Resolve Git Commit') {
      steps {
        sh 'git config --global --add safe.directory "$WORKSPACE"'
        script {
          env.GIT_COMMIT_FULL = sh(
            script: 'git rev-parse HEAD',
            returnStdout: true
          ).trim()
          env.GIT_COMMIT_SHORT = sh(
            script: 'git rev-parse --short=7 HEAD',
            returnStdout: true
          ).trim()
        }
      }
    }

    stage('Prepare Docker') {
      steps {
        sh '''
          mkdir -p "$DOCKER_CONFIG"
          docker version
        '''
      }
    }

    stage('Build Backend Image') {
      steps {
        sh 'docker build -t ${IMAGE_PREFIX}:${GIT_COMMIT_SHORT} .'
      }
    }

    stage('Stop Old Containers') {
      steps {
        sh '''
          docker ps -a --filter "name=${IMAGE_PREFIX}" -q | xargs -r docker stop
          docker ps -a --filter "name=${IMAGE_PREFIX}" -q | xargs -r docker rm
        '''
      }
    }

    stage('Load Environment File') {
      steps {
        withCredentials([
          file(credentialsId: 'pm-backend-env', variable: 'ENV_FILE')
        ]) {
          sh '''
            echo "Loading environment file from Jenkins credentials"
            cp "$ENV_FILE" .env
            chmod 600 .env
          '''
        }
      }
    }

    stage('Deploy with Docker Compose') {
      steps {
        script {
           // We pass the built image tag to docker-compose via an environment variable
           sh """
            echo "Deploying commit ${GIT_COMMIT_SHORT}"
            export APP_IMAGE=${IMAGE_PREFIX}:${GIT_COMMIT_SHORT}
            docker-compose up -d
           """
        }
      }
    }
  }

  post {
    success {
      echo "Deployment successful (${GIT_COMMIT_SHORT})"
    }
    failure {
      echo "Deployment failed (${GIT_COMMIT_SHORT})"
    }
  }
}
