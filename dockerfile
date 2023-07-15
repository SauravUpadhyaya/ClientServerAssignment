# Base image
FROM node:14

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install


# Copy the rest of the application files
COPY . .

# Expose the port on which the server will listen
EXPOSE 3000

# Start the server
CMD [ "npm", "start" ]


# COPY soap-server.js package.json package-lock.json /app/

# SOAP server Dockerfile
FROM node:14

WORKDIR /app
COPY soap-server.js package.json package-lock.json /app/

RUN npm install

CMD [ "node", "soap-server.js" ]
# CMD [ "npm", "start" ]

# REST server Dockerfile
FROM node:14

WORKDIR /app
COPY rest-server.js package.json package-lock.json /app/

RUN npm install

CMD [ "node", "rest-server.js" ]
# CMD [ "npm", "start" ]