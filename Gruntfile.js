module.exports = function(grunt) {

  // Load modules
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  // Configs
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      buildversion: {
        files: [{
          src: 'build/<%= pkg.name %>.js',
          dest: 'build/<%= pkg.name %>-<%= pkg.version %>.js'
        }, {
          src: 'build/<%= pkg.name %>.min.js',
          dest: 'build/<%= pkg.name %>-<%= pkg.version %>.min.js'
        }, ]
      },
      ghpages: {
        files: [{
          src: 'build/app.js',
          dest: 'gh-pages/'
        }, {
          expand: true,
          src: './bower.json',
          dest: 'gh-pages/'
        }, {
          src: 'index.html',
          dest: 'gh-pages/'
        }]
      },
    },

    clean: {
      build: ['build'],
      ghpages: ['gh-pages/build']
    },

    browserify: {
      build: {
        options: {
          transform: [
            ["babelify", {
              "stage": 0
            }]
          ]
        },
        files: {
          "build/app.js": "src/app.js"
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*'],
        tasks: ['browserify:build']
      }
    }

  });

  // Register tasks

  grunt.registerTask('build', [
    'clean:build',
    'browserify:build'
  ]);

  grunt.registerTask('gh-pages', [
    'clean:ghpages',
    'copy:ghpages'
  ]);

  grunt.registerTask('dev', ['build', 'watch:scripts']);

};