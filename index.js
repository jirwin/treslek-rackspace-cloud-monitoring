var redis = require('redis');
var log = require('logmagic').local('treslek.raxcm');
var sprintf = require('sprintf').sprintf;
var colors = require('irc-colors');

var config = require('./config.json');


var redisClient;

var STATE_COLORS = {
  OK: colors.green.bold,
  CRITICAL: colors.red,
  WARNING: colors.yellow
};

/**
 * Return a state string with irc colors.
 * @return {String} IRC-colored string.
 */
function getColoredState(state) {
  if (STATE_COLORS[state]) {
    state = STATE_COLORS[state](state);
  }

  return state;
}


/**
 * Rackspace Cloud Monitoring plugin
 */
var CloudMonitoring = function() {
  this.auto = ['listen'];
};

CloudMonitoring.prototype.listen = function(bot) {
  redisClient = redis.createClient(bot.redisConf.port, bot.redisConf.host);

  var pattern = [bot.getWebhookChannel(), 'raxcm/*'].join(':');

  redisClient.on("pmessage", function(pattern, channel, message) {
    var channelPath = channel.slice(bot.getWebhookChannel().length + 1).split('/')[1],
        ircChannels = config.paths[channelPath],
        body = {},
        headers = {},
        output = '';

    ircChannels = ircChannels instanceof Array ? ircChannels : [ircChannels];

    try {
      message = JSON.parse(message);
      headers = message.headers;
      body = JSON.parse(message.body);
    } catch(e) {
      log.error('Invalid JSON payload.', {payload: message});
      return;
    }

    if (headers['x-rackspace-webhook-token'] !== config.token) {
      log.error('Token mismatch. Ignoring message.', {token: token});
      return;
    }

    output = sprintf('%s %s %s - %s',
                     body.entity.label || body.entity.id,
                     getColoredState(body.details.state),
                     body.check.label || body.check.id,
                     body.details.status);

    ircChannels.forEach(function(ircChannel) {
      bot.say(ircChannel, output);
    });
  });
  redisClient.psubscribe(pattern);
};

exports.Plugin = CloudMonitoring;
