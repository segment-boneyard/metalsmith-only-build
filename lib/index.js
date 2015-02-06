
/**
 * Module dependencies.
 */

var debug = require('debug')('metalsmith-only');
var minimatch = require('minimatch');
var path = require('path');

/**
 * Build only a specific set of files from metalsmith.
 *
 * The main use-case is when you only want a specific subset of the build to
 * run. (particularly in makefiles or development)
 *
 * ## Requirements
 *
 *  - add this **last** in the plugins list
 *  - clean must be set to `false`
 *  - a `METALSMITH_OPEN` env var must be set (as a space-separated list of
 *    files to _only_ include)
 *
 * This will iterate the `files` object and `delete` the ones that don't match
 * the files listed in the `METALSMITH_OPEN` env var.
 *
 * By deleting these file refs, it will skip attempting to write them at the
 * end of the build. The reason this plugin should not be attached early is
 * because other plugins may rely on having every relevant file available in
 * memory. By skipping the write phase for these files, it should save time
 * during the build, (especially during development) while still maintaining
 * the context other plugins need.
 *
 * @param {Object} [options]
 * @returns {Function}
 */

module.exports = function (options) {
  debug('initializing');

  /**
   * Returns the plugin function.
   */

  return function (files, metalsmith, done) {
    var clean = metalsmith.clean();
    var dir = metalsmith.directory();
    var src = metalsmith.source();

    // extract the list of files from the specified ENV var.
    var only = list(process.env.METALSMITH_ONLY);

    debug('only write these files', only)

    // bail early if needed
    if (clean || !only || !only.length) {
      debug('bailing early');
      return done();
    }

    // create a filter fn
    var filter = include(only);

    // iterate the files object, deleting anything that is not part of the
    // "only" list.
    Object.keys(files).forEach(function (id) {
      var file = path.relative(dir, path.resolve(src, id));
      debug('checking', file);
      if (filter(file)) {
        debug('deleting', id);
        delete files[id];
      }
    });

    done();
  };
};

/**
 * Parses the env value for a list of files. (space-separated)
 *
 * @param {String} value
 * @returns {Array}
 */

function list(value) {
  if (!value) return null;
  var arr = value.trim().split(/\s+/g);
  if (!arr.length) return null;
  return arr;
}

/**
 * Helper for checking if a file is on the list.
 *
 * @param {String} only
 * @returns {Function}
 */

function include(only) {
  return function include(file) {
    return !only.some(function (o) {
      return minimatch(file, o);
    });
  };
}
