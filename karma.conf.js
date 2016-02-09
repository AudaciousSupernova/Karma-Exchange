// <h3>Karma Configuration</h3>
// Generated on Tue Jan 26 2016 20:36:33 GMT-0800 (PST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon'],

    // plugins: [  
    //   "karma-browserify",
    //   "karma-mocha",
    //   "karma-chai",
    //   "karma-sinon",
    //   "karma-chrome-launcher",
    //   "karma-phantomjs-launcher"
    // ],

    // list of files / patterns to load in the browser
    files: [
      // angular source
      'front-end/libs/angular/angular.js',
      'front-end/libs/angular-route/angular-route.js',
      'front-end/libs/angular-mocks/angular-mocks.js',
      'front-end/libs/angular-ui-router/release/angular-ui-router.js',
      'front-end/libs/angular-material/angular-material.js',
      'front-end/libs/angular-animate/angular-animate.js',
      'front-end/libs/angular-aria/angular-aria.js',
      'front-end/libs/Chart.js/Chart.min.js',
      'front-end/libs/angular-chart.js/angular-chart.js',
      'front-end/libs/angular-messages/angular-messages.js',


      // our app code
      'front-end/app/**/*.js',

      // our spec files
      'specs/client/routingSpec.js',
      'specs/client/servicesSpec.js'
    ],

    // list of files to exclude
    // exclude: [
    //   'front-end/libs/angular-animate/*.js',
    //   'front-end/libs/angular-aria/*.js',
    //   'front-end/libs/angular-material',
    //   'front-end/libs/angular-messages/*.js',
    //   'front-end/libs/angular-ui-router/*.js'
    // ],

    // test results reporter to use
    reporters: ['nyan','unicorn'],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // preprocessors: {
    //   'specs/client/routingSpec.js:': [ 'browserify']
    // },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter

    // web server port
    // port: 9876,

    // enable / disable colors in the output (reporters and logs)
    // colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    // logLevel: config.LOG_INFO,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true

  });
};
