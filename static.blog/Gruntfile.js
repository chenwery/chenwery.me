module.exports = function (grunt) {
  grunt.initConfig({
    copy: {
      css: {
        files: [
          {
            expand: true,
            cwd: 'css/',
            src: ['**'],
            dest: '<%= cssFolder %>/'},
        ]
      },
      js: {
        files: [
          {
            expand: true,
            cwd: 'js/sea-modules/',
            src: ['**'],
            dest: '<%= jsFolder %>/'},
        ]
      },
      img: {
        files: [
          {
            expand: true,
            cwd: 'img/',
            src: ['**'],
            dest: '<%= distFolder %>/img'},
        ]
      },
      fav: {
        files: {
          '<%= distFolder %>/favicon.ico': 'favicon.ico'
        }
      },
      lab: {
        files: [
          {
            expand: true,
            cwd: 'lab/',
            src: ['**'],
            dest: '<%= distFolder %>/lab'},
        ]
      },
      thirdparty: {
        files: [
          {
            expand: true,
            cwd: 'third-party/',
            src: ['**'],
            dest: '<%= distFolder %>/third-party'},
        ]
      }
    },
    cssjoin: {
      parseImport: {
        files: grunt.file.expandMapping(['csss/**/*.css'])
      }
    },
    clean: {
      cssdist: ['<%= distFolder %>']
    },
    distFolder: 'dist',
    cssFolder: 'dist/css',
    jsFolder: 'dist/js/sea-modules'
  });

  //console.log(grunt.file.expandMapping(['csss/**/*.css']));

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-cssjoin'); 

  grunt.registerTask('cl', ['clean']);
  grunt.registerTask('cp', ['copy']);
  grunt.registerTask('joincss', ['cssjoin']);
  //grunt.registerTask('default', ['clean', 'copy', 'cssjoin']);
};
