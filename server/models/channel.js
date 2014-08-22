'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Channel Schema
 */
var ChannelSchema = new Schema({
		channel_id : {
			type: String,
			unique: true
		}
	}
);

mongoose.model('Channel', ChannelSchema);