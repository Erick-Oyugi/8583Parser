def CONTAINER_NAME = 'iso-service'
def CONTAINER_TAG = 'latest'
def SERVER_PORT = 3001


pipeline {
    agent any

    environment {
        APP_PORT="3000"
        ISO_SERVICE_SANDBOX_HOST="192.168.19.48"
        ISO_SERVICE_SANDBOX_PORT="25016"
        ISO_SERVICE_PRODUCTION_HOST="192.168.19.48"
        ISO_SERVICE_PRODUCTION_PORT="29002"
        SSL_PATH="/etc/ssl"
        NODE_ENV="UAT"
    }


    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage("add env file") {
            steps {
                addEnvFile()
            }
        }

        stage('cleanup docker') {
            steps {
                imagePrune(CONTAINER_NAME)
            }
        }

        stage('Build') {
            steps {
                buildImage(CONTAINER_NAME, CONTAINER_TAG)
            }
        }

        stage('Deploy') {
            steps {
                runContainer(CONTAINER_NAME, CONTAINER_TAG, SERVER_PORT)
            }
        }
    }
}



def addEnvFile() {
    echo "Adding environment variables...\n"
    def vars = """ISO_SERVICE_SANDBOX_HOST=${env.ISO_SERVICE_SANDBOX_HOST}\n
                APP_PORT=${env.APP_PORT}\n
                SSL_PATH=${env.SSL_PATH}\n
                NODE_ENV=${env.NODE_ENV}\n
                ISO_SERVICE_PRODUCTION_HOST=${env.ISO_SERVICE_PRODUCTION_HOST}\n
                ISO_SERVICE_PRODUCTION_PORT=${env.ISO_SERVICE_PRODUCTION_PORT}\n
                ISO_SERVICE_SANDBOX_PORT=${env.ISO_SERVICE_SANDBOX_PORT}\n"""
    sh "echo '$vars' > .env"
    sh "echo 'environment variables added\n'"
    }

def imagePrune(containerName) {
    echo "Pruning images and stopping $containerName ...\n"
    sh "docker image prune -f"
    sh "docker stop $containerName || true"
    sh "docker rm $containerName || true"
    echo "Image pruned & container stopped.\n"
}

def buildImage(containerName, containerTag) {
    echo "Building image...\n"
    sh "docker build -t $containerName:$containerTag ."
    echo "Image build complete.\n"
}

def runContainer(containerName, containerTag, port) {
    echo "Running container...\n"
    sh "docker run -v ${env.SSL_PATH}:${env.SSL_PATH} -d -p $port:${env.APP_PORT} --name $containerName $containerName:$containerTag"
    echo "Container running on port $port.\n"
}
