// Karma configuration
// Generated on Tue Jan 26 2016 20:36:33 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'browserify'],

    plugins: [  
      "karma-browserify",
      "karma-mocha",
      "karma-chai",
      "karma-sinon",
      "karma-chrome-launcher",
      "karma-phantomjs-launcher"
    ],

    // list of files / patterns to load in the browser
    files: [
      // angular source
      'front-end/libs/angular/angular.js',
      'front-end/libs/angular-route/angular-route.js',

      // our app code
      'front-end/**/*.js',

      // our spec files
      'node_modules/expect.js/index.js',
      'specs/client/routingSpec.js'
    ],


    // list of files to exclude
    exclude: [
      'front-end/libs/angular-animate/*.js',
      'front-end/libs/angular-aria/*.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'specs/client/routingSpec.js:': [ 'browserify']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome', 'PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false

  })
}
