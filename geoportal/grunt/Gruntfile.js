var prefixJS = '../WebContent/scripts/';
var geoportalJSSources = [
	'Services.js',
	'sorting_utils.js',
	'dragging_utils.js',
	'validate/Validate.js',
	'jqueryFilter/AjaxPrefilter.js',
	'styles/StyleManager.js',
	'DialogUtils.js',
	'utils/Utils.js',
	'utils/CollapseExpandPanelUtils.js',
	'LoadingPanel.js',
	'user/UserPermission.js',
	'layerConfig/LayerConfigCatalog.js',
	'layerConfig/LayerConfig.js',
	'layerInfoDialog/LayerInfoDialog.js',
	'layerMenu/TreeMenu.js',
	'layerMenu/LayerMenuUtils.js',
	'layerMenu/LayerMenu.js',
	'capabilities/getCapabilities.js',
	'capabilities/CapabilitiesUtils.js',
	'describeFeature/describeFeature.js',
	'describeFeature/DescribeFeatureParser.js',
	'getFeatures/getFeatures.js',
	'featureGridPanel/FeatureGridPanel.js',
	'search/searchPanel.js',
	'search/SearchResultPanel.js',
	'search/SearchFilterHelper.js',
	'search/Search.js',
	'capabilities/WMSDialog.js',
	'capabilities/AddWMSDialog.js',
	'legend/LegendGraphics.js',
	'map_controls/controls.js',
	'advancedPanel/AdvancedPanel.js',
	'menuButtons/MenuButtons.js',
	'redlining/redlines.js',
	'comments/comments.js',
	'alerts/AlertDownloadFilterHelper.js',
	'alerts/alerts.js',
	'alerts/SimpleAlertInsertForm.js',
	'alerts/SimpleAlertDetailForm.js',
	'measure/measure.js',
	'print/Print_Configuration.js',
	'print/print.js',
	'coordinates/coordinates.js',
	'gisOverview/gisOverview.js',
	'kmlUploader/kmlupload.js',
	'kmlUploader/KmlUploader.js',
	'catalog/catalogCsw.js',
	'featureInfo/featureInfoResults.js',
	'AlertDialog.js',
	'layers/CreateLayer.js',
	'layers/LoadLayersUtils.js',
	'custom.js',
	'print/MapfishPrint.js',
	'geonetwork/webgisGeonetwork.js',
	'cswClient/CswRecord.js',
	'cswClient/CswClient.js',
	'dataDownloader/DataDownloader.js'
]; 

var prefixCSS = '../WebContent/css/';
var geoportalCSSSources = [
	'openLayersOverride.css',
	'globals.css',
	'layout.css',
	'alertsLayout.css',
	'menuLayout.css',
	'searchResultPanel.css',
	'catalog.css',
	'featureGridPanel.css',
	'legendLayout.css',
	'WMSDialog.css',
	'layerInfoTemplate.css'
]; 

for(var j=0; j<geoportalJSSources.length; j++) {
	geoportalJSSources[j] = prefixJS + geoportalJSSources[j];
}

for(var j=0; j<geoportalCSSSources.length; j++) {
	geoportalCSSSources[j] = prefixCSS + geoportalCSSSources[j];
}

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
    	// define a string to put between each file in the concatenated output
    	//default is grunt.util.linefeed
        //separator: ';'
      },
      dist: {
        src: geoportalJSSources,
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    minified : {
	  files: {
	    src: [
	          'dist/<%= pkg.name %>.js'
//		    '/js/src/**/*.js',
//		    '/js/src/*.js'
	    ],
	    dest: 'dist/min/'
	  },
	  options : {
	    sourcemap: false,
	    allinone: false
	  }
    },
    concat_css: {
    	options: {
	      // Task-specific options go here. 
	    },
	    all: {
	      src: geoportalCSSSources,
	      dest: "dist//<%= pkg.name %>_styles.css"
	    },
	},
    rename: {
        moveThis: {
            src: 'dist/min/<%= pkg.name %>.js',
            dest: 'dist/<%= pkg.name %>_min.js'
        }
    }
  /*
   * This minifies the JS
   */
//    uglify: {
//      options: {
//        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
//      },
//      dist: {
//        files: {
//          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
//        }
//      }
//    },
//    qunit: {
//      files: ['test/**/*.html']
//    },
//    jshint: {
//      files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
//      options: {
//        // options here to override JSHint defaults
//        globals: {
//          jQuery: true,
//          console: true,
//          module: true,
//          document: true
//        }
//      }
//    },
//    watch: {
//      files: ['<%= jshint.files %>'],
//      tasks: ['jshint', 'qunit']
//    }
  });

  /*
   * we have to load in the Grunt plugins we need. These should have all been installed through npm.
   */
  //grunt.loadNpmTasks('grunt-contrib-uglify');
  //grunt.loadNpmTasks('grunt-contrib-jshint');
  //grunt.loadNpmTasks('grunt-contrib-qunit');
  //grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-minified');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-concat-css');

  //this would be run by typing "grunt test" on the command line
  grunt.registerTask('test', ['jshint', 'qunit']);

  //the default task can be run just by typing "grunt" on the command lin
  grunt.registerTask('default', ['concat', 'minified', 'rename', 'concat_css']);
};