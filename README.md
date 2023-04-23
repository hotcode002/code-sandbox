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

The reason why we are creating a custom VM image is so that we can make a bootable image out of this that can be used in an instance template. Create a new VM image from ubuntu

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

Builds a base docker image with isolate and language runtime for dev environment

```bash
docker build . -f docker/Dockerfile.dev -t hotcode002/isolate:dev
```

Login to docker hub to push the dev version of the docker image. This image will be used to start up the container using docker-compose

** Only the local version of the image (hotcode002/isolate:local) has the code outside of the container. This is so that we can development outside of the container and mount the code into the container using a volume mapping. _dev_ and _prod_ versions of these images contain the code as well. So there is no need for volume mapping **

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
