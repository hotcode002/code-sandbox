To up Docker

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

.
