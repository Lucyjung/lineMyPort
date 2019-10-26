FROM node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ENV FB_CLIENT_EMAIL = "firebase-adminsdk-4h3lp@fir-1-4004c.iam.gserviceaccount.com"
ENV FBDB_URL = 'https://fir-1-4004c.firebaseio.com'
ENV FB_PRIVATE_ID = '5a73a43c715aa4b161a1f51830457269afc1d2d5'
ENV FB_PROJECT_ID = 'fir-1-4004c'

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 80 80
CMD [ "npm", "start" ]
