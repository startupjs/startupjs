var assert = require("assert");
var model = require("./model");

describe("async", function () {
  var $category;
  var $product;
  beforeEach(function (done) {
    var category = {
      name: "Planes",
    };
    var product = {
      name: "T-50",
    };
    var categoryId = model.add("categories", category, function (err) {
      if (err) return done(err);

      $category = model.at("categories." + categoryId);

      product.categories = [categoryId];

      var productId = model.add("products", product, function (err) {
        if (err) return done(err);

        $product = model.at("products." + productId);

        model.fetch($category, $product, done);
      });
    });
  });

  it("should create product", function (done) {
    var product = {
      name: "A-10",
    };
    model.add("products", product, done);
  });

  it("should create product with real categoryId", function (done) {
    var product = {
      name: "A-10",
      categoryId: $category.get("id"),
    };
    model.add("products", product, done);
  });

  it("should not create product with wrong categoryId", function (done) {
    var product = {
      name: "A-10",
      categoryId: model.id(),
    };

    model.add("products", product, function (err) {
      assert(err);

      done();
    });
  });

  it("should create product with right hash", function (done) {
    var product = {
      name: "A-10",
      categoryHash: {},
    };
    product.categoryHash[$category.get("id")] = "Some value";
    model.add("products", product, done);
  });

  it("should not create product with wrong hash", function (done) {
    var product = {
      name: "A-10",
      categoryHash: {},
    };
    product.categoryHash[model.id()] = "Some value";
    model.add("products", product, function (err) {
      assert(err);

      done();
    });
  });

  it("should create product with right array", function (done) {
    var product = {
      name: "A-10",
      categories: [$category.get("id")],
    };
    model.add("products", product, done);
  });

  it("should not create product with wrong array", function (done) {
    var product = {
      name: "A-10",
      categories: [model.id()],
    };
    model.add("products", product, function (err) {
      assert(err);

      done();
    });
  });

  it("should set categoryId", function (done) {
    $product.set("categoryId", $category.get("id"), done);
  });

  it("should not set categoryId", function (done) {
    $product.set("categoryId", model.id(), function (err) {
      assert(err);

      done();
    });
  });

  it("should set array", function (done) {
    $product.set("categories", [$category.get("id")], done);
  });

  it("should not set array", function (done) {
    $product.set("categories", [model.id()], function (err) {
      assert(err);

      done();
    });
  });

  it("should push categoryId", function (done) {
    $product.push("categories", $category.get("id"), done);
  });

  it("should not push categoryId", function (done) {
    $product.push("categories", model.id(), function (err) {
      assert(err);

      done();
    });
  });

  xit("should not insert categoryId", function (done) {
    $product.insert("categories", 0, model.id(), function (err) {
      assert(err);

      done();
    });
  });

  it("should remove categoryId", function (done) {
    $product.pop("categories", done);
  });

  it("should remove categoryId", function (done) {
    $product.shift("categories", done);
  });

  it("should move categoryId", function (done) {
    $product.move("categories", 0, 1, done);
  });

  it("should remove categoryId", function (done) {
    $product.remove("categories", 0, model.id(), done);
  });
});
