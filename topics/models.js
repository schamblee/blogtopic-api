'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const topicSchema = mongoose.Schema({
  authorId: { 
    type: String, 
    required: true
  },
  topicName: { 
    type: String, 
    required: true
  },
  created: {
    type: Date, 
    default: Date.now
  }
});

topicSchema.methods.serialize = function() {
  return {
    id: this._id,
    authorId: this.authorId,
    topicName: this.topicName,
    created: this.created
  };
};

const Topic = mongoose.model('Topic', topicSchema);
module.exports = { Topic }