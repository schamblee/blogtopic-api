'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const blogSchema = mongoose.Schema({
  topicId: {
    type: String,
    required: true
  },
  authorId: { 
    type: String, 
    required: true
  },
  title: { 
    type: String, 
    required: true
  },
  content: { 
    type: String, 
    required: true
  },
  popularity: { 
    type: Number, 
    default: "0"
  },
  created: {
    type: Date, 
    default: Date.now
  }
});

blogSchema.methods.serialize = function() {
  return {
    id: this._id,
    topicId: this.topicId,
    authorId: this.authorId,
    title: this.title,
    content: this.content,
    popularity: this.popularity,
    created: this.created
  };
};

const Blog = mongoose.model('Blog', blogSchema);
module.exports = { Blog }