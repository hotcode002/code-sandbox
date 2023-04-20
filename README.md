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

## DEV environment

We don't do direct deployments from git. Since isolate container needs to run in the VM in privileged mode, we create a virtual machine with the container downloaded on to it and then run docker-compose up as a start-up command everytime the virtual machine is run.
