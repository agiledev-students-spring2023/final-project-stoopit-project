FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

COPY . .

# Create production build
RUN npm run build

EXPOSE 3000

CMD ["npx","serve","-s","build","-p","3000"]

