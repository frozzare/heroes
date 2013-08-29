module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        banner: '// <%= pkg.name %> v<%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %>\n',
      },
      dist: {
        src: ['<banner>', 'src/js/intro.js', 'src/js/main.js', 'src/js/outro.js'],
        dest: 'public/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      options: {
        banner: '// <%= pkg.name %> v<%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %>\n',
        report: 'gzip'
      },
      build: {
        src: ['public/js/vendor/*.js', 'public/js/<%= pkg.name %>.js'],
        dest: 'public/js/<%= pkg.name %>.min.js'
      }
    },

    eslint: {
      target: ['src/js/main.js']
    },

    watch: {
      tasks: ['concat'],
      files: ['src/js/*.js']
    },

    ejs: {
      all: {
        options: {
          production: true
        },
        cwd: 'views',
        src: ['*.html', '!partials/*.html'],
        dest: 'public/',
        expand: true,
        ext: '.html'
      }
    },

    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/css',
        src: ['*.css', '!*.min.css'],
        dest: 'public/css/',
        ext: '.min.css'
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "concat" task.
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Load the plugin that provides the "eslint" task.
  grunt.loadNpmTasks('grunt-eslint');

  // Load the plugin that provides the "watch" task
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Load the plugin that provides the "ejs" task.
  grunt.loadNpmTasks('grunt-ejs');

  // Load the plugin that provides the "cssmin" task.
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Our custom concat task.
  grunt.registerMultiTask('concat', 'Fix identation for files', function (config) {
    var src = ''
      , dest = this.data.dest
      , banner = this.options().banner
      , pkg = grunt.file.readJSON('package.json');

    src += banner;

    grunt.file.expand(this.data.src).forEach(function (file) {
      if (file.indexOf('intro') !== -1 || file.indexOf('outro') !== -1) {
        src += grunt.file.read(file) + '\n';
      } else {
        var lines = grunt.file.read(file).split('\n');
        lines.forEach(function (line) {
          src += '  ' + line + '\n';
        });
      }
      src = src.replace(/\{\{version\}\}/, pkg.version);
      grunt.file.write(dest, src);
    });

    grunt.log.writeln('File "' + dest + '" created.');
  });

  // Default task(s).
  grunt.registerTask('default', ['concat', 'uglify']);

};