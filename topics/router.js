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

router.get('/topic/:id', (req, res) => {
  let filter = req.query.filterName || ''
  Topic
  .findById(req.params.id)
    .then(topic => {
      res.json( topic.serialize())
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['topicName'];
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
      topicName: req.body.topicName
    })
    .then(topic => res.status(201).json(topic.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

module.exports = {router};