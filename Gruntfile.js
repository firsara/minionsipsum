module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bwr: grunt.file.readJSON('bower.json'),
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg', 'bwr'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['.'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin master',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    },
    clean: {
      dist: {
        src: ['dist']
      },
      bin: {
        src: ['bin']
      },
      tmp: {
        src: ['bin/tmp']
      }
    },
    copy: {
      app: {
        files: [
          {expand: false, src: ['src/dist.html'], dest: 'dist/index.html', filter: 'isFile'},
          {expand: false, src: ['bower_components/jquery/dist/jquery.js'], dest: 'dist/jquery.js', filter: 'isFile'},
          {expand: false, src: ['src/app.js'], dest: 'dist/app.js', filter: 'isFile'}
        ]
      },
      assets: {
        expand: true,
        src: ['**/*', '!**/*.scss', '!**/sass/**', '!**/stylesheets/**', '!**/config.rb'],
        dest: 'dist/public',
        cwd: 'src/public'
      }
    },
    nwjs: {
      options: {
        cacheDir: 'cache/nwjs',
        platforms: ['osx', 'linux', 'win'],
        buildDir: './bin',
        version: 'latest',
        macIcns: 'src/public/assets/icon.icns',
        macZip: false
      },
      build: ['dist/package.json', 'dist/**']
    },
    compress: {
      win64: {
        options: {
          archive: 'bin/tmp/<%= pkg.name %>.win.x64.zip'
        },
        files: [
          {src: ['**'], cwd: 'bin/<%= pkg.name %>/win64', dest: '.', expand: true}
        ]
      },
      linux64: {
        options: {
          archive: 'bin/tmp/<%= pkg.name %>.linux.x64.zip'
        },
        files: [
          {src: ['**'], cwd: 'bin/<%= pkg.name %>/linux64', dest: '.', expand: true}
        ]
      },
      osx64: {
        options: {
          archive: 'bin/tmp/<%= pkg.name %>.osx.x64.zip'
        },
        files: [
          {src: ['**'], cwd: 'bin/<%= pkg.name %>/osx64', dest: '.', expand: true}
        ]
      },
    },
    'ftp-deploy': {
      bin: {
        auth: {
          host: 'fabianirsara.com',
          port: 21,
          authKey: 'bin'
        },
        src: 'bin/tmp/',
        dest: '/bin/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ftp-deploy');
  grunt.loadNpmTasks('grunt-nw-builder');

  grunt.registerTask('copy-package', 'Exports package for nwjs into dist', function(){
    var pkg = grunt.file.readJSON('./package.json');
    pkg.devDependencies = {};
    pkg.debug = false;
    pkg.main = 'index.html';

    grunt.file.write('./dist/package.json', JSON.stringify(pkg));
  });

  grunt.registerTask('all', ['build', 'release', 'deploy']);
  grunt.registerTask('build', ['clean:dist', 'copy:app', 'copy:assets', 'copy-package']);
  grunt.registerTask('release', ['clean:bin', 'nwjs']);
  grunt.registerTask('deploy', ['clean:tmp', 'compress', 'ftp-deploy']);

  grunt.registerTask('default', ['all']);
};