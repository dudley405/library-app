"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('library-app/adapters/application', ['exports', 'emberfire/adapters/firebase'], function (exports, _emberfireAdaptersFirebase) {
  exports['default'] = _emberfireAdaptersFirebase['default'].extend({});
});
define('library-app/app', ['exports', 'ember', 'library-app/resolver', 'ember-load-initializers', 'library-app/config/environment'], function (exports, _ember, _libraryAppResolver, _emberLoadInitializers, _libraryAppConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _libraryAppConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _libraryAppConfigEnvironment['default'].podModulePrefix,
    Resolver: _libraryAppResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _libraryAppConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('library-app/components/abc-buttons', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    atoz: _ember['default'].computed(function () {
      // Source: http://stackoverflow.com/questions/12376870/create-an-array-of-characters-from-specified-range
      return Array.apply(null, { length: 26 }).map(function (x, i) {
        return String.fromCharCode(97 + i).toUpperCase();
      });
    })

  });
});
define('library-app/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'library-app/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _libraryAppConfigEnvironment) {

  var name = _libraryAppConfigEnvironment['default'].APP.name;
  var version = _libraryAppConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('library-app/components/author-select', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    tagName: 'select',
    classNames: ['form-control'],
    authors: [],
    book: null,

    change: function change(event) {
      var selectedAuthorId = event.target.value;
      var selectedAuthor = this.get('authors').find(function (record) {
        return record.id === selectedAuthorId;
      });

      this.sendAction('action', selectedAuthor, this.get('book'));
    }
  });
});
define('library-app/components/fader-label', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'span',

    classNames: ['label label-success label-fade'],
    classNameBindings: ['isShowing:label-show'],

    isShowing: false,

    isShowingChanged: _ember['default'].observer('isShowing', function () {
      var _this = this;

      _ember['default'].run.later(function () {
        _this.set('isShowing', false);
      }, 3000);
    })
  });
});
define('library-app/components/library-item-form', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    buttonLabel: 'Save',

    actions: {

      buttonClicked: function buttonClicked(param) {
        this.sendAction('action', param);
      }

    }
  });
});
define('library-app/components/library-item', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('library-app/components/library-select', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    tagName: 'select',
    classNames: ['form-control'],
    libraries: [],
    book: null,

    change: function change(event) {
      var selectedLibraryId = event.target.value;
      var selectedLibrary = this.get('libraries').find(function (record) {
        return record.id === selectedLibraryId;
      });

      this.sendAction('action', selectedLibrary, this.get('book'));
    }
  });
});
define('library-app/components/nav-link-to', ['exports', 'ember'], function (exports, _ember) {
    exports['default'] = _ember['default'].LinkComponent.extend({

        tagName: 'li',

        hrefForA: _ember['default'].computed('models', 'qualifiedRouteName', function computeLinkToComponentHref() {
            var qualifiedRouteName = this.get('qualifiedRouteName');
            var models = this.get('models');

            if (this.get('loading')) {
                return this.get('loadingHref');
            }

            var routing = this.get('_routing');
            var queryParams = this.get('queryParams.values');
            return routing.generateURL(qualifiedRouteName, models, queryParams);
        })
    });
});
define('library-app/components/number-box', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    classNames: ['panel', 'panel-warning']

  });
});
define('library-app/components/seeder-block', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({

    actions: {

      generateAction: function generateAction() {
        this.sendAction('generateAction');
      },

      deleteAction: function deleteAction() {
        this.sendAction('deleteAction');
      }

    }
  });
});
define('library-app/components/spinner-cube', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define('library-app/controllers/admin/seeder', ['exports', 'ember', 'faker'], function (exports, _ember, _faker) {
  exports['default'] = _ember['default'].Controller.extend({

    libraries: [],
    books: [],
    authors: [],

    actions: {

      generateLibraries: function generateLibraries() {
        var counter = parseInt(this.get('librariesCounter'));

        for (var i = 0; i < counter; i++) {
          var isTheLast = i === counter - 1;
          this._saveRandomLibrary(isTheLast);
        }
      },

      deleteLibraries: function deleteLibraries() {
        this._destroyAll(this.get('libraries'));

        this.set('libDelDone', true);
      },

      generateBooksAndAuthors: function generateBooksAndAuthors() {
        var counter = parseInt(this.get('authorCounter'));

        for (var i = 0; i < counter; i++) {
          var isTheLast = i === counter - 1;
          var newAuthor = this._saveRandomAuthor(isTheLast);

          this._generateSomeBooks(newAuthor);
        }
      },

      deleteBooksAndAuthors: function deleteBooksAndAuthors() {
        this._destroyAll(this.get('books'));
        this._destroyAll(this.get('authors'));

        this.set('authDelDone', true);
      }
    },

    // Private methods

    _saveRandomLibrary: function _saveRandomLibrary(isLast) {
      var _this = this;

      var randomLibrary = this.store.createRecord('library').randomize();

      randomLibrary.save().then(function () {
        if (isLast) {
          _this.set('librariesCounter', 0);
          _this.set('libDone', true);
        }
      });
    },

    _saveRandomAuthor: function _saveRandomAuthor(isLast) {
      var _this2 = this;

      var newAuthor = this.store.createRecord('author').randomize();
      newAuthor.save().then(function () {
        if (isLast) {
          _this2.set('authorCounter', 0);
          _this2.set('authDone', true);
        }
      });
      return newAuthor;
    },

    _generateSomeBooks: function _generateSomeBooks(author) {
      var bookCounter = _faker['default'].random.number(10);

      for (var j = 0; j < bookCounter; j++) {
        var library = this._selectRandomLibrary();
        this.store.createRecord('book').randomize(author, library).save();
        author.save();
        library.save();
      }
    },

    _selectRandomLibrary: function _selectRandomLibrary() {
      var libraries = this.get('libraries');
      var librariesCounter = libraries.get('length');

      // Create a new array form ids
      var libraryIds = libraries.map(function (lib) {
        return lib.get('id');
      });
      var randomNumber = _faker['default'].random.number(librariesCounter - 1);

      var randomLibrary = libraries.findBy('id', libraryIds[randomNumber]);
      return randomLibrary;
    },

    _destroyAll: function _destroyAll(records) {
      records.forEach(function (item) {
        item.destroyRecord();
      });
    }

  });
});
define('library-app/controllers/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    headerMessage: 'Coming Soon',
    responseMessage: '',
    emailAddress: '',

    isValid: _ember['default'].computed.match('emailAddress', /^.+@.+\..+$/),
    isDisabled: _ember['default'].computed.not('isValid'),

    actions: {

      saveInvitation: function saveInvitation() {
        var _this = this;

        var email = this.get('emailAddress');

        var newInvitation = this.store.createRecord('invitation', {
          email: email
        });

        newInvitation.save().then(function (response) {
          _this.set('responseMessage', 'Thank you! We saved your email address with the following id: ' + response.get('id'));
          _this.set('emailAddress', '');
        });
      }
    }

  });
});
define('library-app/controllers/libraries/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({

    queryParams: ['filter', 'limit', 'letter'],
    filter: '',
    letter: '',
    limit: 'all',

    limitAll: _ember['default'].computed.equal('limit', 'all'),

    filteredList: _ember['default'].computed('model.@each.name', 'filter', function () {

      var results = this.get('model');
      var query = this.get('filter');

      if (!!query) {
        (function () {
          // One of the best regular expression website: http://www.regexr.com/
          // Split the query at spaces and join them to get like this: /(word1)+.*(word2)+.*(word3)+.*/ig
          var regexString = '(' + query.split(' ').join(')+.*(') + ')+.*';
          // i: case insensitive, g: global
          var regex = new RegExp(regexString, 'ig');

          results = results.filter(function (item) {
            return item.get('name').match(regex);
          });
        })();
      }

      return results.sortBy('name');
    })

  });
});
define('library-app/helpers/is-equal', ['exports', 'ember'], function (exports, _ember) {
  exports.isEqual = isEqual;

  function isEqual(params /*, hash*/) {
    return params[0] === params[1];
  }

  exports['default'] = _ember['default'].Helper.helper(isEqual);
});
define('library-app/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('library-app/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('library-app/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'library-app/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _libraryAppConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_libraryAppConfigEnvironment['default'].APP.name, _libraryAppConfigEnvironment['default'].APP.version)
  };
});
define('library-app/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('library-app/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('library-app/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('library-app/initializers/ember-faker', ['exports'], function (exports) {
  exports.initialize = initialize;

  function initialize() /* container, application */{
    // application.inject('route', 'foo', 'service:foo');
  }

  ;

  exports['default'] = {
    name: 'ember-faker',
    initialize: initialize
  };
});
define('library-app/initializers/emberfire', ['exports', 'emberfire/initializers/emberfire'], function (exports, _emberfireInitializersEmberfire) {
  exports['default'] = _emberfireInitializersEmberfire['default'];
});
define('library-app/initializers/export-application-global', ['exports', 'ember', 'library-app/config/environment'], function (exports, _ember, _libraryAppConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_libraryAppConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _libraryAppConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_libraryAppConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('library-app/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('library-app/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('library-app/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("library-app/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('library-app/models/author', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'faker', 'ember'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships, _faker, _ember) {
  exports['default'] = _emberDataModel['default'].extend({

    name: (0, _emberDataAttr['default'])('string'),
    books: (0, _emberDataRelationships.hasMany)('book', { inverse: 'author', async: true }),

    isNotValid: _ember['default'].computed.empty('name'),

    randomize: function randomize() {
      this.set('name', _faker['default'].name.findName());
      return this;
    }

  });
});
define('library-app/models/book', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'faker'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships, _faker) {
  exports['default'] = _emberDataModel['default'].extend({

    title: (0, _emberDataAttr['default'])('string'),
    releaseYear: (0, _emberDataAttr['default'])('date'),

    author: (0, _emberDataRelationships.belongsTo)('author', { inverse: 'books', async: true }),
    library: (0, _emberDataRelationships.belongsTo)('library', { inverse: 'books', async: true }),

    randomize: function randomize(author, library) {
      this.set('title', this._bookTitle());
      this.set('author', author);
      this.set('releaseYear', this._randomYear());
      this.set('library', library);

      return this;
    },

    _bookTitle: function _bookTitle() {
      return _faker['default'].commerce.productName() + ' Cookbook';
    },

    _randomYear: function _randomYear() {
      return new Date(this._getRandomArbitrary(1900, 2015).toPrecision(4));
    },

    _getRandomArbitrary: function _getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
  });
});
define('library-app/models/contact', ['exports', 'ember-data/model', 'ember-data/attr', 'ember'], function (exports, _emberDataModel, _emberDataAttr, _ember) {
  exports['default'] = _emberDataModel['default'].extend({
    email: (0, _emberDataAttr['default'])('string'),
    message: (0, _emberDataAttr['default'])('string'),

    isValidEmail: _ember['default'].computed.match('email', /^.+@.+\..+$/),
    isMessageEnoughLong: _ember['default'].computed.gte('message.length', 5),

    isValid: _ember['default'].computed.and('isValidEmail', 'isMessageEnoughLong'),
    isNotValid: _ember['default'].computed.not('isValid')
  });
});
define('library-app/models/invitation', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _emberDataModel, _emberDataAttr) {
  exports['default'] = _emberDataModel['default'].extend({
    email: (0, _emberDataAttr['default'])('string')
  });
});
define('library-app/models/library', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember', 'faker'], function (exports, _emberDataModel, _emberDataAttr, _emberDataRelationships, _ember, _faker) {
  exports['default'] = _emberDataModel['default'].extend({
    name: (0, _emberDataAttr['default'])('string'),
    address: (0, _emberDataAttr['default'])('string'),
    phone: (0, _emberDataAttr['default'])('string'),

    books: (0, _emberDataRelationships.hasMany)('book', { inverse: 'library', async: true }),

    isValid: _ember['default'].computed.notEmpty('name'),

    randomize: function randomize() {
      this.set('name', _faker['default'].company.companyName() + ' Library');
      this.set('address', this._fullAddress());
      this.set('phone', _faker['default'].phone.phoneNumber());

      // If you would like to use in chain.
      return this;
    },

    _fullAddress: function _fullAddress() {
      return _faker['default'].address.streetAddress() + ', ' + _faker['default'].address.city();
    }
  });
});
define('library-app/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('library-app/router', ['exports', 'ember', 'library-app/config/environment'], function (exports, _ember, _libraryAppConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _libraryAppConfigEnvironment['default'].locationType,
    rootURL: _libraryAppConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('about');
    this.route('contact');

    this.route('admin', function () {
      this.route('invitations');
      this.route('contacts');
      this.route('seeder');
    });

    this.route('libraries', function () {
      this.route('new');
      this.route('edit', { path: '/:library_id/edit' });
    });

    this.route('authors');
    this.route('books');
  });

  exports['default'] = Router;
});
define('library-app/routes/about', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('library-app/routes/admin/contacts', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.findAll('contact');
    }
  });
});
define('library-app/routes/admin/invitations', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.findAll('invitation');
    }

  });
});
define('library-app/routes/admin/seeder', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    // You can use these lines to experiment with route hooks.
    // Uncomment these and comment out the real implementation below.
    // Open inspection console in your browser and check how Ember call
    // each hook automatically.
    //
    //init() {
    //  debugger;
    //},
    //
    //beforeModel() {
    //  debugger;
    //},
    //
    //model() {
    //  debugger;
    //},
    //
    //afterModel() {
    //  debugger;
    //},
    //
    //setupController() {
    //  debugger;
    //},
    //
    //renderTemplate() {
    //  debugger;
    //},
    //
    //activate() {
    //  debugger;
    //}

    model: function model() {
      return _ember['default'].RSVP.hash({
        libraries: this.store.findAll('library'),
        books: this.store.findAll('book'),
        authors: this.store.findAll('author')
      });
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);
      controller.set('libraries', model.libraries);
      controller.set('books', model.books);
      controller.set('authors', model.authors);
    }
  });
});
define('library-app/routes/authors', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.findAll('author');
    },

    actions: {

      editAuthor: function editAuthor(author) {
        author.set('isEditing', true);
      },

      cancelAuthorEdit: function cancelAuthorEdit(author) {
        author.set('isEditing', false);
        author.rollbackAttributes();
      },

      saveAuthor: function saveAuthor(author) {
        if (author.get('isNotValid')) {
          return;
        }

        author.set('isEditing', false);
        author.save();
      }
    }
  });
});
define('library-app/routes/books', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return _ember['default'].RSVP.hash({
        books: this.store.findAll('book'),
        authors: this.store.findAll('author'),
        libraries: this.store.findAll('library')
      });
    },

    setupController: function setupController(controller, model) {
      var books = model.books;
      var authors = model.authors;
      var libraries = model.libraries;

      this._super(controller, books);

      controller.set('authors', authors);
      controller.set('libraries', libraries);
    },

    actions: {

      editBook: function editBook(book) {
        book.set('isEditing', true);
      },

      cancelBookEdit: function cancelBookEdit(book) {
        book.set('isEditing', false);
        book.rollbackAttributes();
      },

      saveBook: function saveBook(book) {
        if (book.get('isNotValid')) {
          return;
        }

        book.set('isEditing', false);
        book.save();
      },

      editAuthor: function editAuthor(book) {
        book.set('isAuthorEditing', true);
      },

      cancelAuthorEdit: function cancelAuthorEdit(book) {
        book.set('isAuthorEditing', false);
        book.rollbackAttributes();
      },

      saveAuthor: function saveAuthor(author, book) {
        // Firebase adapter is buggy, we have to manually remove the previous relation
        book.get('author').then(function (previousAuthor) {
          previousAuthor.get('books').then(function (previousAuthorBooks) {
            previousAuthorBooks.removeObject(book);
            previousAuthor.save();
          });
        });

        // Setup the new relation
        book.set('author', author);
        book.save().then(function () {
          return author.save();
        });
        book.set('isAuthorEditing', false);
      },

      editLibrary: function editLibrary(book) {
        book.set('isLibraryEditing', true);
      },

      cancelLibraryEdit: function cancelLibraryEdit(book) {
        book.set('isLibraryEditing', false);
        book.rollbackAttributes();
      },

      saveLibrary: function saveLibrary(library, book) {
        // Firebase adapter is buggy, we have to manually remove the previous relation.
        // You don't need this callback mess when your adapter properly manages relations.
        // If Firebase fix this bug, we can remove this part.
        book.get('library').then(function (previousLibrary) {
          previousLibrary.get('books').then(function (previousLibraryBooks) {
            previousLibraryBooks.removeObject(book);
            previousLibrary.save();
          });
        });

        book.set('library', library);
        book.save().then(function () {
          return library.save();
        });
        book.set('isLibraryEditing', false);
      }
    }
  });
});
define('library-app/routes/contact', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.createRecord('contact');
    },

    actions: {

      sendMessage: function sendMessage(newContactMessage) {
        var _this = this;

        newContactMessage.save().then(function () {
          return _this.controller.set('responseMessage', true);
        });
      },

      willTransition: function willTransition() {
        var model = this.controller.get('model');

        if (model.get('isNew')) {
          model.destroyRecord();
        }

        this.controller.set('responseMessage', false);
      }
    }
  });
});
define('library-app/routes/libraries', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({});
});
define('library-app/routes/libraries/edit', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model(params) {
      return this.store.findRecord('library', params.library_id);
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Edit library');
      controller.set('buttonLabel', 'Save changes');
    },

    renderTemplate: function renderTemplate() {
      this.render('libraries/form');
    },

    actions: {

      saveLibrary: function saveLibrary(newLibrary) {
        var _this = this;

        newLibrary.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },

      willTransition: function willTransition(transition) {
        var model = this.controller.get('model');

        if (model.get('hasDirtyAttributes')) {
          var confirmation = confirm("Your changes haven't saved yet. Would you like to leave this form?");

          if (confirmation) {
            model.rollbackAttributes();
          } else {
            transition.abort();
          }
        }
      }
    }
  });
});
define('library-app/routes/libraries/index', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    queryParams: {
      limit: { refreshModel: true },
      letter: { refreshModel: true }
    },

    model: function model(params) {

      if (params.limit === 'all') {
        return this.store.findAll('library');
      }

      return this.store.query('library', {
        orderBy: 'name',
        startAt: params.letter,
        endAt: params.letter + ''
      });
    },

    actions: {

      deleteLibrary: function deleteLibrary(library) {
        var confirmation = confirm('Are you sure?');

        if (confirmation) {
          library.destroyRecord();
        }
      }
    }

  });
});
define('library-app/routes/libraries/new', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.store.createRecord('library');
    },

    setupController: function setupController(controller, model) {
      this._super(controller, model);

      controller.set('title', 'Create a new library');
      controller.set('buttonLabel', 'Create');
    },

    renderTemplate: function renderTemplate() {
      this.render('libraries/form');
    },

    actions: {

      saveLibrary: function saveLibrary(newLibrary) {
        var _this = this;

        newLibrary.save().then(function () {
          return _this.transitionTo('libraries');
        });
      },

      willTransition: function willTransition() {
        // rollbackAttributes() removes the record from the store
        // if the model 'isNew'
        this.controller.get('model').rollbackAttributes();
      }
    }
  });
});
define('library-app/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('library-app/services/firebase-app', ['exports', 'emberfire/services/firebase-app'], function (exports, _emberfireServicesFirebaseApp) {
  exports['default'] = _emberfireServicesFirebaseApp['default'];
});
define('library-app/services/firebase', ['exports', 'emberfire/services/firebase'], function (exports, _emberfireServicesFirebase) {
  exports['default'] = _emberfireServicesFirebase['default'];
});
define("library-app/templates/about", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 19
          }
        },
        "moduleName": "library-app/templates/about.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("About Page");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/admin/contacts", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 18,
              "column": 4
            }
          },
          "moduleName": "library-app/templates/admin/contacts.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("th");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
          return morphs;
        },
        statements: [["content", "contact.id", ["loc", [null, [14, 16], [14, 30]]], 0, 0, 0, 0], ["content", "contact.email", ["loc", [null, [15, 16], [15, 33]]], 0, 0, 0, 0], ["content", "contact.message", ["loc", [null, [16, 16], [16, 35]]], 0, 0, 0, 0]],
        locals: ["contact"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 21,
            "column": 8
          }
        },
        "moduleName": "library-app/templates/admin/contacts.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Contacts");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table table-bordered table-striped");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("ID");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("E-mail");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Message");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [12, 12], [12, 17]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [12, 4], [18, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/admin/invitations", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 11,
              "column": 4
            },
            "end": {
              "line": 16,
              "column": 4
            }
          },
          "moduleName": "library-app/templates/admin/invitations.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("th");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
          return morphs;
        },
        statements: [["content", "invitation.id", ["loc", [null, [13, 16], [13, 33]]], 0, 0, 0, 0], ["content", "invitation.email", ["loc", [null, [14, 16], [14, 36]]], 0, 0, 0, 0]],
        locals: ["invitation"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 8
          }
        },
        "moduleName": "library-app/templates/admin/invitations.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Invitations");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table table-bordered table-striped");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("ID");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("E-mail");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [11, 12], [11, 17]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [11, 4], [16, 13]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/admin/seeder", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 25,
            "column": 2
          }
        },
        "moduleName": "library-app/templates/admin/seeder.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Seeder, our Data Center");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [5]), 0, 0);
        morphs[3] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        morphs[4] = dom.createMorphAt(fragment, 6, 6, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["inline", "number-box", [], ["title", "Libraries", "number", ["subexpr", "@mut", [["get", "libraries.length", ["loc", [null, [4, 62], [4, 78]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [4, 24], [4, 80]]], 0, 0], ["inline", "number-box", [], ["title", "Authors", "number", ["subexpr", "@mut", [["get", "authors.length", ["loc", [null, [5, 60], [5, 74]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [5, 24], [5, 76]]], 0, 0], ["inline", "number-box", [], ["title", "Books", "number", ["subexpr", "@mut", [["get", "books.length", ["loc", [null, [6, 58], [6, 70]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [6, 24], [6, 72]]], 0, 0], ["inline", "seeder-block", [], ["sectionTitle", "Libraries", "counter", ["subexpr", "@mut", [["get", "librariesCounter", ["loc", [null, [11, 12], [11, 28]]], 0, 0, 0, 0]], [], [], 0, 0], "generateAction", "generateLibraries", "deleteAction", "deleteLibraries", "createReady", ["subexpr", "@mut", [["get", "libDone", ["loc", [null, [14, 16], [14, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "deleteReady", ["subexpr", "@mut", [["get", "libDelDone", ["loc", [null, [15, 16], [15, 26]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [9, 0], [16, 2]]], 0, 0], ["inline", "seeder-block", [], ["sectionTitle", "Authors with Books", "counter", ["subexpr", "@mut", [["get", "authorCounter", ["loc", [null, [20, 10], [20, 23]]], 0, 0, 0, 0]], [], [], 0, 0], "generateAction", "generateBooksAndAuthors", "deleteAction", "deleteBooksAndAuthors", "createReady", ["subexpr", "@mut", [["get", "authDone", ["loc", [null, [23, 14], [23, 22]]], 0, 0, 0, 0]], [], [], 0, 0], "deleteReady", ["subexpr", "@mut", [["get", "authDelDone", ["loc", [null, [24, 14], [24, 25]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [18, 0], [25, 2]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 4,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        return morphs;
      },
      statements: [["inline", "partial", ["navbar"], [], ["loc", [null, [2, 2], [2, 22]]], 0, 0], ["content", "outlet", ["loc", [null, [3, 2], [3, 12]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/authors", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 17,
                "column": 8
              },
              "end": {
                "line": 27,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/authors.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("form");
            dom.setAttribute(el1, "class", "form-inline");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "input-group");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3, "class", "input-group-btn");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("button");
            dom.setAttribute(el4, "type", "submit");
            dom.setAttribute(el4, "class", "btn btn-success");
            var el5 = dom.createTextNode("Save");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("button");
            dom.setAttribute(el4, "class", "btn btn-danger");
            var el5 = dom.createTextNode("Cancel");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [1]);
            var element2 = dom.childAt(element1, [1]);
            var element3 = dom.childAt(element2, [3]);
            var element4 = dom.childAt(element3, [1]);
            var element5 = dom.childAt(element3, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createElementMorph(element1);
            morphs[1] = dom.createMorphAt(element2, 1, 1);
            morphs[2] = dom.createAttrMorph(element4, 'disabled');
            morphs[3] = dom.createElementMorph(element5);
            return morphs;
          },
          statements: [["element", "action", ["saveAuthor", ["get", "author", ["loc", [null, [18, 38], [18, 44]]], 0, 0, 0, 0]], ["on", "submit"], ["loc", [null, [18, 16], [18, 58]]], 0, 0], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "author.name", ["loc", [null, [20, 28], [20, 39]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control"], ["loc", [null, [20, 14], [20, 62]]], 0, 0], ["attribute", "disabled", ["get", "author.isNotValid", ["loc", [null, [22, 73], [22, 90]]], 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["cancelAuthorEdit", ["get", "author", ["loc", [null, [23, 75], [23, 81]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 47], [23, 83]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 27,
                "column": 8
              },
              "end": {
                "line": 29,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/authors.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element0);
            morphs[1] = dom.createMorphAt(element0, 0, 0);
            return morphs;
          },
          statements: [["element", "action", ["editAuthor", ["get", "author", ["loc", [null, [28, 38], [28, 44]]], 0, 0, 0, 0]], [], ["loc", [null, [28, 16], [28, 46]]], 0, 0], ["content", "author.name", ["loc", [null, [28, 47], [28, 62]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 33,
                "column": 10
              },
              "end": {
                "line": 35,
                "column": 10
              }
            },
            "moduleName": "library-app/templates/authors.hbs"
          },
          isEmpty: false,
          arity: 1,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("li");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
            return morphs;
          },
          statements: [["content", "book.title", ["loc", [null, [34, 16], [34, 30]]], 0, 0, 0, 0]],
          locals: ["book"],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 14,
              "column": 2
            },
            "end": {
              "line": 39,
              "column": 2
            }
          },
          "moduleName": "library-app/templates/authors.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n        ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("ul");
          var el4 = dom.createTextNode("\n");
          dom.appendChild(el3, el4);
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          var el4 = dom.createTextNode("        ");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element6 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createMorphAt(dom.childAt(element6, [1]), 1, 1);
          morphs[1] = dom.createMorphAt(dom.childAt(element6, [3, 1]), 1, 1);
          return morphs;
        },
        statements: [["block", "if", [["get", "author.isEditing", ["loc", [null, [17, 14], [17, 30]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [17, 8], [29, 15]]]], ["block", "each", [["get", "author.books", ["loc", [null, [33, 18], [33, 30]]], 0, 0, 0, 0]], [], 2, null, ["loc", [null, [33, 10], [35, 19]]]]],
        locals: ["author"],
        templates: [child0, child1, child2]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 42,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/authors.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Authors");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table table-bordered table-striped");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("\n      Name\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("small");
        dom.setAttribute(el5, "class", "small not-bold");
        var el6 = dom.createTextNode("(Click on name for editing)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4, "class", "vtop");
        var el5 = dom.createTextNode("Books");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [14, 10], [14, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [14, 2], [39, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/books", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 25,
                "column": 8
              },
              "end": {
                "line": 35,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/books.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "btn btn-danger");
            var el2 = dom.createTextNode("Cancel");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element9 = dom.childAt(fragment, [3]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createElementMorph(element9);
            return morphs;
          },
          statements: [["inline", "author-select", [], ["book", ["subexpr", "@mut", [["get", "book", ["loc", [null, [28, 17], [28, 21]]], 0, 0, 0, 0]], [], [], 0, 0], "authors", ["subexpr", "@mut", [["get", "authors", ["loc", [null, [29, 20], [29, 27]]], 0, 0, 0, 0]], [], [], 0, 0], "default", ["subexpr", "@mut", [["get", "book.author", ["loc", [null, [30, 20], [30, 31]]], 0, 0, 0, 0]], [], [], 0, 0], "action", "saveAuthor"], ["loc", [null, [27, 10], [31, 33]]], 0, 0], ["element", "action", ["cancelAuthorEdit", ["get", "book", ["loc", [null, [33, 69], [33, 73]]], 0, 0, 0, 0]], [], ["loc", [null, [33, 41], [33, 75]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 35,
                "column": 8
              },
              "end": {
                "line": 37,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/books.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element8 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element8);
            morphs[1] = dom.createMorphAt(element8, 0, 0);
            return morphs;
          },
          statements: [["element", "action", ["editAuthor", ["get", "book", ["loc", [null, [36, 38], [36, 42]]], 0, 0, 0, 0]], [], ["loc", [null, [36, 16], [36, 44]]], 0, 0], ["content", "book.author.name", ["loc", [null, [36, 45], [36, 65]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child2 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 41,
                "column": 8
              },
              "end": {
                "line": 51,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/books.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("form");
            dom.setAttribute(el1, "class", "form-inline");
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "input-group");
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createComment("");
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n              ");
            dom.appendChild(el2, el3);
            var el3 = dom.createElement("div");
            dom.setAttribute(el3, "class", "input-group-btn");
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("button");
            dom.setAttribute(el4, "type", "submit");
            dom.setAttribute(el4, "class", "btn btn-success");
            var el5 = dom.createTextNode("Save");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n                ");
            dom.appendChild(el3, el4);
            var el4 = dom.createElement("button");
            dom.setAttribute(el4, "class", "btn btn-danger");
            var el5 = dom.createTextNode("Cancel");
            dom.appendChild(el4, el5);
            dom.appendChild(el3, el4);
            var el4 = dom.createTextNode("\n              ");
            dom.appendChild(el3, el4);
            dom.appendChild(el2, el3);
            var el3 = dom.createTextNode("\n            ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n          ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element3 = dom.childAt(fragment, [1]);
            var element4 = dom.childAt(element3, [1]);
            var element5 = dom.childAt(element4, [3]);
            var element6 = dom.childAt(element5, [1]);
            var element7 = dom.childAt(element5, [3]);
            var morphs = new Array(4);
            morphs[0] = dom.createElementMorph(element3);
            morphs[1] = dom.createMorphAt(element4, 1, 1);
            morphs[2] = dom.createAttrMorph(element6, 'disabled');
            morphs[3] = dom.createElementMorph(element7);
            return morphs;
          },
          statements: [["element", "action", ["saveBook", ["get", "book", ["loc", [null, [42, 36], [42, 40]]], 0, 0, 0, 0]], ["on", "submit"], ["loc", [null, [42, 16], [42, 54]]], 0, 0], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "book.title", ["loc", [null, [44, 28], [44, 38]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control"], ["loc", [null, [44, 14], [44, 61]]], 0, 0], ["attribute", "disabled", ["get", "book.isNotValid", ["loc", [null, [46, 73], [46, 88]]], 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["cancelBookEdit", ["get", "book", ["loc", [null, [47, 73], [47, 77]]], 0, 0, 0, 0]], [], ["loc", [null, [47, 47], [47, 79]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child3 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 51,
                "column": 8
              },
              "end": {
                "line": 53,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/books.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element2 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element2);
            morphs[1] = dom.createMorphAt(element2, 0, 0);
            return morphs;
          },
          statements: [["element", "action", ["editBook", ["get", "book", ["loc", [null, [52, 36], [52, 40]]], 0, 0, 0, 0]], [], ["loc", [null, [52, 16], [52, 42]]], 0, 0], ["content", "book.title", ["loc", [null, [52, 43], [52, 57]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child4 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 59,
                "column": 8
              },
              "end": {
                "line": 69,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/books.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("\n          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "btn btn-danger");
            var el2 = dom.createTextNode("Cancel");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element1 = dom.childAt(fragment, [3]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createElementMorph(element1);
            return morphs;
          },
          statements: [["inline", "library-select", [], ["book", ["subexpr", "@mut", [["get", "book", ["loc", [null, [62, 17], [62, 21]]], 0, 0, 0, 0]], [], [], 0, 0], "libraries", ["subexpr", "@mut", [["get", "libraries", ["loc", [null, [63, 22], [63, 31]]], 0, 0, 0, 0]], [], [], 0, 0], "default", ["subexpr", "@mut", [["get", "book.library", ["loc", [null, [64, 20], [64, 32]]], 0, 0, 0, 0]], [], [], 0, 0], "action", "saveLibrary"], ["loc", [null, [61, 10], [65, 34]]], 0, 0], ["element", "action", ["cancelLibraryEdit", ["get", "book", ["loc", [null, [67, 70], [67, 74]]], 0, 0, 0, 0]], [], ["loc", [null, [67, 41], [67, 76]]], 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child5 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 69,
                "column": 8
              },
              "end": {
                "line": 71,
                "column": 8
              }
            },
            "moduleName": "library-app/templates/books.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("          ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("span");
            var el2 = dom.createComment("");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [1]);
            var morphs = new Array(2);
            morphs[0] = dom.createElementMorph(element0);
            morphs[1] = dom.createMorphAt(element0, 0, 0);
            return morphs;
          },
          statements: [["element", "action", ["editLibrary", ["get", "book", ["loc", [null, [70, 39], [70, 43]]], 0, 0, 0, 0]], [], ["loc", [null, [70, 16], [70, 45]]], 0, 0], ["content", "book.library.name", ["loc", [null, [70, 46], [70, 67]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 21,
              "column": 2
            },
            "end": {
              "line": 74,
              "column": 2
            }
          },
          "moduleName": "library-app/templates/books.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createTextNode("\n\n");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("      ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element10 = dom.childAt(fragment, [1]);
          var morphs = new Array(4);
          morphs[0] = dom.createMorphAt(dom.childAt(element10, [1]), 1, 1);
          morphs[1] = dom.createMorphAt(dom.childAt(element10, [3]), 1, 1);
          morphs[2] = dom.createMorphAt(dom.childAt(element10, [5]), 0, 0);
          morphs[3] = dom.createMorphAt(dom.childAt(element10, [7]), 1, 1);
          return morphs;
        },
        statements: [["block", "if", [["get", "book.isAuthorEditing", ["loc", [null, [25, 14], [25, 34]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [25, 8], [37, 15]]]], ["block", "if", [["get", "book.isEditing", ["loc", [null, [41, 14], [41, 28]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [41, 8], [53, 15]]]], ["content", "book.releaseYear", ["loc", [null, [56, 10], [56, 30]]], 0, 0, 0, 0], ["block", "if", [["get", "book.isLibraryEditing", ["loc", [null, [59, 14], [59, 35]]], 0, 0, 0, 0]], [], 4, 5, ["loc", [null, [59, 8], [71, 15]]]]],
        locals: ["book"],
        templates: [child0, child1, child2, child3, child4, child5]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 77,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/books.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Books");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1, "class", "table table-bordered table-striped");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4, "class", "vtop wider");
        var el5 = dom.createTextNode("\n      Author\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("small");
        dom.setAttribute(el5, "class", "small not-bold");
        var el6 = dom.createTextNode("(Click on the name for editing)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("\n      Title\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("small");
        dom.setAttribute(el5, "class", "small not-bold");
        var el6 = dom.createTextNode("(Click on the title for editing)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4, "class", "vtop");
        var el5 = dom.createTextNode("Release Year");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        dom.setAttribute(el4, "class", "vtop");
        var el5 = dom.createTextNode("\n      Library\n      ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("br");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("small");
        dom.setAttribute(el5, "class", "small not-bold");
        var el6 = dom.createTextNode("(Click on the name for editing)");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("    ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n  ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "model", ["loc", [null, [21, 10], [21, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [21, 2], [74, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/components/abc-buttons", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 3,
                "column": 4
              },
              "end": {
                "line": 3,
                "column": 109
              }
            },
            "moduleName": "library-app/templates/components/abc-buttons.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
            dom.insertBoundary(fragment, 0);
            dom.insertBoundary(fragment, null);
            return morphs;
          },
          statements: [["content", "letter", ["loc", [null, [3, 99], [3, 109]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 2,
              "column": 2
            },
            "end": {
              "line": 4,
              "column": 2
            }
          },
          "moduleName": "library-app/templates/components/abc-buttons.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [["block", "link-to", [["subexpr", "query-params", [], ["limit", "abc", "letter", ["get", "letter", ["loc", [null, [3, 48], [3, 54]]], 0, 0, 0, 0]], ["loc", [null, [3, 15], [3, 55]]], 0, 0]], ["class", "btn btn-lg btn-narrow btn-default"], 0, null, ["loc", [null, [3, 4], [3, 121]]]]],
        locals: ["letter"],
        templates: [child0]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/abc-buttons.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "btn-group");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "atoz", ["loc", [null, [2, 10], [2, 14]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [2, 2], [4, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/components/author-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "library-app/templates/components/author-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'selected');
          morphs[2] = dom.createMorphAt(element0, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["get", "author.id", ["loc", [null, [2, 18], [2, 27]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selected", ["subexpr", "is-equal", [["get", "author.id", ["loc", [null, [2, 50], [2, 59]]], 0, 0, 0, 0], ["get", "default.id", ["loc", [null, [2, 60], [2, 70]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [2, 72]]], 0, 0], 0, 0, 0, 0], ["content", "author.name", ["loc", [null, [3, 4], [3, 19]]], 0, 0, 0, 0]],
        locals: ["author"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/author-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "authors", ["loc", [null, [1, 8], [1, 15]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [5, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/components/fader-label", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/fader-label.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        return morphs;
      },
      statements: [["content", "yield", ["loc", [null, [1, 0], [1, 9]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/components/library-item-form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 10
            },
            "end": {
              "line": 6,
              "column": 96
            }
          },
          "moduleName": "library-app/templates/components/library-item-form.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("span");
          dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 26,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/components/library-item-form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "form-horizontal");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Name*");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Address");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("label");
        dom.setAttribute(el3, "class", "col-sm-2 control-label");
        var el4 = dom.createTextNode("Phone");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-10");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-group");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-sm-offset-2 col-sm-10");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "submit");
        dom.setAttribute(el4, "class", "btn btn-default");
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [1]);
        var element2 = dom.childAt(element1, [3]);
        var element3 = dom.childAt(element0, [7, 1, 1]);
        var morphs = new Array(8);
        morphs[0] = dom.createAttrMorph(element1, 'class');
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createMorphAt(dom.childAt(element0, [3, 3]), 1, 1);
        morphs[4] = dom.createMorphAt(dom.childAt(element0, [5, 3]), 1, 1);
        morphs[5] = dom.createAttrMorph(element3, 'disabled');
        morphs[6] = dom.createElementMorph(element3);
        morphs[7] = dom.createMorphAt(element3, 0, 0);
        return morphs;
      },
      statements: [["attribute", "class", ["concat", ["form-group has-feedback ", ["subexpr", "if", [["get", "item.isValid", ["loc", [null, [2, 45], [2, 57]]], 0, 0, 0, 0], "has-success"], [], ["loc", [null, [2, 40], [2, 73]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "item.name", ["loc", [null, [5, 36], [5, 45]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "The name of the Library"], ["loc", [null, [5, 10], [5, 106]]], 0, 0], ["block", "if", [["get", "item.isValid", ["loc", [null, [6, 16], [6, 28]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [6, 10], [6, 103]]]], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "item.address", ["loc", [null, [12, 36], [12, 48]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "The address of the Library"], ["loc", [null, [12, 10], [12, 112]]], 0, 0], ["inline", "input", [], ["type", "text", "value", ["subexpr", "@mut", [["get", "item.phone", ["loc", [null, [18, 36], [18, 46]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "The phone number of the Library"], ["loc", [null, [18, 10], [18, 115]]], 0, 0], ["attribute", "disabled", ["concat", [["subexpr", "unless", [["get", "item.isValid", ["loc", [null, [23, 109], [23, 121]]], 0, 0, 0, 0], "disabled"], [], ["loc", [null, [23, 100], [23, 134]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["buttonClicked", ["get", "item", ["loc", [null, [23, 83], [23, 87]]], 0, 0, 0, 0]], [], ["loc", [null, [23, 58], [23, 89]]], 0, 0], ["content", "buttonLabel", ["loc", [null, [23, 136], [23, 151]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/components/library-item", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 19,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/library-item.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "panel panel-default library-item");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "panel-heading");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3, "class", "panel-title");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "panel-body");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Address: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("p");
        var el4 = dom.createTextNode("Phone: ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "panel-footer");
        var el3 = dom.createTextNode("\n      Number of books:\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3, "class", "text-left badge");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("span");
        dom.setAttribute(el3, "class", "pull-right");
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element0, [5]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1, 1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [3]), 1, 1);
        morphs[3] = dom.createMorphAt(dom.childAt(element2, [1]), 1, 1);
        morphs[4] = dom.createMorphAt(dom.childAt(element2, [3]), 1, 1);
        return morphs;
      },
      statements: [["content", "item.name", ["loc", [null, [3, 32], [3, 45]]], 0, 0, 0, 0], ["content", "item.address", ["loc", [null, [6, 20], [6, 36]]], 0, 0, 0, 0], ["content", "item.phone", ["loc", [null, [7, 18], [7, 32]]], 0, 0, 0, 0], ["content", "badge", ["loc", [null, [12, 8], [12, 17]]], 0, 0, 0, 0], ["content", "yield", ["loc", [null, [15, 8], [15, 17]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/components/library-select", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 1,
              "column": 0
            },
            "end": {
              "line": 5,
              "column": 0
            }
          },
          "moduleName": "library-app/templates/components/library-select.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("  ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("option");
          var el2 = dom.createTextNode("\n    ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n  ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'value');
          morphs[1] = dom.createAttrMorph(element0, 'selected');
          morphs[2] = dom.createMorphAt(element0, 1, 1);
          return morphs;
        },
        statements: [["attribute", "value", ["get", "library.id", ["loc", [null, [2, 18], [2, 28]]], 0, 0, 0, 0], 0, 0, 0, 0], ["attribute", "selected", ["subexpr", "is-equal", [["get", "library.id", ["loc", [null, [2, 51], [2, 61]]], 0, 0, 0, 0], ["get", "default.id", ["loc", [null, [2, 62], [2, 72]]], 0, 0, 0, 0]], [], ["loc", [null, [null, null], [2, 74]]], 0, 0], 0, 0, 0, 0], ["content", "library.name", ["loc", [null, [3, 4], [3, 20]]], 0, 0, 0, 0]],
        locals: ["library"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 6,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/library-select.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "each", [["get", "libraries", ["loc", [null, [1, 8], [1, 17]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [1, 0], [5, 9]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/components/nav-link-to", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 36
          }
        },
        "moduleName": "library-app/templates/components/nav-link-to.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("a");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'href');
        morphs[1] = dom.createMorphAt(element0, 0, 0);
        return morphs;
      },
      statements: [["attribute", "href", ["concat", [["get", "hrefForA", ["loc", [null, [1, 11], [1, 19]]], 0, 0, 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "yield", ["loc", [null, [1, 23], [1, 32]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/components/number-box", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 5,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/number-box.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "panel-heading");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h3");
        dom.setAttribute(el2, "class", "text-center");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        dom.setAttribute(el2, "class", "text-center");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [3]), 0, 0);
        return morphs;
      },
      statements: [["content", "title", ["loc", [null, [2, 26], [2, 35]]], 0, 0, 0, 0], ["inline", "if", [["get", "number", ["loc", [null, [3, 31], [3, 37]]], 0, 0, 0, 0], ["get", "number", ["loc", [null, [3, 38], [3, 44]]], 0, 0, 0, 0], "..."], [], ["loc", [null, [3, 26], [3, 52]]], 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/components/seeder-block", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 13,
              "column": 10
            },
            "end": {
              "line": 13,
              "column": 56
            }
          },
          "moduleName": "library-app/templates/components/seeder-block.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Created!");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 10
            },
            "end": {
              "line": 17,
              "column": 56
            }
          },
          "moduleName": "library-app/templates/components/seeder-block.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Deleted!");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 24,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/components/seeder-block.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-12");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "row");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("div");
        dom.setAttribute(el4, "class", "form-horizontal");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("label");
        dom.setAttribute(el5, "class", "col-sm-2 control-label");
        var el6 = dom.createTextNode("Number of new records:");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "col-sm-2");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "col-sm-4");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6, "class", "btn btn-primary");
        var el7 = dom.createTextNode("Generate ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("div");
        dom.setAttribute(el5, "class", "col-sm-4");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("button");
        dom.setAttribute(el6, "class", "btn btn-danger");
        var el7 = dom.createTextNode("Delete All ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3, 1]);
        var element2 = dom.childAt(element1, [5]);
        var element3 = dom.childAt(element2, [1]);
        var element4 = dom.childAt(element1, [7]);
        var element5 = dom.childAt(element4, [1]);
        var morphs = new Array(8);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]), 1, 1);
        morphs[2] = dom.createElementMorph(element3);
        morphs[3] = dom.createMorphAt(element3, 1, 1);
        morphs[4] = dom.createMorphAt(element2, 3, 3);
        morphs[5] = dom.createElementMorph(element5);
        morphs[6] = dom.createMorphAt(element5, 1, 1);
        morphs[7] = dom.createMorphAt(element4, 3, 3);
        return morphs;
      },
      statements: [["content", "sectionTitle", ["loc", [null, [3, 8], [3, 24]]], 0, 0, 0, 0], ["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "counter", ["loc", [null, [9, 24], [9, 31]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control"], ["loc", [null, [9, 10], [9, 54]]], 0, 0], ["element", "action", ["generateAction"], [], ["loc", [null, [12, 42], [12, 69]]], 0, 0], ["content", "sectionTitle", ["loc", [null, [12, 79], [12, 95]]], 0, 0, 0, 0], ["block", "fader-label", [], ["isShowing", ["subexpr", "@mut", [["get", "createReady", ["loc", [null, [13, 35], [13, 46]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [13, 10], [13, 72]]]], ["element", "action", ["deleteAction"], [], ["loc", [null, [16, 41], [16, 66]]], 0, 0], ["content", "sectionTitle", ["loc", [null, [16, 78], [16, 94]]], 0, 0, 0, 0], ["block", "fader-label", [], ["isShowing", ["subexpr", "@mut", [["get", "deleteReady", ["loc", [null, [17, 35], [17, 46]]], 0, 0, 0, 0]], [], [], 0, 0]], 1, null, ["loc", [null, [17, 10], [17, 72]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("library-app/templates/components/spinner-cube", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 11,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/components/spinner-cube.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "sk-cube-grid");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube1");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube2");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube3");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube4");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube5");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube6");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube7");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube8");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "sk-cube sk-cube9");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/contact", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 6
            },
            "end": {
              "line": 18,
              "column": 6
            }
          },
          "moduleName": "library-app/templates/contact.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-success");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("h4");
          var el3 = dom.createTextNode("Thank you! Your message is sent.");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("To: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("Message: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("p");
          var el3 = dom.createTextNode("Reference ID: ");
          dom.appendChild(el2, el3);
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element3 = dom.childAt(fragment, [3]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element3, [3]), 1, 1);
          morphs[1] = dom.createMorphAt(dom.childAt(element3, [5]), 1, 1);
          morphs[2] = dom.createMorphAt(dom.childAt(element3, [7]), 1, 1);
          return morphs;
        },
        statements: [["content", "model.email", ["loc", [null, [13, 19], [13, 34]]], 0, 0, 0, 0], ["content", "model.message", ["loc", [null, [14, 24], [14, 41]]], 0, 0, 0, 0], ["content", "model.id", ["loc", [null, [15, 29], [15, 41]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 23,
                "column": 10
              },
              "end": {
                "line": 23,
                "column": 102
              }
            },
            "moduleName": "library-app/templates/contact.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("span");
            dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 28,
                "column": 10
              },
              "end": {
                "line": 28,
                "column": 109
              }
            },
            "moduleName": "library-app/templates/contact.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("span");
            dom.setAttribute(el1, "class", "glyphicon glyphicon-ok form-control-feedback");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 6
            },
            "end": {
              "line": 32,
              "column": 6
            }
          },
          "moduleName": "library-app/templates/contact.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("Your email address*:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("label");
          var el3 = dom.createTextNode("Your message*:");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("button");
          dom.setAttribute(el1, "class", "btn btn-success");
          var el2 = dom.createTextNode("Send");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var element1 = dom.childAt(fragment, [3]);
          var element2 = dom.childAt(fragment, [5]);
          var morphs = new Array(8);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createMorphAt(element0, 3, 3);
          morphs[2] = dom.createMorphAt(element0, 5, 5);
          morphs[3] = dom.createAttrMorph(element1, 'class');
          morphs[4] = dom.createMorphAt(element1, 3, 3);
          morphs[5] = dom.createMorphAt(element1, 5, 5);
          morphs[6] = dom.createAttrMorph(element2, 'disabled');
          morphs[7] = dom.createElementMorph(element2);
          return morphs;
        },
        statements: [["attribute", "class", ["concat", ["form-group has-feedback ", ["subexpr", "if", [["get", "model.isValidEmail", ["loc", [null, [20, 49], [20, 67]]], 0, 0, 0, 0], "has-success"], [], ["loc", [null, [20, 44], [20, 83]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "input", [], ["type", "email", "class", "form-control", "placeholder", "Your email address", "value", ["subexpr", "@mut", [["get", "model.email", ["loc", [null, [22, 91], [22, 102]]], 0, 0, 0, 0]], [], [], 0, 0], "autofocus", "autofocus"], ["loc", [null, [22, 10], [22, 126]]], 0, 0], ["block", "if", [["get", "model.isValidEmail", ["loc", [null, [23, 16], [23, 34]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [23, 10], [23, 109]]]], ["attribute", "class", ["concat", ["form-group has-feedback ", ["subexpr", "if", [["get", "model.isMessageEnoughLong", ["loc", [null, [25, 49], [25, 74]]], 0, 0, 0, 0], "has-success"], [], ["loc", [null, [25, 44], [25, 90]]], 0, 0]], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["inline", "textarea", [], ["class", "form-control", "placeholder", "Your message. (At least 5 characters.)", "rows", "5", "value", ["subexpr", "@mut", [["get", "model.message", ["loc", [null, [27, 110], [27, 123]]], 0, 0, 0, 0]], [], [], 0, 0]], ["loc", [null, [27, 10], [27, 125]]], 0, 0], ["block", "if", [["get", "model.isMessageEnoughLong", ["loc", [null, [28, 16], [28, 41]]], 0, 0, 0, 0]], [], 1, null, ["loc", [null, [28, 10], [28, 116]]]], ["attribute", "disabled", ["get", "model.isNotValid", ["loc", [null, [30, 82], [30, 98]]], 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["sendMessage", ["get", "model", ["loc", [null, [30, 63], [30, 68]]], 0, 0, 0, 0]], [], ["loc", [null, [30, 40], [30, 70]]], 0, 0]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/contact.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Contact Page");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("p");
        dom.setAttribute(el1, "class", "well well-sm");
        var el2 = dom.createTextNode("If you have any question or feedback please leave a message with your email address.");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-6");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [4, 1]), 1, 1);
        return morphs;
      },
      statements: [["block", "if", [["get", "responseMessage", ["loc", [null, [8, 12], [8, 27]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [8, 6], [32, 13]]]]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("library-app/templates/footer", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 9,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/footer.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("footer");
        dom.setAttribute(el1, "class", "page-footer");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Welcome in this Ember.js 2.7 Demo App. Please click through and check all menu point and features. You can build\n    this application if you follow our free ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "http://yoember.com");
        var el4 = dom.createTextNode("Ember.js tutorial");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(".\n    Please don't use your real email address. This database is public, you can list the database in Admin section.\n    The source code on ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "https://github.com/zoltan-nz/library-app");
        var el4 = dom.createTextNode("GitHub");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(".");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("If you have any question or suggestion, please contact me. Web: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "http://zoltan.nz");
        var el4 = dom.createTextNode("zoltan.nz");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode(",\n    Twitter: ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("a");
        dom.setAttribute(el3, "href", "http://www.twitter.com/zoltan_nz");
        var el4 = dom.createTextNode("@zoltan_nz");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 4
            },
            "end": {
              "line": 19,
              "column": 4
            }
          },
          "moduleName": "library-app/templates/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "alert alert-success");
          dom.setAttribute(el1, "role", "alert");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 0, 0);
          return morphs;
        },
        statements: [["content", "responseMessage", ["loc", [null, [18, 54], [18, 73]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 22,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "jumbotron text-center");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h1");
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("p");
        var el3 = dom.createTextNode("Don't miss our launch date, request an invitation now.");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "form-horizontal form-group form-group-lg row");
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-xs-10 col-xs-offset-1 col-sm-6 col-sm-offset-1 col-md-5 col-md-offset-2");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "col-xs-10 col-xs-offset-1 col-sm-offset-0 col-sm-4 col-md-3");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "class", "btn btn-primary btn-lg btn-block");
        var el5 = dom.createTextNode("Request invitation");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("br");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var element1 = dom.childAt(element0, [8]);
        var element2 = dom.childAt(element1, [3, 1]);
        var morphs = new Array(5);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[2] = dom.createAttrMorph(element2, 'disabled');
        morphs[3] = dom.createElementMorph(element2);
        morphs[4] = dom.createMorphAt(element0, 10, 10);
        return morphs;
      },
      statements: [["content", "headerMessage", ["loc", [null, [2, 8], [2, 25]]], 0, 0, 0, 0], ["inline", "input", [], ["type", "email", "value", ["subexpr", "@mut", [["get", "emailAddress", ["loc", [null, [10, 37], [10, 49]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control", "placeholder", "Please type your e-mail address.", "autofocus", "autofocus"], ["loc", [null, [10, 10], [10, 141]]], 0, 0], ["attribute", "disabled", ["get", "isDisabled", ["loc", [null, [13, 100], [13, 110]]], 0, 0, 0, 0], 0, 0, 0, 0], ["element", "action", ["saveInvitation"], [], ["loc", [null, [13, 61], [13, 88]]], 0, 0], ["block", "if", [["get", "responseMessage", ["loc", [null, [17, 10], [17, 25]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [17, 4], [19, 11]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/libraries", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 6
            },
            "end": {
              "line": 5,
              "column": 69
            }
          },
          "moduleName": "library-app/templates/libraries.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("List all");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 6,
              "column": 6
            },
            "end": {
              "line": 6,
              "column": 66
            }
          },
          "moduleName": "library-app/templates/libraries.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1, "href", "");
          var el2 = dom.createTextNode("Add new");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 10
          }
        },
        "moduleName": "library-app/templates/libraries.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Libraries");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "well well-sm");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("ul");
        dom.setAttribute(el2, "class", "nav nav-pills");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2, 1]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(element0, 1, 1);
        morphs[1] = dom.createMorphAt(element0, 3, 3);
        morphs[2] = dom.createMorphAt(fragment, 4, 4, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["block", "link-to", ["libraries.index"], ["tagName", "li"], 0, null, ["loc", [null, [5, 6], [5, 81]]]], ["block", "link-to", ["libraries.new"], ["tagName", "li"], 1, null, ["loc", [null, [6, 6], [6, 78]]]], ["content", "outlet", ["loc", [null, [10, 0], [10, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: [child0, child1]
    };
  })());
});
define("library-app/templates/libraries/form", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 6
            },
            "end": {
              "line": 14,
              "column": 6
            }
          },
          "moduleName": "library-app/templates/libraries/form.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("br");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 18,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/libraries/form.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-6");
        var el3 = dom.createTextNode("\n\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-4");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [2]);
        var morphs = new Array(3);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [0]), 0, 0);
        morphs[1] = dom.createMorphAt(dom.childAt(element0, [1]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element0, [3]), 1, 1);
        return morphs;
      },
      statements: [["content", "title", ["loc", [null, [1, 4], [1, 13]]], 0, 0, 0, 0], ["inline", "library-item-form", [], ["item", ["subexpr", "@mut", [["get", "model", ["loc", [null, [6, 31], [6, 36]]], 0, 0, 0, 0]], [], [], 0, 0], "buttonLabel", ["subexpr", "@mut", [["get", "buttonLabel", ["loc", [null, [6, 49], [6, 60]]], 0, 0, 0, 0]], [], [], 0, 0], "action", "saveLibrary"], ["loc", [null, [6, 6], [6, 83]]], 0, 0], ["block", "library-item", [], ["item", ["subexpr", "@mut", [["get", "model", ["loc", [null, [12, 27], [12, 32]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [12, 6], [14, 23]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("library-app/templates/libraries/index", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 5,
              "column": 4
            },
            "end": {
              "line": 5,
              "column": 97
            }
          },
          "moduleName": "library-app/templates/libraries/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("All");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 8,
              "column": 4
            },
            "end": {
              "line": 8,
              "column": 87
            }
          },
          "moduleName": "library-app/templates/libraries/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Abc");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 12,
              "column": 4
            },
            "end": {
              "line": 16,
              "column": 4
            }
          },
          "moduleName": "library-app/templates/libraries/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "form-group");
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n      ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["inline", "input", [], ["value", ["subexpr", "@mut", [["get", "filter", ["loc", [null, [14, 22], [14, 28]]], 0, 0, 0, 0]], [], [], 0, 0], "class", "form-control input-lg", "placeholder", "Filter by library name"], ["loc", [null, [14, 8], [14, 97]]], 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 4
            },
            "end": {
              "line": 20,
              "column": 4
            }
          },
          "moduleName": "library-app/templates/libraries/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "form-group");
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["content", "abc-buttons", ["loc", [null, [18, 10], [18, 25]]], 0, 0, 0, 0]],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      var child0 = (function () {
        var child0 = (function () {
          return {
            meta: {
              "revision": "Ember@2.7.1",
              "loc": {
                "source": null,
                "start": {
                  "line": 28,
                  "column": 8
                },
                "end": {
                  "line": 28,
                  "column": 83
                }
              },
              "moduleName": "library-app/templates/libraries/index.hbs"
            },
            isEmpty: false,
            arity: 0,
            cachedFragment: null,
            hasRendered: false,
            buildFragment: function buildFragment(dom) {
              var el0 = dom.createDocumentFragment();
              var el1 = dom.createTextNode("Edit");
              dom.appendChild(el0, el1);
              return el0;
            },
            buildRenderNodes: function buildRenderNodes() {
              return [];
            },
            statements: [],
            locals: [],
            templates: []
          };
        })();
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 27,
                "column": 6
              },
              "end": {
                "line": 30,
                "column": 6
              }
            },
            "moduleName": "library-app/templates/libraries/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n        ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("button");
            dom.setAttribute(el1, "class", "btn btn-danger btn-xs");
            var el2 = dom.createTextNode("Delete");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var element0 = dom.childAt(fragment, [3]);
            var morphs = new Array(2);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            morphs[1] = dom.createElementMorph(element0);
            return morphs;
          },
          statements: [["block", "link-to", ["libraries.edit", ["get", "library.id", ["loc", [null, [28, 36], [28, 46]]], 0, 0, 0, 0]], ["class", "btn btn-success btn-xs"], 0, null, ["loc", [null, [28, 8], [28, 95]]]], ["element", "action", ["deleteLibrary", ["get", "library", ["loc", [null, [29, 71], [29, 78]]], 0, 0, 0, 0]], [], ["loc", [null, [29, 46], [29, 80]]], 0, 0]],
          locals: [],
          templates: [child0]
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 25,
              "column": 2
            },
            "end": {
              "line": 32,
              "column": 2
            }
          },
          "moduleName": "library-app/templates/libraries/index.hbs"
        },
        isEmpty: false,
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1, "class", "col-md-4");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(dom.childAt(fragment, [1]), 1, 1);
          return morphs;
        },
        statements: [["block", "library-item", [], ["item", ["subexpr", "@mut", [["get", "library", ["loc", [null, [27, 27], [27, 34]]], 0, 0, 0, 0]], [], [], 0, 0], "badge", ["subexpr", "@mut", [["get", "library.books.length", ["loc", [null, [27, 41], [27, 61]]], 0, 0, 0, 0]], [], [], 0, 0]], 0, null, ["loc", [null, [27, 6], [30, 23]]]]],
        locals: ["library"],
        templates: [child0]
      };
    })();
    var child5 = (function () {
      var child0 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 33,
                "column": 4
              },
              "end": {
                "line": 35,
                "column": 4
              }
            },
            "moduleName": "library-app/templates/libraries/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
            return morphs;
          },
          statements: [["content", "spinner-cube", ["loc", [null, [34, 6], [34, 22]]], 0, 0, 0, 0]],
          locals: [],
          templates: []
        };
      })();
      var child1 = (function () {
        return {
          meta: {
            "revision": "Ember@2.7.1",
            "loc": {
              "source": null,
              "start": {
                "line": 35,
                "column": 4
              },
              "end": {
                "line": 41,
                "column": 4
              }
            },
            "moduleName": "library-app/templates/libraries/index.hbs"
          },
          isEmpty: false,
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("      ");
            dom.appendChild(el0, el1);
            var el1 = dom.createElement("div");
            dom.setAttribute(el1, "class", "col-md-12 text-center");
            var el2 = dom.createTextNode("\n        ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("div");
            dom.setAttribute(el2, "class", "alert alert-info");
            var el3 = dom.createTextNode("\n          Sorry, no result.\n        ");
            dom.appendChild(el2, el3);
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n      ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 32,
              "column": 2
            },
            "end": {
              "line": 42,
              "column": 2
            }
          },
          "moduleName": "library-app/templates/libraries/index.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [["block", "if", [["get", "model.isUpdating", ["loc", [null, [33, 10], [33, 26]]], 0, 0, 0, 0]], [], 0, 1, ["loc", [null, [33, 4], [41, 11]]]]],
        locals: [],
        templates: [child0, child1]
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 44,
            "column": 0
          }
        },
        "moduleName": "library-app/templates/libraries/index.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h2");
        var el2 = dom.createTextNode("List");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-1");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-1");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "col-md-10");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element1 = dom.childAt(fragment, [2]);
        var morphs = new Array(4);
        morphs[0] = dom.createMorphAt(dom.childAt(element1, [1]), 1, 1);
        morphs[1] = dom.createMorphAt(dom.childAt(element1, [3]), 1, 1);
        morphs[2] = dom.createMorphAt(dom.childAt(element1, [5]), 1, 1);
        morphs[3] = dom.createMorphAt(dom.childAt(fragment, [4]), 1, 1);
        return morphs;
      },
      statements: [["block", "link-to", [["subexpr", "query-params", [], ["limit", "all", "letter", ""], ["loc", [null, [5, 15], [5, 51]]], 0, 0]], ["class", "btn btn-default btn-lg btn-block"], 0, null, ["loc", [null, [5, 4], [5, 109]]]], ["block", "link-to", [["subexpr", "query-params", [], ["limit", "abc"], ["loc", [null, [8, 15], [8, 41]]], 0, 0]], ["class", "btn btn-default btn-lg btn-block"], 1, null, ["loc", [null, [8, 4], [8, 99]]]], ["block", "if", [["get", "limitAll", ["loc", [null, [12, 10], [12, 18]]], 0, 0, 0, 0]], [], 2, 3, ["loc", [null, [12, 4], [20, 11]]]], ["block", "each", [["get", "filteredList", ["loc", [null, [25, 10], [25, 22]]], 0, 0, 0, 0]], [], 4, 5, ["loc", [null, [25, 2], [42, 11]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5]
    };
  })());
});
define("library-app/templates/libraries/loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 16
          }
        },
        "moduleName": "library-app/templates/libraries/loading.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "spinner-cube", ["loc", [null, [1, 0], [1, 16]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 16
          }
        },
        "moduleName": "library-app/templates/loading.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["content", "spinner-cube", ["loc", [null, [1, 0], [1, 16]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("library-app/templates/navbar", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 10,
              "column": 6
            },
            "end": {
              "line": 10,
              "column": 58
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Library App");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child1 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 15,
              "column": 8
            },
            "end": {
              "line": 15,
              "column": 36
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Home");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child2 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 16,
              "column": 8
            },
            "end": {
              "line": 16,
              "column": 45
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Libraries");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child3 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 17,
              "column": 8
            },
            "end": {
              "line": 17,
              "column": 41
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Authors");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child4 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 18,
              "column": 8
            },
            "end": {
              "line": 18,
              "column": 37
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Books");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child5 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 22,
              "column": 8
            },
            "end": {
              "line": 22,
              "column": 37
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("About");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child6 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 23,
              "column": 8
            },
            "end": {
              "line": 23,
              "column": 41
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Contact");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child7 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 28,
              "column": 12
            },
            "end": {
              "line": 28,
              "column": 59
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Invitations");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child8 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 29,
              "column": 12
            },
            "end": {
              "line": 29,
              "column": 53
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Contacts");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    var child9 = (function () {
      return {
        meta: {
          "revision": "Ember@2.7.1",
          "loc": {
            "source": null,
            "start": {
              "line": 30,
              "column": 12
            },
            "end": {
              "line": 30,
              "column": 49
            }
          },
          "moduleName": "library-app/templates/navbar.hbs"
        },
        isEmpty: false,
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Seeder");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes() {
          return [];
        },
        statements: [],
        locals: [],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.7.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 36,
            "column": 6
          }
        },
        "moduleName": "library-app/templates/navbar.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1, "class", "navbar navbar-inverse");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container-fluid");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "navbar-header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4, "type", "button");
        dom.setAttribute(el4, "class", "navbar-toggle collapsed");
        dom.setAttribute(el4, "data-toggle", "collapse");
        dom.setAttribute(el4, "data-target", "#main-navbar");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "sr-only");
        var el6 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5, "class", "icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "collapse navbar-collapse");
        dom.setAttribute(el3, "id", "main-navbar");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav navbar-nav");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4, "class", "nav navbar-nav navbar-right");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("li");
        dom.setAttribute(el5, "class", "dropdown");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("a");
        dom.setAttribute(el6, "class", "dropdown-toggle");
        dom.setAttribute(el6, "data-toggle", "dropdown");
        dom.setAttribute(el6, "role", "button");
        dom.setAttribute(el6, "aria-haspopup", "true");
        dom.setAttribute(el6, "aria-expanded", "false");
        var el7 = dom.createTextNode("Admin");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("span");
        dom.setAttribute(el7, "class", "caret");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("ul");
        dom.setAttribute(el6, "class", "dropdown-menu");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createComment("");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" /.navbar-collapse ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /.container-fluid ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0, 1]);
        var element1 = dom.childAt(element0, [3]);
        var element2 = dom.childAt(element1, [1]);
        var element3 = dom.childAt(element1, [3]);
        var element4 = dom.childAt(element3, [5, 3]);
        var morphs = new Array(10);
        morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 3, 3);
        morphs[1] = dom.createMorphAt(element2, 1, 1);
        morphs[2] = dom.createMorphAt(element2, 3, 3);
        morphs[3] = dom.createMorphAt(element2, 5, 5);
        morphs[4] = dom.createMorphAt(element2, 7, 7);
        morphs[5] = dom.createMorphAt(element3, 1, 1);
        morphs[6] = dom.createMorphAt(element3, 3, 3);
        morphs[7] = dom.createMorphAt(element4, 1, 1);
        morphs[8] = dom.createMorphAt(element4, 3, 3);
        morphs[9] = dom.createMorphAt(element4, 5, 5);
        return morphs;
      },
      statements: [["block", "link-to", ["index"], ["class", "navbar-brand"], 0, null, ["loc", [null, [10, 6], [10, 70]]]], ["block", "nav-link-to", ["index"], [], 1, null, ["loc", [null, [15, 8], [15, 52]]]], ["block", "nav-link-to", ["libraries"], [], 2, null, ["loc", [null, [16, 8], [16, 61]]]], ["block", "nav-link-to", ["authors"], [], 3, null, ["loc", [null, [17, 8], [17, 57]]]], ["block", "nav-link-to", ["books"], [], 4, null, ["loc", [null, [18, 8], [18, 53]]]], ["block", "nav-link-to", ["about"], [], 5, null, ["loc", [null, [22, 8], [22, 53]]]], ["block", "nav-link-to", ["contact"], [], 6, null, ["loc", [null, [23, 8], [23, 57]]]], ["block", "nav-link-to", ["admin.invitations"], [], 7, null, ["loc", [null, [28, 12], [28, 75]]]], ["block", "nav-link-to", ["admin.contacts"], [], 8, null, ["loc", [null, [29, 12], [29, 69]]]], ["block", "nav-link-to", ["admin.seeder"], [], 9, null, ["loc", [null, [30, 12], [30, 65]]]]],
      locals: [],
      templates: [child0, child1, child2, child3, child4, child5, child6, child7, child8, child9]
    };
  })());
});
define('library-app/torii-providers/firebase', ['exports', 'emberfire/torii-providers/firebase'], function (exports, _emberfireToriiProvidersFirebase) {
  exports['default'] = _emberfireToriiProvidersFirebase['default'];
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('library-app/config/environment', ['ember'], function(Ember) {
  var prefix = 'library-app';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("library-app/app")["default"].create({"name":"library-app","version":"0.0.0+885064d4"});
}

/* jshint ignore:end */
//# sourceMappingURL=library-app.map