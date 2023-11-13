# odinbook

### This is a Facebook-inspired website designed to imitate its many features.

## Link to live demo: https://odinbook-orzan.up.railway.app/

### Implemented features:
- Posts, replies and likes
- Friendships, ability to add, remove and confirm friendships
- Lists of current friends, pending friends and potential new friends
- A user page to view every user's friends and posts
- A search feature to find users by name
- Real-time messaging via a chat window that allows users to communicate with friends
- A simple friends list on the side that shows unread messages count and allows the user to open a chat window with them

## How to setup locally

### Clone the repository
```bash
# Clone the repository
$ git clone git@github.com:Wantonfury/odinbook.git
```

### Prepare the server
```bash
# Navigate to the server directory
$ cd server

# Install dependencies
$ npm install
```

### Setup server .env
Create a .env file with the following:
- MONGODB_URI= a link to a mongodb deployment with an 'odinbook' collection
- SESS_SECRET=secret | or any other preferred key
- ORIGIN=http://localhost:3000 | or the website's address if hosted

### Setup the MongoDB database
- In MongoDB make sure you have a collection named odinbook
- Run the following command to populate the database:
  ```bash
  $ node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/odinbook?retryWrites=true&w=majority"
  ```
- Where the link in "" is replaced with a link to the mongodb deployment
- Generated username and password can be found in users.txt file

### Start the server
```bash
# To start the server normally
$ npm run start

# To start the server with nodemon and debug
$ npm run serverstart
```

### Prepare the client
```bash
# Navigate to the client's directory
$ cd ../client

# Install dependencies
$ npm install
```

### Setup client .env
Create a .env file with the following:
- REACT_APP_SERVER=http://localhost:3001

### Start the client
```bash
# Start the client
$ npm start
```

## Built with:
- HTML5, CSS3, JavaScript
- ReactJS, NodeJS, ExpressJS
- MongoDB