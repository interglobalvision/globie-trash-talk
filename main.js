// NPM

var slack = require('slack-client'),
  tumblr = require('tumblr.js'),
  randomNumber = require('random-number');

// SET UP SOME VARIABLES FROM THE ENV

var slackApi = process.env.SLACK_API;

var oauth = {
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  token: process.env.TOKEN,
  token_secret: process.env.TOKEN_SECRET
};

var blogName = process.env.BLOG;

var randomNumberOptions = {
  min:  1,
  max:  process.env.PROBABILTY,
  integer: true
}

// SETUP NUMBER GENERATOR

var getRandom = randomNumber.generator(randomNumberOptions)

// CONNECT TO TUMBLR

var blog = tumblr.createClient(oauth);

blog.userInfo(function(error, data) {
  if (error) {
    console.log(error);
  }
  console.log(data);
  console.log(data.user.blogs);
});

// SETUP SLACK

globieBot = new slack(slackApi, true, false);

// LISTEN FOR SIGNIN

globieBot.on('error', function(hello) {

  console.log(hello);

});

globieBot.on('open', function() {

  console.log('Connected to Slack');

});

// LISTEN FOR MESSAGES

globieBot.on('message', function(message) {
  channel = globieBot.getChannelGroupOrDMByID(message.channel)
  if (channel.name === 'b') {
    var random = getRandom();

    console.log(random);

    if (random === 1) {

      blog.text(blogName, {
        body: message.text
      }, function(error, result) {
          if (error) {
            console.log(error);
          }
          console.log(result);
      });

    }
//     console.log(message.text);
  }

});

// CONNECT TO SLACK

globieBot.login();