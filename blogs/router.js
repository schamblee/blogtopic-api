'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Blog } = require('./models');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();


router.use(bodyParser.json());

router.get('/', (req, res) => {
    console.log("fetching feedback templates");
    Blog
      .find()
      .then(blog => {
        console.log(blog);
        res.json({
          blogs: blog.map(
            (blog) => blog.serialize())
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });


router.get('/:topicId', (req, res) => {
  Blog
    .find({topicId: req.params.topicId})
    .then(blog => {
      console.log(blog);
      res.json({
        blogs: blog.map(
          (blog) => blog.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['topicId', 'authorId', 'title', 'content'];
  for (let i = 0; i < requiredFields.length; i++) {
    console.log(req)
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
    Blog
    .create({
      topicId: req.body.topicId,
      authorId: req.body.authorId,
      title: req.body.title,
      content: req.body.content
    })
    .then(topic => res.status(201).json(topic.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['title', 'content'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Blog
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(topic => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
  Blog
    .findByIdAndRemove(req.params.id)
    .then(topic => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = {router};