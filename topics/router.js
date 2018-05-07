'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const { Topic } = require('./models');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();


router.use(bodyParser.json());


router.get('/', (req, res) => {
  let filter = req.query.filterName || ''
  Topic
    .find({topicName: new RegExp(filter, 'i')})
    .then(topic => {
      res.json( topic.map(
          (topic) => topic.serialize())
      );
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['authorId', 'topicName'];
  for (let i = 0; i < requiredFields.length; i++) {

    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
    Topic
    .create({
      authorId: req.body.authorId,
      topicName: req.body.topicName
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
  const updateableFields = ['topicName'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Topic
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(topic => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
  Topic
    .findByIdAndRemove(req.params.id)
    .then(topic => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = {router};