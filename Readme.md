# metalsmith-only-build

> Build only a specific set of files from metalsmith.

The default behavior of metalsmith is to _always_ rebuild **everything**.
The main purpose of this plugin is to try and streamline builds as much as
possible during development. (particularly for `make` users)

Before metalsmith starts writing files, this plugin will delete every
reference from the `files` hash that is not specified to be built. This
causes Metalsmith to skip these files during the last phase of the build.
(this plugin should be **last** in order to prevent unwanted side-effects)

Most plugins assume that all files in the build will be available in memory,
so we _cannot_ safely reject files from the build at the outset. However, by
skipping the I/O required to write those files at the end, we can save some
build time, while also allowing `make` to be used properly.

This plugin goes to great lengths to _not_ change the default behavior of
Metalsmith unless it is very clear that is the intent of the dev.

 * `Metalsmith.clean` must be set to `false`
 * a `METALSMITH_OPEN` env var must be set (as a space-separated list of
   files to _only_ include)

## Configuration

```js
var only = require('metalsmith-only-build');

// make sure this plugin is **last**
metalsmith.use(only())
```

```json
{
  "plugins": {
    // make sure this plugin is **last**
    "metalsmith-only-build": true
  }
}
```

## Usage

```make
build/%.html: articles/%.html
  METALSMITH_ONLY="%<" metalsmith
```
