# start
FROM ubuntu

# Update path
ENV PATH=$PATH:/root/isolate-master

RUN apt update
RUN apt install --yes build-essential
RUN apt install libcap-dev
RUN apt install unzip
RUN apt install --yes curl
RUN apt install --yes vim
RUN apt install --yes nodejs
RUN apt install --yes npm 
RUN apt install --yes wget
# RUN apt install --yes default-jdk
RUN apt install --yes python3

# Install java 20. Default jdk that comes with a regular apt install installs version 11.
# Get the repository zip file from here - https://jdk.java.net/20/
# Earlier versions are also available. Pick the link under Builds -> Linux/x64
RUN curl -fSsL "https://download.java.net/java/GA/jdk20.0.1/b4887098932d415489976708ad6d1a4b/9/GPL/openjdk-20.0.1_linux-x64_bin.tar.gz" -o /tmp/openjdk20.tar.gz
RUN mkdir /usr/local/openjdk20
RUN tar -xf /tmp/openjdk20.tar.gz -C /usr/local/openjdk20 --strip-components=1
RUN rm /tmp/openjdk20.tar.gz
RUN ln -s /usr/local/openjdk20/bin/javac /usr/local/bin/javac
RUN ln -s /usr/local/openjdk20/bin/java /usr/local/bin/java
RUN ln -s /usr/local/openjdk20/bin/jar /usr/local/bin/jar

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

# Create a new directory to move the server code
WORKDIR /root/code-sandbox

# # Move the server code into Docker
# COPY . .

# # Run npm install
# RUN npm install

# # Expose port 8080
# EXPOSE 8080

# # Run the nodejs server
# CMD [ "npm", "run", "dev"]
