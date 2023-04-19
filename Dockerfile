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
RUN apt install --yes default-jdk
RUN apt install --yes python3

# Install REDIS
RUN curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
RUN echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
RUN apt install redis

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
WORKDIR /root/server

# Move the server code into Docker
COPY . .

# Run npm install
RUN npm install

# Expose port 8080
EXPOSE 8080

# Run the nodejs server
CMD [ "npm", "run", "dev"]
