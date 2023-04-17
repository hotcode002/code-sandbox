# start
FROM ubuntu

# Update path
ENV PATH=$PATH:/root/isolate-master

RUN apt update
RUN apt install --yes build-essential
RUN apt install libcap-dev
RUN apt install unzip
RUN apt install --yes nodejs
RUN apt install --yes npm
RUN apt install --yes wget
RUN apt install --yes default-jdk
RUN apt install --yes python3

# Download and install isolate
WORKDIR /root
RUN wget https://github.com/ioi/isolate/archive/refs/heads/master.zip
RUN unzip master.zip
WORKDIR isolate-master
RUN make isolate

# Configure isolate
RUN cat default.cf >> /usr/local/etc/isolate

# Test isolate
RUN isolate --init
