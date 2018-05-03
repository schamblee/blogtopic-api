'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const should = chai.should();
const expect = chai.expect

const { Topic } = require('../Topics');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// Deletes the entire database.
function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedTopicData() {
  console.info('seeding Topic data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      authorId: faker.name.firstName(),
      topicId: faker.lorem.words(),
      title: faker.name.firstName(),
      content: faker.name.firstName()
    });

  return Topic.insertMany(seedData);
  }
}


describe('Topic API resource', function () {

  before(function () {
    return runServer(TEST_DATABASE_URL, 5678);
  });

  beforeEach(function () {
    return seedTopicData();
  });

  afterEach(function () {
    // tear down database so we ensure no state from this test
    return tearDownDb()
  });

  after(function () {
    return closeServer();
  });

  describe('GET endpoint', function () {

    it('should return all existing Topics', function () {
      // strategy:
      //    1. get back all Topics returned by by GET request to `/api/Topics`
      //    2. prove res has right status, data type
      //    3. prove the number of Topics we got back is equal to number
      //       in db.
      let res;
      return chai.request(app)
        .get('/api/Topics')
        .then(_res => {
          res = _res;
          res.should.have.status(200);
          // otherwise our db seeding didn't work
          res.body.Topic.should.have.length.of.at.least(1);

          return Topic.count();
        })
        .then(count => {
          // the number of returned Topics should be same
          // as number of Topics in DB
          expect(res.body.Topic).to.have.lengthOf(count);
        })
    });
  });

describe('PUT endpoint', function () {

    // strategy:
    //  1. Get an existing lesson from db
    //  2. Make a PUT request to update that lesson
    //  4. Prove lesson in db is correctly updated
    it('should update fields you send over', function () {
      const updateData = {
        content: 'cats cats cats'
      };

      return Topic
        .findOne()
        .then(Topic => {
          updateData.id = Topic.id;
          return chai.request(app)
            .put(`/api/Topics/${Topic.id}`)
            .send(updateData);
        })
        .then(res => {
          res.should.have.status(204);
          return Topic.findById(updateData.id);
        })
        .then(Topic => {
          Topic.text.should.equal(updateData.text);
        });
    });
  });

  describe('DELETE endpoint', function () {
    // strategy:
    //  1. get a lesson
    //  2. make a DELETE request for that lesson's id
    //  3. assert that response has right status code
    //  4. prove that lesson with the id doesn't exist in db anymore
    it('should delete a Topic by id', function () {

      let Topic;

      return Topic
        .findOne()
        .then(_Topic => {
          Topic = _Topic;
          return chai.request(app).delete(`/api/Topics/${Topic.id}`);
        })
        .then(res => {
          res.should.have.status(204);
          return Topic.findById(Topic.id);
        })
        .then(_Topic => {
          // when a variable's value is null, chaining `should`
          // doesn't work. so `_Topic.should.be.null` would raise
          // an error. `should.be.null(_)` is how we can
          // make assertions about a null value.
          should.not.exist(_Topic);
        });
    });
  });
});