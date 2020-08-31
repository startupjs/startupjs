var assert = require("assert");
var model = require("./model");

describe("sync creation", function () {
  it("should create user", function (done) {
    var user = {
      firstName: "Ivan",
      lastName: "Ivanov",
      age: 18,
    };
    model.add("users", user, done);
  });

  it("should not create user", function (done) {
    var user = {
      firstName: true,
      lastName: "Ivanov",
      age: 18,
    };
    model.add("users", user, function (err) {
      assert(err);

      done();
    });
  });
});

describe("sync editing", function () {
  var $user;
  beforeEach(function (done) {
    var user = {
      firstName: "Ivan",
      lastName: "Ivanov",
      age: 18,
    };
    var userId = model.add("users", user, function (err) {
      if (err) return done(err);
      $user = model.at("users." + userId);
      model.fetch($user, done);
    });
  });

  it("should string insert", function (done) {
    $user.stringInsert("firstName", 2, "Petr", done);
  });

  it("should not string insert", function (done) {
    $user.stringInsert("firstName", 2, "Petr Long Name", function (err) {
      assert(err);

      done();
    });
  });

  it("should string remove", function (done) {
    $user.stringRemove("firstName", 2, 2, done);
  });

  it("should not string remove", function (done) {
    $user.stringRemove("firstName", 0, 4, function (err) {
      assert(err);

      done();
    });
  });

  it("should set", function (done) {
    $user.set("firstName", "Petr", done);
  });

  it("should not set because of notVasya", function (done) {
    $user.set("firstName", "Vasya", function (err) {
      assert(err);

      done();
    });
  });

  it("should not set becouse of notKey", function (done) {
    $user.set("firstName", "firstName", function (err) {
      assert(err);

      done();
    });
  });

  it("should del", function (done) {
    $user.del("age", done);
  });

  it("should not push not unique item", function (done) {
    $user.push("hobbies", "jazz", function (err) {
      assert(!err);

      $user.push("hobbies", "jazz", function (err) {
        assert(err);

        done();
      });
    });
  });

  it("should not set array with not unique items", function (done) {
    $user.set("hobbies", ["jazz", "jazz"], function (err) {
      assert(err);

      done();
    });
  });

  it("should not push array with wrong type items", function (done) {
    $user.push("hobbies", 4, function (err) {
      assert(err);

      done();
    });
  });

  it("should not push array with wrong validator items", function (done) {
    $user.push("hobbies", "Vasya", function (err) {
      assert(err);

      done();
    });
  });

  it("should not set array with wrong validator items", function (done) {
    $user.set("hobbies", ["Vasya"], function (err) {
      assert(err);

      done();
    });
  });

  it("should increment", function (done) {
    $user.increment("age", -2, done);
  });

  it("should not increment because of minimum", function (done) {
    $user.increment("age", -20, function (err) {
      assert(err);

      done();
    });
  });

  it("should delete", function (done) {
    $user.del(done);
  });
});
