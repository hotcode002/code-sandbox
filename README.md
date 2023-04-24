## Environment Variable

Set up a .env file at the root folder and use the following variable

token-xxx

This token is currently used for authorization.

## LOCAL environment

1. Create a folder like so C:/Users/siva/Documents/poc/code-sandbox
2. clone the code into this folder
3. Use docker compose to up the server

```bash
docker-compose -f docker-compose-local.yml up
```

4. To shut down the server

```bash
docker-compose -f docker-compose-local.yml down
```

If the starting image needs to be updated, run the following command before starting the server. This removes stale images.

```bash
docker-compose -f docker-compose-local.yml down --rmi all
```

## DEV environment

### Setting up VM

Since isolate needs to run in privileged mode, we have to use VMs to run isolate in docker. In order to do that,

1. Create a VM image
2. Make a back up of this VM as a bootable image
3. Use this image to create an instance template.
4. Create an instance group with this instance template
5. Assign a load balancer in front of this instance group

#### Create a VM image

The reason why we are creating a custom VM image is so that we can make a bootable image out of this that can be used in an instance template. Create a new VM image from ubuntu.

Install docker

```bash
sudo apt-get remove docker docker-engine docker.io containerd runc
```

```bash
sudo apt-get update
sudo apt-get install \
    ca-certificates \
    curl \
    gnupg
```

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

```bash
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

```bash
sudo apt-get update
```

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

```bash
sudo apt install docker-compose
```

In the home directory, clone this repo.

```bash
git clone https://github.com/hotcode002/code-sandbox.git
```

```bash
cd code-sandbox
```

```bash
git checkout dev
```

It is easier to build all images (isolate image with tags _local_, _dev_, _latest_) on the local machine as opposed to the cloud. Just run

```bash
sudo docker build . -f docker/Dockerfile.dev -t hotcode002/isolate:dev
```

and publish it as follows.

Login with hotcode002 user

```bash
sudo docker login hotcode002
```

** Only the local version of the image (hotcode002/isolate:local) has the code outside of the container. This is so that we can development outside of the container and mount the code into the container using a volume mapping. _dev_ and _prod_ versions of these images contain the code as well. So there is no need for volume mapping **

In case you want to build the docker on a cloud vm (ubuntu) follow these steps.

** START Linux Specific steps to build the isolate image **

Builds a base docker image with isolate and language runtime for dev environment

```bash
sudo docker build . -f docker/Dockerfile.dev -t hotcode002/isolate:dev
```

If you get an error like this

```bash
Cannot autolaunch D-Bus without X11 $DISPLAY
```

Run these additional commands before building the docker image

```bash
sudo apt-get install pass gnupg2
```

```bash
gpg2 --gen-key
```

```bash
pass init hotcode
```

Login to docker hub to push the dev version of the docker image. This image will be used to start up the container using docker-compose

```bash
sudo docker login hotcode002
```

** END Linux Specific steps to build the isolate image **

Checkout that the docker image **hotcode002/isolate:dev** has been created.

```bash
sudo docker images
```

Push the image to the docker hub repository.

```bash
sudo docker push hotcode002/isolate:dev
```

Test that docker is working by running docker-compose up. But before doing, make sure that you are in the right branch. If you are in the **dev** environment linux machine, switch to the dev branch

```bash
git checkout dev
```

```bash
sudo docker-compose -f docker-compose-dev.yml up
```

Once the docker instance is up and running, check that it is working by firing a simple Hello World Program.

```bash
curl -d '{"language":"PYTHON", "source_code":"print(\"Hello World Python\")"}' -H "Content-Type: application/json" \
-H "Authorization: Bearer xxx" \
-X POST http://localhost/submissions
```

We don't do direct deployments from git. Since isolate container needs to run in the VM in privileged mode, we create a virtual machine with the container downloaded on to it and then run docker-compose up as a start-up command everytime the virtual machine is run.

## Docker Image

### Build Docker Image

This is only required when the docker image is changed.

To create a docker image, from Dockerfile

```bash
docker build . -t isoate
```

This builds a docker image based off of the Dockerfile in the current directory and _tags_ it as _isolate_.

To build the docker image to be pushed to docker hub, use

```bash
docker build . -t siva002/isolate:latest
```

### Push Docker Image

To push the docker image to docker hub first log in to docker hub

```bash
docker login
```

** Do not use the email as the user id. Instead user the actual user id.**

After logged in, the docke image can be pushed to docker hub as follows.

```bash
docker push siva002/isolate:latest
```

Each of the docker-compose files use a different version of the isolate image.

| Environment | image tag |
| ----------- | --------- |
| local       | local     |
| dev         | dev       |
| prod        | prod      |

When creating the docker image for each environment, tag accordingly and push.
