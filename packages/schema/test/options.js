module.exports = {
  schemas: {
    categories: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
      },
    },
    products: {
      type: "object",
      properties: {
        name: {
          type: "string",
        },
        categoryId: {
          type: "string",
          collection: "categories",
          validators: ["join"],
        },
        categoryHash: {
          type: "object",
          patternProperties: {
            "^.{8,40}$": {
              type: "string",
              collection: "categories",
              validators: ["hash"],
            },
          },
          additionalProperties: false,
        },
        categories: {
          type: "array",
          items: {
            type: "string",
            collection: "categories",
            validators: ["join"],
          },
        },
        values: {
          type: "object",
          patternProperties: {
            "^.{1,10}$": {
              type: "array",
              items: {
                type: "integer",
              },
            },
          },
        },
      },
      additionalProperties: false,
    },
    users: {
      title: "Example Schema",
      type: "object",
      properties: {
        firstName: {
          type: "string",
          minLength: 1,
          maxLength: 10,
          validators: ["notVasya", "notKey"],
        },
        lastName: {
          type: "string",
          format: "xstring",
        },
        age: {
          description: "Age in years",
          type: "integer",
          minimum: 0,
        },
        hobbies: {
          type: "array",
          maxItems: 3,
          items: {
            type: "string",
            validators: ["notVasya"],
          },
          uniqueItems: true,
        },
      },
      required: ["firstName", "lastName"],
    },
  },
  formats: {
    xstring: function (str) {
      return true;
    },
  },
  validators: {
    notVasya: {
      sync: function (value, context) {
        var name = "Vasya";
        if (value === name) {
          return Error("Can not be " + name);
        }
      },
    },
    notKey: {
      sync: function (value, context) {
        var key = context.paths[context.paths.length - 1];
        if (value === key) {
          return Error("Can not be same as key: " + key);
        }
      },
    },
    join: {
      async: function (context, done) {
        var id = context.value;

        if (!id) return done();

        var collection = context.schema.collection;

        var model = this.backend.createModel();

        var $entity = model.at(collection + "." + id);

        model.fetch($entity, function (err) {
          if (err) return done(err);

          if (!$entity.get()) {
            return done(Error("No " + collection + " with id " + id));
          }
          done();
        });
      },
    },
    hash: {
      async: function (context, done) {
        var id = context.paths[context.paths.length - 1];
        var collection = context.schema.collection;

        var model = this.backend.createModel();

        var $entity = model.at(collection + "." + id);

        model.fetch($entity, function (err) {
          if (err) return done(err);
          if (!$entity.get()) return done(Error("No " + collection + " with id " + id));

          done();
        });
      },
    },
  },
};
