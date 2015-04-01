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

// LISTEN FOR SIGNIN & ERROR

globieBot.on('error', function(error) {
  console.log('Slack error:');
  console.log(error);
});

globieBot.on('open', function() {
  console.log('Connected to Slack');
});

// LISTEN FOR MESSAGES

globieBot.on('message', function(message) {
  channel = globieBot.getChannelGroupOrDMByID(message.channel)
  if (channel.name === 'b') {

//     console.log(message.text);

    var random = getRandom();
    if (random === 1) {

      // HERE WE NEED TO DECIDE WHAT KIND OF POST TO CREATE

      // IF THE MESSAGE HAS A <***> URL ENDING WITH .PNG or .GIF or .JPG/JPEG WE SHOULD CREATE AN IMAGE POST

      var images = /((?:https?\:\/\/)(?:[a-zA-Z]{1}(?:[\w\-]+\.)+(?:[\w]{2,5}))(?:\:[\d]{1,5})?\/(?:[^\s\/]+\/)*(?:[^\s]+\.(?:jpe?g|gif|png))(?:\?\w+=\w+(?:&\w+=\w+)*)?)/.exec(message.text);
      var urls = /(\<.*\>)/.exec(message.text);

      if (images) {

        blog.photo(blogName, {
          source: images[0],
          caption: message.text
        }, function(error, result) {
            if (error) {
              console.log(error);
            }
            console.log('POSTED TO TUMBLR AS IMAGE. ID:');
            console.log(result);
        });

    	} else if (urls) {

      // IF THE MESSAGE HAS A <***> ULR WITHOUT THAT ENDING WE SHOULD CREATE A LINK POST

        cleanUrl = urls[0].substring(1, (urls[0].length-1))

        blog.link(blogName, {
          url: cleanUrl,
          caption: message.text
        }, function(error, result) {
            if (error) {
              console.log(error);
            }
            console.log('POSTED TO TUMBLR AS LINK. ID:');
            console.log(result);
        });

    	} else {

      // OTHERWISE WE SHOULD CREATE TEXT POST

      	if (message.text) {

          blog.text(blogName, {
            body: message.text
          }, function(error, result) {
              if (error) {
                console.log(error);
              }
              console.log('POSTED TO TUMBLR AS TEXT. ID:');
              console.log(result);
          });

        }

    	}


    }

  }

});

// CONNECT TO SLACK

globieBot.login();