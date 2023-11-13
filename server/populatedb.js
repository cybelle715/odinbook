#! /usr/bin/env node

const userArgs = process.argv.slice(2);
const { faker } = require('@faker-js/faker');
const async = require('async');
const fs = require('fs');

const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Friendship = require('./models/friendship');
const Chat = require('./models/chat');
const Message = require('./models/message');

const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(userArgs[0]);
}

main().catch(err => console.log(err));

const createRandomUser = () => {
  return {
    username: faker.internet.userName(),
    password: faker.internet.password(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    age: faker.number.int({ min: 18, max: 50 }),
    pfp: faker.image.avatarLegacy()
  }
}

const users = [];

function createUsers(cb) {
  fs.writeFileSync('./users.txt', '', err => {
    if (err) console.log(err);
  });
  
  User.deleteMany({})
    .then(() => {
      const fakeUsers = faker.helpers.multiple(createRandomUser, { count: 20 });
      
      async.each(fakeUsers, function(fakeUser, cb) {
        fs.appendFileSync('./users.txt', `${fakeUser.username}: ${fakeUser.password} - ${fakeUser.first_name} ${fakeUser.last_name}\n`,
        err => {
          if (err) console.log(err);
        });
        
        const user = new User({ ...fakeUser });
        
        user.save()
          .then(user => {
            users.push(user);
            cb();
          })
          .catch(err => cb(err));
      }, err => cb(err));
    });
}

// Posts

const createRandomPost = (user) => {
  const photo = faker.helpers.maybe(() => faker.image.urlPicsumPhotos());
  
  return {
    message: faker.lorem.paragraphs({ min: 1, max: 3 }),
    photo: photo ? photo : '',
    likes: [],
    date: faker.date.past(),
    user: user._id
  }
}

const createRandomComment = (user, post) => {
  return {
    user: user._id,
    comment: faker.lorem.sentences({ min: 1, max: 3 }),
    post: post._id,
    date: faker.date.between({ from: post.date, to: Date.now() })
  }
}

const posts = [];

function createPosts(cb) {
  Post.deleteMany({})
    .then(() => {
      async.each(users, (user, cb) => {
        const fakePosts = faker.helpers.multiple(() => createRandomPost(user), { count: { min: 1, max: 5 }});
        
        async.each(fakePosts, (fakePost, cb) => {
          const post = new Post({ ...fakePost });
          
          post.save()
            .then(post => {
              posts.push(post);
              cb();
            })
            .catch(err => cb(err));
        }, err => cb(err));
      }, err => cb(err));
    });
}

function interactPosts(cb) {
  async.each(users, (user, cb) => {
    async.each(posts, (post, cb) => {
      const fakeComments = [];
      
      faker.helpers.maybe(() => post.likes = [...post.likes, user._id]);
      faker.helpers.maybe(() => faker.helpers.multiple(() => fakeComments.push(createRandomComment(user, post)), { count: { min: 1, max: 3 }}));
      
      async.each(fakeComments, (fakeComment, cb) => {
        const comment = new Comment({ ...fakeComment });
        
        comment.save()
          .then(() => {
            cb();
          })
          .catch(err => cb(err));
      }, err => {
        if (err) console.log(err);
        
        Post.findOneAndUpdate({ _id: post._id }, post)
          .then(() => cb())
          .catch(err => cb(err));
      });
    }, err => cb(err));
  }, err => cb(err));
}

function setupFriendships(cb) {
  Friendship.deleteMany({})
    .then(() => {
      const userPairs = [];
      
      for (let i = 0; i < users.length - 1; ++i) {
        for (let j = i + 1; j < users.length; ++j) {
          userPairs.push([users[i], users[j]]);
        }
      }
  
      async.each(userPairs, (userPair, cb) => {
        const user1 = userPair[0];
        const user2 = userPair[1];
        
        const friendship = faker.helpers.maybe(() => new Friendship({
          friendship: [user1._id, user2._id],
          pending: faker.helpers.maybe(() => true, { probability: 0.2 }) ? true : false
        }), { probability: 0.7 }); 
        
        if (!friendship) {
          cb();
        } else {
          friendship.save()
            .finally(() => cb());
        }
      }, err => cb(err));
    });
}

async function createMessages(chat, user, usersRead) {
  return faker.helpers.multiple(() => {
    return {
      chat: chat._id,
      sender: user._id,
      date: faker.date.past(),
      read: [user._id, ...usersRead],
      text: faker.lorem.words({ min: 1, max: 20 })
    }
  }, { count: { min: 5, max: 30 }});
}

function setupChats(cb) {
  Chat.deleteMany({})
    .then(() => {
      Message.deleteMany({})
        .then(() => {
          const userPairs = [];
          
          for (let i = 0; i < users.length - 1; ++i) {
            for (let j = i + 1; j < users.length; ++j) {
              userPairs.push([users[i], users[j]]);
            }
          }
          
          async.each(userPairs, (userPair, cb) => {
            const user1 = userPair[0];
            const user2 = userPair[1];
            
            const chat = new Chat({ users: [user1._id, user2._id ]});
            
            chat.save()
              .then(async chat => {
                const fakeMessages = [...(await createMessages(chat, user1, [user2._id])), ...(await createMessages(chat, user2, [user1._id]))];
                
                async.each(fakeMessages, (fakeMessage, cb) => {
                  const message = new Message({ ...fakeMessage });
                  
                  message.save()
                    .catch(err => console.log(err))
                    .finally(() => cb());
                });
              })
              .finally(() => cb());
          }, err => cb(err));
        })
        .catch(err => console.log(err));
    });
}

async.series([
  createUsers,
  createPosts,
  interactPosts,
  setupFriendships,
  setupChats
], function(err, results) {
  if (err) console.log(err);
  setTimeout(() => mongoose.connection.close(), 40000);
  
  console.log('Finished.');
});