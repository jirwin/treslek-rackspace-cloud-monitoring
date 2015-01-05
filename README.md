treslek-rackspace-cloud-monitoring
===========

A treslek plugin to handle and announce Rackspace Cloud Monitoring
webhooks

# How it works
Configure a Rackspace Cloud Monitoring webhook @
https://intelligence.rackspace.com and point it at treslek webhook
server with the beginning path of 'raxcm'. An example webhook address
would be: `http://example.com:1304/raxcm/cloudmonitoring`.

# Configure
This plugin is configured via a JSON file named config.json in the root
directory of the plugin. 

An example config:
```json
{
  "paths": {
    "cloudmonitoring": ["##treslek", "#treslek"]
  },
  "token": "foobar123",
  "templateString": "{{entity.label || entity.id}} - {{details.state}}",
  "disableStateColors": false
}
```

The `paths` key contains a set of paths that come after `raxcm` in the
URL and designates the channels that should recieve the resulting
webhook information.

The `token` key is where you specify the secret token provided by
Rackspace Cloud Monitoring for verifying authenticity.

Use the `templateString` config to control the message that treslek outputs to the channel.

Set `disableStateColors` to `true` if you don't want alarm states to be colored.

# license
MIT
