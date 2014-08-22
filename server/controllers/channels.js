'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Channel = mongoose.model('Channel');

/**
 * Create channel
 */
exports.create = function(channel_id) {
	console.log('try to save a new channel : ' + channel_id);
    Channel.create({ channel_id: channel_id }, function (err, channel) {
		if (err)
			console.log('Error on channel creation');
		console.log('channel created : ' + channel_id);
	});
};


/**
 * Delete channel
 */
exports.delete = function(channel_id) {
	console.log('try to delete a channel : ' + channel_id);
	Channel.remove({ channel_id: channel_id }, function (err) {
		if (err)
			console.log('Error when deleting the channel');
		console.log('channel has been deleted');
	});
	Channel.find().exec(function (err, channel) {
		if (err)
			console.log('Error');
		console.log(channel.channel_id);
    });
};

exports.removeAll = function(){
	Channel.remove(function(err){
		if (err)
			console.log('error to delete all the collection');
		else
			console.log('collection deleted');
	});
};

exports.findChannel = function(channel_id){
	console.log('try to find a channel : ' + channel_id);
	Channel.find({channel_id: channel_id}).exec(function (err, channel) {
		console.log('channel founded : ' + channel);
		if (err)
			return null;
		return channel;
    });
};

exports.showAllChannels = function(){
	Channel.find().exec(function (err, channel) {
		console.log(channel);
		if (err)
			return null;
		return channel;
    });
};
 