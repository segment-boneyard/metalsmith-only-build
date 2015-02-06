var assert = require('assert');
var dirEqual = require('assert-dir-equal');
var glob = require('glob').sync;
var Metalsmith = require('metalsmith');
var only = require('..');
var path = require('path');
var rm = require('rimraf').sync;

var fixture = path.resolve.bind(path, __dirname, 'fixtures');


describe('only([options])', function () {
  beforeEach(function () {
    delete process.env.METALSMITH_ONLY;
  });

  before(function () {
    clean();
  });

  after(function () {
    clean();
  });

  it('should only build the correct files', function (done) {
    process.env.METALSMITH_ONLY = 'src/index.md';

    Metalsmith(fixture('basic'))
      .clean(false)
      .use(only())
      .build(function (err, files) {
        if (err) return done(err);
        var actual = Object.keys(files).sort();
        assert.deepEqual(actual, [ 'index.md' ]);
        equal('basic');
        clean('basic');
        done();
      });
  });

  it('should process a list of files', function (done) {
    process.env.METALSMITH_ONLY = 'src/a.md src/b.md src/c.md';

    Metalsmith(fixture('many'))
      .clean(false)
      .use(only())
      .build(function (err, files) {
        if (err) return done(err);
        equal('many');
        clean('many');
        done();
      });
  });

  it('should process globs', function (done) {
    process.env.METALSMITH_ONLY = 'src/*.md';

    Metalsmith(fixture('glob'))
      .clean(false)
      .use(only())
      .build(function (err, files) {
        if (err) return done(err);
        equal('glob');
        clean('glob');
        done();
      });
  });
});

function equal(id) {
  var actual = fixture(id, 'build');
  var expected = fixture(id, 'expected');
  dirEqual(actual, expected);
}

function clean(id) {
  if (id) return rm(fixture(id, 'build'));

  glob(fixture('*/build')).forEach(function (dir) {
    rm(dir);
  });
}
