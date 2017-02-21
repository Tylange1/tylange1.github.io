'use strict';

/**
 * @ngdoc overview
 * @name powerHouseApp
 * @description
 * # powerHouseApp
 *
 * Main module of the application.
 */
angular
  .module('powerHouseApp', [
    'ngMaterial',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'LocalStorageModule',
    'material.components.expansionPanels'
  ])
  .config(["$routeProvider", "localStorageServiceProvider", "$mdThemingProvider", function ($routeProvider, localStorageServiceProvider, $mdThemingProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/dashboard.html',
        controller: 'dashboardCtrl',
        controllerAs: 'dashboard'
      })
      .when('/program-list', {
        templateUrl: 'views/programList.html',
        controller: 'programListCtrl',
        controllerAs: 'programList'
      })
      .when('/add-program', {
        templateUrl: 'views/addProgram.html',
        controller: 'addProgramCtrl',
        controllerAs: 'addProgram'
      })
      .when('/add-program-type', {
        templateUrl: 'views/addProgramType.html',
        controller: 'addProgramTypeCtrl',
        controllerAs: 'addProgramType'
      })
      .when('/program-type-list', {
        templateUrl: 'views/programTypeList.html',
        controller: 'ProgramTypeListCtrl',
        controllerAs: 'programTypeList'
      })
      .when('/program-type-information/:id', {
        templateUrl: 'views/programTypeInformation.html',
        controller: 'ProgramTypeInformationCtrl',
        controllerAs: 'programTypeInformation'
      })
      .when('/program-information/:id', {
        templateUrl: 'views/programInformation.html',
        controller: 'ProgramInformationCtrl',
        controllerAs: 'programInformation'
      })
      .when('/edit-program/:id', {
        templateUrl: 'views/editProgram.html',
        controller: 'EditProgramCtrl',
        controllerAs: 'editProgram'
      })
      .when('/edit-program-type/:id', {
        templateUrl: 'views/editProgramType.html',
        controller: 'EditProgramTypeCtrl',
        controllerAs: 'editProgramType'
      })
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'settings'
      })
      .when('/info', {
        templateUrl: 'views/info.html',
        controller: 'InfoCtrl',
        controllerAs: 'info'
      })
      .when('/upgrade', {
        templateUrl: 'views/upgrade.html',
        controller: 'UpgradeCtrl',
        controllerAs: 'upgrade'
      })
      .when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl',
        controllerAs: 'contact'
      })
      .when('/help', {
        templateUrl: 'views/help.html',
        controller: 'HelpCtrl',
        controllerAs: 'help'
      })
      .when('/one-rep-max-calculator', {
        templateUrl: 'views/oneRepMaxCalculator.html',
        controller: 'OneRepMaxCalculatorCtrl',
        controllerAs: 'oneRepMaxCalculator'
      })
      .otherwise({
        redirectTo: '/'
      });

      localStorageServiceProvider.setPrefix('PowerHouse');

      $mdThemingProvider.theme('default')
        .primaryPalette('blue-grey')
        .accentPalette('deep-orange');
  }]);
'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:NavigationBar
 * @description
 * # NavigationBar
 */
angular.module('powerHouseApp')
  .directive('navigationBar', ['navigationBarService', function (navigationBarService) {
    return {
      templateUrl: 'scripts/directives/navigationBar/navigationBarView.html',
      restrict: 'E',
      link: function postLink(scope) {

        scope.sideMenuItems = navigationBarService.sideMenuItems;        

        scope.toggleSidenav = function(){
          navigationBarService.toggleSidenav();
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:DashboardCtrl
 * @description
 * # DashboardCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('dashboardCtrl', ['$scope', 'dashboardService', function ($scope, dashboardService) {

    // Completed Program Data
    $scope.completedHeaderText = dashboardService.completedHeaderText;
    $scope.completedHighlightText = dashboardService.completedHighlightText;
    $scope.completedHighlightColor = dashboardService.completedHighlightColor;
    $scope.completeSubheadText = dashboardService.completeSubheadText;
    
    // Active Program Data
    $scope.activeHeaderText = dashboardService.activeHeaderText;
    $scope.activeHighlightText = dashboardService.activeHighlightText;
    $scope.activeHighlightColor = dashboardService.activeHighlightColor;
    $scope.activeSubheadText = dashboardService.activeSubheadText;

    // Quick Complete
    $scope.quickCompleteProgram = dashboardService.getQuickCompleteProgram();

    // Program List
    $scope.programs = dashboardService.getActivePrograms(); 

    $scope.$watchCollection(function(){
      return dashboardService.getCompletedPrograms();
    }, function(){
      $scope.completedHighlightText = dashboardService.completedHighlightText;
    });

    $scope.$watchCollection(function(){
      return dashboardService.getActivePrograms();
    }, function(newValue, oldValue){
      $scope.activeHighlightText = dashboardService.activeHighlightText;
      if(newValue !== oldValue){
        $scope.programs = dashboardService.getActivePrograms();
      }
    });

    $scope.$watch(function(){
      return dashboardService.getQuickCompleteProgram();
    }, function(){
      $scope.quickCompleteProgram = dashboardService.getQuickCompleteProgram();
    }, true);
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ProgramlistCtrl
 * @description
 * # ProgramlistCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('programListCtrl', ['$scope', '$filter', 'programService', 'programListService', function ($scope, $filter, programService, programListService) {

    var updatePrograms = function(){
      $scope.originalPrograms = programService.getPrograms();
      $scope.filteredPrograms = $scope.originalPrograms;
      $scope.programs = $scope.originalPrograms;
    };

    // Empty list
    $scope.emptyListMessage = 'Start by adding a program';
    $scope.emptyListButtonText = 'Add Program';
    $scope.emptyListButtonLink = '#/add-program';

    $scope.filterProperty = 'name';

    $scope.orderValues = programListService.getOrderValues();
    $scope.orderKey = programListService.orderKey;
    $scope.reverseKey = programListService.reverseKey;

    $scope.$watchCollection(function(){
      return programService.getPrograms();
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        updatePrograms();
      }
    });
    
    updatePrograms();
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:AddprogramCtrl
 * @description
 * # AddprogramCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('addProgramCtrl', ['$scope', '$location', 'addProgramService', function ($scope, $location, addProgramService) {
        $scope.programName = '';
        $scope.programType = '';
        $scope.increment = '';
        $scope.exercises = [];

        $scope.addFunction = function(programName, programType, increment, exercises){
          addProgramService.addProgram(programName, programType, increment, exercises);
          $location.path('program-list');
        };

        $scope.removeFunction = function(){
          $scope.programName = '';
          $scope.programType = '';
          $scope.increment = '';
          $scope.exercises = [];
        };

        $scope.invalidFunction = function(programName, programType, increment, exercises){
          return addProgramService.invalid(programName, programType, increment, exercises);
        };

        $scope.$watch(function(){
          return $scope.programType;
        },
        function(newValue, oldValue){
          if(newValue !== oldValue && newValue !== ''){
            $scope.exercises = addProgramService.getExercises($scope.programType);
          }
        });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:AddprogramtypeCtrl
 * @description
 * # AddprogramtypeCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('addProgramTypeCtrl', ['$scope', '$location', 'addProgramTypeService', 'toastService', 'programTypeLevelService', function ($scope, $location, addProgramTypeService, toastService, programTypeLevelService) {

    $scope.programTypeName = '';
    $scope.level = programTypeLevelService.getDefault();
    $scope.description = '';
    $scope.exercises = [];
    $scope.weeks = [];

    $scope.addFunction = function(programTypeName, level, description, exercises, weeks){
      addProgramTypeService.addProgramType(programTypeName, level, description, exercises, weeks);
      $location.path('program-type-list');
    };

    $scope.removeFunction = function(){
      var tempProgramTypeName = angular.copy($scope.programTypeName);
      var tempProgramLevel = angular.copy($scope.level);
      var tempProgramDescription = angular.copy($scope.description);
      var tempExercises = angular.copy($scope.exercises);
      var tempWeeks = angular.copy($scope.weeks);
      toastService.showUndoToast('Program type removed', function(){
        $scope.programTypeName = tempProgramTypeName;
        $scope.level = tempProgramLevel;
        $scope.description = tempProgramDescription;
        $scope.exercises = tempExercises;
        $scope.weeks = tempWeeks;
      });

      $scope.programTypeName = '';
      $scope.level = programTypeLevelService.getDefault();
      $scope.description = '';
      $scope.exercises = [];
      $scope.weeks = [];
    };

    $scope.invalidFunction = function(programName, level, description, exercises, weeks){
      return addProgramTypeService.isInvalid(programName, level, description, exercises, weeks);
    };

    $scope.$watchCollection(function(){
      return $scope.exercises;
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        addProgramTypeService.exercises = newValue;
      }
    });
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ProgramtypelistCtrl
 * @description
 * # ProgramtypelistCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ProgramTypeListCtrl', ['$scope', '$filter', 'programTypeService', 'programTypeListService', function ($scope, $filter, programTypeService, programTypeListService) {

    var updateProgramTypes = function(){
      $scope.originalProgramTypes = programTypeService.getProgramTypes();
      $scope.filteredProgramTypes = $scope.originalProgramTypes;
      $scope.programTypes = $scope.originalProgramTypes;
    };

    // Empty list
    $scope.emptyListMessage = 'Start by adding a program type';
    $scope.emptyListButtonText = 'Add Program Type';
    $scope.emptyListButtonLink = '#/add-program-type';

    $scope.filterProperty = 'programTypeName';

    $scope.orderValues = programTypeListService.getOrderValues();
    $scope.orderKey = programTypeListService.orderKey;
    $scope.reverseKey = programTypeListService.reverseKey;

    $scope.$watchCollection(function(){
      return programTypeService.getProgramTypes();
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        updateProgramTypes();
      }
    });

    updateProgramTypes();
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeService
 * @description
 * # addProgramTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeService', ['utilService', 'programTypeService', 'exerciseTypeService', function (utilService, programTypeService, exerciseTypeService) {
    
    var contract = {
      exercises: [],
      weeks: [],
      previousWeeks: []
    };
    
    contract.addProgramType = function(programTypeName, level, description, exercises, weeks){
      programTypeService.addProgramType(programTypeName, level, description, exercises, weeks);
    } ;

    contract.isInvalid = function(programName, level, description, exercises, weeks){
      return (isNameInvalid(programName) || isLevelInvalid(level) || isDescriptionInvalid(description) || isExerciseInvalid(exercises) || isWeeksInvalid(weeks));
    };

    contract.exerciseRemoved = function(exercises, weeks){
      var rWeeks = weeks;
      contract.previousWeeks = angular.copy(weeks);

      var updatedWeeks = [];
      rWeeks.forEach(function(week){
        var updatedDays = updateDays(exercises, week);
        if(updatedDays.length > 0){
          updatedWeeks.push(week);
        }
      });

      return updatedWeeks;
    };

    var updateDays = function(exercises, week){
      var updatedDays = [];

      week.days.forEach(function(day){
        var updatedSets = updateSets(exercises, day);
        if(updatedSets.length > 0){
          updatedDays.push(day);
        }
      });

      return updatedDays;
    };

    var updateSets = function(exercises, day){
      var updatedSets = [];

      day.sets.forEach(function(set){
        var updatedSetExercises = updateSetExercises(exercises, set);
        if(updatedSetExercises.length > 0){
          updatedSets.push(set);
        }
      });

      return updatedSets;
    };

    var updateSetExercises = function(exercises, set){
      var updatedSetExercises = [];

      set.exercises.forEach(function(setExercise){
        if(exerciseTypeService.containsExercise(exercises, setExercise.exercise) === true){
          updatedSetExercises.push(setExercise);
        }
      });

      return updatedSetExercises;
    };

    contract.exerciseRemoveUndone = function(){
      contract.weeks = contract.previousWeeks;
    };

    var isNameInvalid = function(programName){
      return (utilService.isUndefined(programName) || programName === '' || programTypeService.nameTaken(programName));
    };

    var isLevelInvalid = function(level){
      return utilService.isUndefined(level);
    };

    var isDescriptionInvalid = function(description){
      return utilService.isUndefined(description);
    };

    var isExerciseInvalid = function(exercises){
      return (utilService.isUndefined(exercises) || exercises.length <= 0);
    };

    var isWeeksInvalid = function(weeks){
      return (utilService.isUndefined(weeks) || weeks.length <= 0);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeService
 * @description
 * # programTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeService', ['utilService', 'storageService', 'keyHandlerService', 'toastService', 'defaultProgramTypeService', 
  function (utilService, storageService, keyHandlerService, toastService, defaultProgramTypeService) {
    
    var contract = {
      programTypes: []
    };

    var init = function(){
      contract.programTypes = defaultProgramTypeService.getDefaultProgramTypes().concat(getProgramTypesFromStorage());
    };

    contract.reset = function(){
      contract.programTypes = defaultProgramTypeService.getDefaultProgramTypes();
      storeProgramTypes();
    };

    contract.addProgramType = function(programTypeName, level, description, exercises, weeks){
      var programType = generateProgramType(programTypeName, level, description, exercises, weeks);
      contract.programTypes.push(programType);
      console.log(angular.toJson(programType));
      storeProgramTypes();
    };

    contract.removeProgramType = function(programType){
      var tempProgramTypes = angular.copy(contract.programTypes);
      
      toastService.showUndoToast('Program type removed', function(){
        contract.programTypes = tempProgramTypes;  
        storeProgramTypes();
      });

      contract.programTypes = utilService.removeFromArray(contract.programTypes, programType);
      removeProgramType(programType);
    };

    contract.getProgramTypes = function(){
      return contract.programTypes;
    };

    contract.nameTaken = function(programTypeName){
      for(var i = 0; i < contract.programTypes.length; i++){
        if(utilService.isDefined(contract.programTypes[i].programTypeName) && contract.programTypes[i].programTypeName === programTypeName){
          return true;
        }
      }
      return false;
    };

    contract.getProgramType = function(id){
      return contract.programTypes.find(function(programType){
        if(programType.id === parseInt(id)){
          return programType;
        }
      });
    };

    contract.containsProgramType = function(programTypes, programType){
      return (programTypes.findIndex(function(pType){
        return pType.id === programType.id;
      }) !== -1);
    };

    contract.validProgramType = function(programType){
      return (utilService.isDefined(programType) && utilService.isDefined(programType.id) && 
      utilService.isDefined(programType.totalNumberOfSets) && utilService.isDefined(programType.programTypeName) && 
      utilService.isDefined(programType.exercises) && utilService.isDefined(programType.weeks));
    };
    
    var removeProgramType = function(programType){
      contract.programTypes = utilService.removeFromArray(contract.programTypes, programType);
      storeProgramTypes();
    };

    var storeProgramTypes = function(){
      storageService.storeValue(keyHandlerService.keys.programType, getNonDefaultProgramTypes(contract.programTypes));
    };

    var getNonDefaultProgramTypes = function(programTypes){
      return programTypes.filter(function(programType){
        return (utilService.isUndefined(programType.default) || programType.default === false);
      });
    };

    var getProgramTypesFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.programType, []);
    };

    var generateProgramType = function(programTypeName, level, description, exercises, weeks){
      return {
        id: utilService.getUniqueId(contract.programTypes),
        description: description,
        level: level,
        totalNumberOfSets: calculateNumberOfSets(weeks),
        programTypeName: programTypeName,
        exercises: exercises,
        weeks: weeks,
        default: false
      };
    };

    var calculateNumberOfSets = function(weeks){
      var totalSets = 0;

      weeks.forEach(function(week){
        week.days.forEach(function(day){
          day.sets.forEach(function(set){
            if(utilService.isDefined(set.numberOfSets) && utilService.isNumber(set.numberOfSets)){
              totalSets += set.numberOfSets;
            }
          });
        });
      });

      return totalSets;
    };

    init();
    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.exerciseTypeService
 * @description
 * # exerciseTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('exerciseTypeService', ['utilService', function (utilService) {
    
    var contract = {};
    
    var exerciseTypes = [
      { id: 0, name: 'Weighted' },
      { id: 1, name: 'Non-weighted' },
      { id: 2, name: 'Cardio' }
    ];

    contract.getExerciseTypes = function(){
      return exerciseTypes;
    };

    contract.getExerciseTypeById = function(id){
      if(utilService.isNumber(id)){
        var fId = utilService.getNumber(id);
        return exerciseTypes.find(function(exerciseType){
          return exerciseType.id === fId;
        });
      }
    };

    contract.getExerciseTypeByName = function(name){
      return exerciseTypes.find(function(exerciseType){
        return exerciseType.name.toLowerCase() === name.toString().toLowerCase();
      });
    };

    contract.exercisesSame = function(exerciseOne, exerciseTwo){
      return (exerciseOne.id === exerciseTwo.id && exerciseOne.name === exerciseTwo.name && exerciseOne.exerciseType.id === exerciseTwo.exerciseType.id);
    };

    contract.containsExercise = function(exercises, exercise){
      for(var i = 0; i < exercises.length; i++){
        if(exercises[i].id === exercise.id){
          return true;
        }
      }
      return false;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.utilService
 * @description
 * # utilService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('utilService', function () {
      var contract = {};

      contract.isDefined = function(value){
        return (angular.isDefined(value) && value !== null);
      };

      contract.isUndefined = function(value){
        return !contract.isDefined(value);
      };

      contract.isNumber = function(value){
        // Ensure our value is defined
        if(contract.isUndefined(value)){
          return false;
        }
        return !isNaN(value);
      };

      contract.getNumber = function(value){
        if(!contract.isNumber(value)){
          return -1;
        }
        return parseFloat(value);
      };

      contract.getUniqueId = function(values){
        var id = 0;
        values.map(function(value){
          // Check if the value is >= to the current highest id
          if(value.hasOwnProperty('id') && value.id >= id){
            id = (value.id + 1);
          }
        });
        return id;
      };

      contract.removeFromArray = function(array, value){
        // Find index
        var index = array.indexOf(value);

        if(index !== -1){
          array.splice(index, 1);
        }
        return array;
      };

      contract.round = function(number, dp, increments){
        return (Math.round(((contract.getNumber(number)) / contract.getNumber(increments))) * contract.getNumber(increments)).toFixed(contract.getNumber(dp));
      };

      contract.getValueOrDefault = function(value, dValue){
        if(contract.isUndefined(value)){
          return dValue;
        }
        return value;
      };

      return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addRemove
 * @description
 * # addRemove
 */
angular.module('powerHouseApp')
  .directive('addRemove', function () {
    return {
      templateUrl: 'scripts/directives/addRemove/addRemoveView.html',
      restrict: 'E',
      scope: {
        addFunction: '&',
        removeFunction: '&',
        invalidFunction: '&',
        name: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramType
 * @description
 * # addProgramType
 */
angular.module('powerHouseApp')
  .directive('addProgramType', ['addProgramTypeService', function (addProgramTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/addProgramTypeView.html',
      restrict: 'E',
      scope: {
        programTypeName: '=',
        description: '=',
        level: '=',
        exercises: '=',
        weeks: '=',
        addFunction: '=',
        removeFunction: '=',
        invalidFunction: '='
      },
      link: function postLink(scope) {

        addProgramTypeService.weeks = scope.weeks;
        addProgramTypeService.exercises = scope.exercises;

        scope.$watchCollection(function(){
          return scope.exercises;
        }, function(newValue, oldValue){
          addProgramTypeService.exercises = scope.exercises;
          // Exercise removed
          if(newValue.length < oldValue.length){
            addProgramTypeService.weeks = addProgramTypeService.exerciseRemoved(scope.exercises, scope.weeks);
          }
        });

        scope.$watchCollection(function(){
          return addProgramTypeService.weeks;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.weeks = newValue;
          }
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeName
 * @description
 * # addProgramTypeName
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeHeader', ['addProgramTypeHeaderService', function (addProgramTypeNameService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/header/addProgramTypeHeaderView.html',
      restrict: 'E',
      scope: {
        programTypeName: '=',
        level: '=',
        description: '='
      },
      link: function postLink(scope) {
        scope.helpAddProgramTypeUrl = addProgramTypeNameService.helpAddProgramTypeUrl;

        scope.levels = addProgramTypeNameService.getLevels();

        scope.$watch(function(){
          return scope.programTypeName;
        }, function(newValue, oldValue){
          if(newValue !== oldValue && scope.programTypeName === ''){
            scope.programTypeDetailsForm.$setUntouched();
          }
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeNameService
 * @description
 * # addProgramTypeNameService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeHeaderService', ['programTypeLevelService', function (programTypeLevelService) {
    var contract = {
      helpAddProgramTypeUrl: 'scripts/directives/addProgramType/help/helpAddProgramTypeTemplate.html'
    };

    contract.getLevels = function(){
      return programTypeLevelService.getLevels();
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeExercise
 * @description
 * # addProgramTypeExercise
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeExercise', ['addProgramTypeExerciseService', 'exerciseTypeService', function (addProgramTypeExerciseService, exerciseTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/exercise/addProgramTypeExerciseView.html',
      restrict: 'E',
      scope: {
        programTypeExercises: '='
      },
      link: function postLink(scope) {

        scope.helpAddProgramTypeExerciseTypeUrl = addProgramTypeExerciseService.helpAddProgramTypeExerciseTypeUrl;

        scope.exerciseTypes = exerciseTypeService.getExerciseTypes();

        // Options
        scope.remove = addProgramTypeExerciseService.remove;
        scope.edit = addProgramTypeExerciseService.edit;

        scope.$watchCollection(function(){
          return addProgramTypeExerciseService.exercises;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeExercises = addProgramTypeExerciseService.exercises;
          }
        });

        scope.addExercise = function(){
          scope.programTypeExercises = addProgramTypeExerciseService.addExercise(scope.programTypeExercises);
        };

        scope.confirmExercise = function(exercise){
          exercise.confirmed = true;
        };

        scope.removeExercise = function(exercise){
          scope.programTypeExercises = addProgramTypeExerciseService.removeExercise(scope.programTypeExercises, exercise);
        };

        scope.editExercise = function(exercise){
          exercise.confirmed = false;
        };

        scope.isInvalid = function(exercise){
          return addProgramTypeExerciseService.isInvalid(scope.programTypeExercises, exercise);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeExerciseService.hasConfirmed(scope.programTypeExercises);
        };

      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeExerciseService
 * @description
 * # addProgramTypeExerciseService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeExerciseService', ['utilService', 'toastService', 'addProgramTypeService', function (utilService, toastService, addProgramTypeService) {
    
    var contract = {
      helpAddProgramTypeExerciseTypeUrl: 'scripts/directives/addProgramType/help/helpAddProgramTypeExerciseTypeTemplate.html',
      exercises: [],
      remove: true,
      removeFunction: function(exercise){

      },
      edit: true,
      editFunction: function(exercise){

      }
    };

    contract.addExercise = function(exercisesArray){
      exercisesArray.push(generateExercise(utilService.getUniqueId(exercisesArray)));
      return exercisesArray;
    };

    contract.removeExercise = function(exercisesArray, exercise){
      var tempExercisesArray = angular.copy(exercisesArray);
      toastService.showUndoToast('Exercise removed', function(){
        contract.exercises = tempExercisesArray;
        addProgramTypeService.exerciseRemoveUndone();
      });

      return utilService.removeFromArray(exercisesArray, exercise);
    };

    contract.isInvalid = function(exerciseArray, exercise){
      // Check that the name is not already taken
      // Check that an exercise type is selected
      return (exerciseTypeInvalid(exercise) || exerciseNameInvalid(exerciseArray, exercise));
    };

    contract.hasConfirmed = function(exerciseArray){
      for(var i = 0; i < exerciseArray.length; i++){
        if(exerciseArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    var exerciseTypeInvalid = function(exercise){
      return (utilService.isUndefined(exercise.exerciseType) || exercise.exerciseType === {} || 
        !exercise.exerciseType.hasOwnProperty('id') || !exercise.exerciseType.hasOwnProperty('name'));
    };

    var exerciseNameInvalid = function(exerciseArray, exercise){
      if(utilService.isUndefined(exercise.name) || exercise.name === ''){
        return true;
      }

      for(var i = 0; i < exerciseArray.length; i++){
        if(exercise.name === exerciseArray[i].name && exercise.id !== exerciseArray[i].id){
          return true;
        }
      }

      return false;
    };

    var generateExercise = function(id){
      return {
        id: id,
        name: '',
        exerciseType: {},
        description: '',
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeWeek
 * @description
 * # addProgramTypeWeek
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeWeek', ['addProgramTypeWeekService', function (addProgramTypeWeekService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/week/addProgramTypeWeekView.html',
      restrict: 'E',
      scope: {
        programTypeWeeks: '=',
      },
      link: function postLink(scope) {

        scope.remove = addProgramTypeWeekService.remove;
        scope.edit = addProgramTypeWeekService.edit;
        scope.duplicate = addProgramTypeWeekService.duplicate;
        scope.move = addProgramTypeWeekService.move;

        scope.$watchCollection(function(){
          return addProgramTypeWeekService.weeks;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeWeeks = addProgramTypeWeekService.weeks;
          }
        });

        scope.addWeek = function(){
          scope.programTypeWeeks = addProgramTypeWeekService.addWeek(scope.programTypeWeeks);
        };

        scope.editWeek = function(week){
          week.confirmed = false;
        };

        scope.confirmWeek = function(week){
          week.confirmed = true;
        };

        scope.removeWeek = function(week){
          scope.programTypeWeeks = addProgramTypeWeekService.removeWeek(scope.programTypeWeeks, week);
        };

        scope.duplicateWeek = function(week){
          scope.programTypeWeeks = addProgramTypeWeekService.duplicateWeek(scope.programTypeWeeks, week);
        };

        scope.moveWeek = function(week, direction){
          scope.programTypeWeeks = addProgramTypeWeekService.moveWeek(scope.programTypeWeeks, week, direction);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeWeekService.hasConfirmed(scope.programTypeWeeks);
        };

        scope.isInvalid = function(week){
          return addProgramTypeWeekService.isInvalid(scope.programTypeWeeks, week);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeWeekService
 * @description
 * # addProgramTypeWeekService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeWeekService', ['utilService', 'toastService', function (utilService, toastService) {
    var contract = {
      remove: true,
      edit: true,
      duplicate: true,
      move: true,
      weeks: []
    };

    contract.addWeek = function(weekArray){
      weekArray.push(generateWeek(utilService.getUniqueId(weekArray)));
      return weekArray;
    };

    contract.removeWeek = function(weeksArray, week){
      var tempWeeksArray = angular.copy(weeksArray);
      toastService.showUndoToast('Week removed', function(){
        contract.weeks = tempWeeksArray;
      });

      return utilService.removeFromArray(weeksArray, week);
    };

    contract.duplicateWeek = function(weekArray, week){
      var newWeek = angular.copy(week);
      newWeek.id = utilService.getUniqueId(weekArray);
      newWeek.name = newWeek.name + ' ' + newWeek.id;
      weekArray.push(newWeek);
      return weekArray;
    };

    contract.moveWeek = function(weekArray, week, direction){
      var moveFunctions = {
        up: function(rArray, week, index){
          if(index !== -1 && index !== 0){
            rArray[index] = rArray[index - 1];
            rArray[index - 1] = week;
          }
          return rArray;
        },
        down: function(rArray, week, index){
          if(index !== -1 && index !== (rArray.length - 1)){
            rArray[index] = rArray[index + 1];
            rArray[index + 1] = week;
          }
          return rArray;
        }
      }

      var rArray = weekArray;

      var index = weekArray.findIndex(function(element){
        return element.id === week.id;
      });
    
      return moveFunctions[direction](rArray, week, index);
    };

    contract.isInvalid = function(weekArray, week){
      return (isNameInvalid(weekArray, week) || isDaysInvalid(week));
    };

    contract.hasConfirmed = function(weeksArray){
      for(var i = 0; i < weeksArray.length; i++){
        if(weeksArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    var isNameInvalid = function(weekArray, week){
      return (utilService.isUndefined(week.name) || week.name === '' || isNameTaken(weekArray, week));
    };

    var isNameTaken = function(weekArray, week){
      for(var i = 0; i < weekArray.length; i++){
        if(weekArray[i].name === week.name && weekArray[i].id !== week.id){
          return true;
        }
      }
      return false;
    };

    var isDaysInvalid = function(week){
      var allNotConfirmed = function(days){
        for(var i = 0; i < days.length; i++){
          if(days[i].confirmed === false){
            return true;
          }
        }
        return false;
      };
      return (utilService.isUndefined(week.days) || week.days.length <= 0 || week.days.length > 7 || allNotConfirmed(week.days));
    };

    var generateWeek = function(id){
      return {
        id: id, 
        name: '',
        days: [],
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeDay
 * @description
 * # addProgramTypeDay
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeDay', ['addProgramTypeDayService', function (addProgramTypeDayService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/day/addProgramTypeDayView.html',
      restrict: 'E',
      scope: {
        programTypeDays: '='
      },
      link: function postLink(scope) {
        
        scope.remove = addProgramTypeDayService.remove;
        scope.edit = addProgramTypeDayService.edit;
        scope.duplicate = addProgramTypeDayService.duplicate;
        scope.move = addProgramTypeDayService.move;

        scope.$watchCollection(function(){
          return addProgramTypeDayService.days;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeDays = addProgramTypeDayService.days;
          }
        });
        
        scope.addDay = function(){
          scope.programTypeDays = addProgramTypeDayService.addDay(scope.programTypeDays);
        };

        scope.editDay = function(day){
          day.confirmed = false;
        };

        scope.duplicateDay = function(day){
          scope.programTypeDays = addProgramTypeDayService.duplicateDay(scope.programTypeDays, day);
        };

        scope.moveDay = function(day, direction){
          scope.programTypeDays = addProgramTypeDayService.moveDay(scope.programTypeDays, day, direction);
        };

        scope.confirmDay = function(day){
          day.confirmed = true;
        };

        scope.removeDay = function(day){
          scope.programTypeDays = addProgramTypeDayService.removeDay(scope.programTypeDays, day);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeDayService.hasConfirmed(scope.programTypeDays);
        };

        scope.isInvalid = function(day){
          return addProgramTypeDayService.isInvalid(scope.programTypeDays, day);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeDayService
 * @description
 * # addProgramTypeDayService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeDayService', ['utilService', 'toastService', function (utilService, toastService) {
    var contract = {
      remove: true,
      edit: true,
      duplicate: true,
      move: true,
      days: []
    };

    contract.addDay = function(dayArray){
      dayArray.push(generateDay(utilService.getUniqueId(dayArray)));
      return dayArray;
    };

    contract.removeDay = function(daysArray, day){
      var tempDaysArray = angular.copy(daysArray);
      toastService.showUndoToast('Day removed', function(){
        contract.days = tempDaysArray;
      });

      return utilService.removeFromArray(daysArray, day);
    };

    contract.duplicateDay = function(dayArray, day){
      var newDay = angular.copy(day);
      newDay.id = utilService.getUniqueId(dayArray);
      newDay.name = newDay.name + ' ' + newDay.id;
      dayArray.push(newDay);
      return dayArray;
    };

    contract.moveDay = function(dayArray, day, direction){
      var moveFunctions = {
        up: function(rArray, day, index){
          if(index !== -1 && index !== 0){
            rArray[index] = rArray[index - 1];
            rArray[index - 1] = day;
          }
          return rArray;
        },
        down: function(rArray, day, index){
          if(index !== -1 && index !== (rArray.length - 1)){
            rArray[index] = rArray[index + 1];
            rArray[index + 1] = day;
          }
          return rArray;
        }
      }

      var rArray = dayArray;

      var index = dayArray.findIndex(function(element){
        return element.id === day.id;
      });
    
      return moveFunctions[direction](rArray, day, index);
    };

    contract.isInvalid = function(dayArray, day){
      return (isNameInvalid(dayArray, day) || isSetInvalid(day));
    };

    contract.hasConfirmed = function(dayArray){
      for(var i = 0; i < dayArray.length; i++){
        if(dayArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    var isNameInvalid = function(dayArray, day){
      // Check if name is not empty
      return (utilService.isUndefined(day.name) || day.name === '' || nameTaken(dayArray, day));
    };

    var nameTaken = function(dayArray, day){
      for(var i = 0; i < dayArray.length; i++){
        if(dayArray[i].name === day.name && dayArray[i].id !== day.id){
          return true;
        }
      }
      return false;
    };

    var isSetInvalid = function(day){
      var allNotConfirmed = function(sets){
        for(var i = 0; i < sets.length; i++){
          if(sets[i].confirmed === false){
            return true;
          }
        }
        return false;
      };
      return (utilService.isUndefined(day.sets) || day.sets.length <= 0 || allNotConfirmed(day.sets));
    };

    var generateDay = function(id){
      return {
        id: id,
        name: '',
        sets: [],
        confirmed: false
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSet
 * @description
 * # addProgramTypeSet
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSet', ['addProgramTypeSetService', 'addProgramTypeService', function (addProgramTypeSetService, addProgramTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/addProgramTypeSetView.html',
      restrict: 'E',
      scope: {
        programTypeSets: '=',
      },
      link: function postLink(scope) {

        scope.remove = addProgramTypeSetService.remove;
        scope.edit = addProgramTypeSetService.edit;
        scope.duplicate = addProgramTypeSetService.duplicate;
        scope.move = addProgramTypeSetService.move;

        scope.helpAddProgramTypeIncrementUrl = addProgramTypeSetService.helpAddProgramTypeIncrementUrl;
        scope.helpAddProgramTypeOneRepMaxUrl = addProgramTypeSetService.helpAddProgramTypeOneRepMaxUrl;

        scope.exercises = addProgramTypeService.exercises;

        scope.addSet = function(){
          scope.programTypeSets = addProgramTypeSetService.addSet(scope.programTypeSets);
        };

        scope.editSet = function(set){
          set.confirmed = false;
        };

        scope.duplicateSet = function(set){
          scope.programTypeSets = addProgramTypeSetService.duplicateSet(scope.programTypeSets, set);
        };

        scope.moveSet = function(set, direction){
          scope.programTypeSets = addProgramTypeSetService.moveSet(scope.programTypeSets, set, direction);
        };

        scope.confirmSet = function(set){
          set.confirmed = true;
          set.exercises.forEach(function(setExercise){
            if(setExercise.exercise.exerciseType.id === 2){
              setExercise = addProgramTypeSetService.formatCardio(setExercise);
            }
          });
        };

        scope.removeSet = function(set){
          scope.programTypeSets = addProgramTypeSetService.removeSet(scope.programTypeSets, set);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeSetService.hasConfirmed(scope.programTypeSets);
        };

        scope.isInvalid = function(set){
          return addProgramTypeSetService.isInvalid(set);
        };

        scope.$watchCollection(function(){
          return addProgramTypeSetService.sets;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.programTypeSets = addProgramTypeSetService.sets;
          }
        });

        scope.$watchCollection(function(){
          return addProgramTypeService.exercises;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.exercises = addProgramTypeService.exercises;
          }
        });
      }
    };
  }]);
'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeSetService
 * @description
 * # addProgramTypeSetService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeSetService', ['utilService', 'toastService', 'setTypeService', function (utilService, toastService, setTypeService) {
    var contract = {
      remove: true,
      edit: true,
      duplicate: true,
      move: true,
      helpAddProgramTypeIncrementUrl: 'scripts/directives/addProgramType/help/helpAddProgramTypeIncrementTemplate.html',
      helpAddProgramTypeOneRepMaxUrl: 'scripts/directives/addProgramType/help/helpAddProgramTypeOneRepMaxTemplate.html',
      sets: []
    };

    contract.addSet = function(setArray){
      setArray.push(generateSet(utilService.getUniqueId(setArray)));
      return setArray;
    };

    contract.removeSet = function(setsArray, set){
      var tempSetsArray = angular.copy(setsArray);
      toastService.showUndoToast('Set removed', function(){
        contract.sets = tempSetsArray;
      });

      return utilService.removeFromArray(setsArray, set);
    };

    contract.duplicateSet = function(setArray, set){
      var newSet = angular.copy(set);
      newSet.id = utilService.getUniqueId(setArray);
      setArray.push(newSet);
      return setArray;
    };

    contract.moveSet = function(setArray, set, direction){
      var moveFunctions = {
        up: function(rArray, set, index){
          if(index !== -1 && index !== 0){
            rArray[index] = rArray[index - 1];
            rArray[index - 1] = set;
          }
          return rArray;
        },
        down: function(rArray, set, index){
          if(index !== -1 && index !== (rArray.length - 1)){
            rArray[index] = rArray[index + 1];
            rArray[index + 1] = set;
          }
          return rArray;
        }
      }

      var rArray = setArray;

      var index = setArray.findIndex(function(element){
        return element.id === set.id;
      });
    
      return moveFunctions[direction](rArray, set, index);
    };

    contract.hasConfirmed = function(setArray){
      for(var i = 0; i < setArray.length; i++){
        if(setArray[i].confirmed === true){
          return true;
        }
      }
      return false;
    };

    contract.formatCardio = function(setExercise){
      var fSetExercise = setExercise;
      fSetExercise = addDuration(setExercise);
      fSetExercise = addReps(setExercise);
      return fSetExercise;
    };

    contract.isInvalid = function(set){
      return (setTypeInvalid(set.setType) || setNumberOfSetsInvalid(set) || setExercisesInvalid(set.setType, set.exercises));
    };

    contract.setExerciseTypesInvalid = function(setExercise){
      var exerciseTypeFunctions = {
        0: weightedExerciseInvalid(setExercise),
        1: nonWeightedExerciseInvalid(setExercise),
        2: cardioExerciseInvalid(setExercise)
      };
      if(exerciseInvalid(setExercise.exercise)){
        return true;
      }
      return exerciseTypeFunctions[setExercise.exercise.exerciseType.id];
    };

    var setNumberOfSetsInvalid = function(set){
      return (utilService.isUndefined(set.numberOfSets) || set.numberOfSets < 0);
    };

    var setTypeInvalid = function(setType){
      return (utilService.isUndefined(setType) || utilService.isUndefined(setType.id));
    };

    var setExercisesInvalid = function(setType, setExercises){
      return (minNumberOfExercises(setType, setExercises) || setExercisesNotConfirmed(setType, setExercises) || 
      setExercisesTypesInvalid(setExercises));
    };

    var minNumberOfExercises = function(setType, setExercises){
      var minNumberOfSupersetsInvalid = function(setType, setExercises){
        if(setType.id === 1){
          return setExercises.length < 2;
        }
        return false;
      };
      return (utilService.isUndefined(setExercises) || setExercises.length < 1 || minNumberOfSupersetsInvalid(setType, setExercises));
    };

    var setExercisesNotConfirmed = function(setType, setExercises){
      if(setType.id === 0){
        return false;
      }
      for(var i = 0; i < setExercises.length; i++){
        if(setExercises[i].confirmed === false){
          return true;
        }
      }
      return false;
    };

    var setExercisesTypesInvalid = function(setExercises){
      // Checks if invalid for weighted, non-weighted and cardio exercise types
      for(var i = 0; i < setExercises.length; i++){
        if(contract.setExerciseTypesInvalid(setExercises[i]) === true){
          return true;
        }
      }
      return false;
    };

    var exerciseInvalid = function(exercise){
      return (utilService.isUndefined(exercise) || utilService.isUndefined(exercise.id));
    };

    var weightedExerciseInvalid = function(setExercise){
      return (utilService.isUndefined(setExercise.numberOfReps) || setExercise.numberOfReps < 1 ||
      utilService.isUndefined(setExercise.oneRepMaxPercentage) || setExercise.oneRepMaxPercentage < 0 || 
      setExercise.oneRepMaxPercentage > 100 || utilService.isUndefined(setExercise.incrementMultiplier) || 
      setExercise.incrementMultiplier < 0);
    };

    var nonWeightedExerciseInvalid = function(setExercise){
      return (utilService.isUndefined(setExercise.numberOfReps) || setExercise.numberOfReps < 1 );
    };

    var cardioExerciseInvalid = function(setExercise){
      return (utilService.isUndefined(setExercise.minutes) || setExercise.minutes < 0 || 
      utilService.isUndefined(setExercise.seconds) || setExercise.seconds < 0 || setExercise.seconds > 59);
    };

    var addDuration = function(setExercise){
      var fSetExercise = setExercise;
      fSetExercise.duration = formatTime(setExercise.minutes, setExercise.seconds);
      return fSetExercise;
    };

    var addReps = function(setExercise){
      var fSetExercise = setExercise;
      fSetExercise.numberOfReps = 1;
      return fSetExercise;
    };

    var formatTime = function(minutes, seconds){
      var rString = '';
      rString += minutes;
      rString += ':';

      if(seconds < 10){
        rString += '0' + seconds;
      }
      else if(seconds !== undefined){
        rString += seconds;
      }
      else{
        rString += '00';
      }

      return rString;
    };

    var generateSet = function(id){
      return {
        id: id,
        exercises: [],
        confirmed: false,
        complete: false,
        setType: setTypeService.getDefault()
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.storageService
 * @description
 * # storageService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('storageService', ['utilService', 'localStorageService', function (utilService, localStorageService) {
    var contract = {};

    contract.storeValue = function(key, value){
      localStorageService.set(key, value);
    };

    contract.getValue = function(key){
      return localStorageService.get(key);
    };

    contract.getValueOrDefault = function(key, dValue){
      var value = localStorageService.get(key);
      if(utilService.isDefined(value)){
        return value;
      }
      return dValue;    
    };

    contract.reset = function(){
      localStorageService.clearAll();
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.keyHandlerService
 * @description
 * # keyHandlerService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('keyHandlerService', function () {
    var contract = {};

    contract.keys = {
      programType: 'PROGRAM_TYPE',
      program: 'PROGRAM',
      recentlyActive: 'RECENTLY_ACTIVE',
      unit: 'WEIGHT_UNIT',
      programListOrderKey: 'PROGRAM_LIST_ORDER_KEY',
      programListReversedKey: 'PROGRAM_LIST_REVERSED_KEY',
      programTypeListOrderKey: 'PROGRAM_TYPE_LIST_ORDER_KEY',
      programTypeListReversedKey: 'PROGRAM_TYPE_LIST_REVERSED_KEY',
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:viewProgramType
 * @description
 * # viewProgramType
 */
angular.module('powerHouseApp')
  .directive('programTypeList', ['$location', 'programTypeListService', 'programTypeService', function ($location, programTypeListService, programTypeService) {
    return {
      templateUrl: 'scripts/directives/programTypeList/ProgramTypeListView.html',
      restrict: 'E',
      scope: {
        programTypes: '='
      },
      link: function postLink(scope) {
        scope.formattedProgramTypes = programTypeListService.formatProgramTypes(scope.programTypes);

        scope.editFunction = function(programType){
          $location.path('edit-program-type/' + programType.id);
        };

        scope.removeFunction = function(programType){
          programTypeService.removeProgramType(programType.programType);
        };

        scope.$watch(function(){
          return scope.programTypes;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.formattedProgramTypes = programTypeListService.formatProgramTypes(scope.programTypes);
          }
        }, true);

      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:list
 * @description
 * # list
 */
angular.module('powerHouseApp')
  .directive('list', function () {
    return {
      templateUrl: 'scripts/directives/list/listView.html',
      restrict: 'E',
      scope: {
        editFunction: '=',
        removeFunction: '=',
        values: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeListService
 * @description
 * # programTypeListService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeListService', ['keyHandlerService', 'orderListService', function (keyHandlerService, orderListService) {
    var contract = {
      orderKey: keyHandlerService.keys.programTypeListOrderKey,
      reverseKey: keyHandlerService.keys.programTypeListReversedKey,
      orderValues: [
        {
          prop: 'programTypeName',
          text: 'Name'
        },
        {
          prop: 'level',
          text: 'Experience Level',
          comparator: function(v1, v2){
            var rValue = 0;
            if(v1.value.id < v2.value.id){
              rValue = -1;
            }
            else if(v1.value.id > v2.value.id){
              rValue = 1;
            }
            return rValue;
          }
        },
        {
          prop: 'default',
          text: 'Default'
        },
        {
          prop: 'totalNumberOfSets',
          text: 'Number of Sets',

        },
        {
          prop: 'weeks',
          text: 'Number of Weeks',
          comparator: function(v1, v2){
            var rValue = 0;
            if(v1.value.length < v2.value.length){
              rValue = -1;
            }
            else if(v1.value.length > v2.value.length){
              rValue = 1;
            }
            return rValue;
          }
        },
      ]
    };

    contract.getOrderValues = function(){
      return orderListService.getOrderByValues(contract.orderValues);
    };

    contract.formatProgramTypes = function(programTypes){
      return programTypes.map(function(programType){
        return formatProgramType(programType);
      });
    };

    var formatProgramType = function(programType){
        return {
          programType: programType,
          id: programType.id,
          text: programType.programTypeName,
          secondText: 'Total Weeks: ' + programType.weeks.length + ', Total Sets: ' + programType.totalNumberOfSets,
          thirdText: 'Experience Level: ' + programType.level.name,
          href: '#/program-type-information/' + programType.id,
          removable: !programType.default,
          editable: true,
          color: 'grey-A100'
        };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ProgramtypeinformationCtrl
 * @description
 * # ProgramtypeinformationCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ProgramTypeInformationCtrl', ['$scope', '$routeParams', '$location', 'programTypeInformationService', 'programTypeService', function ($scope, $routeParams, $location, programTypeInformationService, programTypeService) {

    $scope.programType = programTypeService.getProgramType($routeParams.id);

    $scope.editFunction = function(programType){
      $location.path('edit-program-type/' + programType.id);
    };

    $scope.removeFunction = function(programType){
      programTypeService.removeProgramType(programType);
      $location.path('program-type-list');
    };
    
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:PrograminformationCtrl
 * @description
 * # PrograminformationCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ProgramInformationCtrl', ['$scope', '$routeParams', 'programService', '$location', 'unitService', function ($scope, $routeParams, programService, $location, unitService) {
    $scope.program = programService.getProgram($routeParams.id);

    $scope.unit = unitService.getCurrentUnit();

    $scope.editFunction = function(program){
      $location.path('edit-program/' + program.id);
    };

    $scope.removeFunction = function(program){
      programService.removeProgram(program);
      $location.path('program-list');
    };

    $scope.calculatePercentageComplete = function(day){
      $scope.program = programService.updateProgramComplete($scope.program, day);
    };

  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeInformationService
 * @description
 * # programTypeInformationService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeInformationService', function () {
    var contract = {};

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgram
 * @description
 * # addProgram
 */
angular.module('powerHouseApp')
  .directive('addProgram', [function () {
    return {
      templateUrl: 'scripts/directives/addProgram/addProgramView.html',
      restrict: 'E',
      scope: {
        programName: '=',
        programType: '=',
        increment: '=',
        exercises: '=',
        addFunction: '=',
        removeFunction: '=',
        invalidFunction: '='
      },
      link: function postLink() {

      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:programList
 * @description
 * # programList
 */
angular.module('powerHouseApp')
  .directive('programList', ['$location', 'programListService', 'programService', function ($location, programListService, programService) {
    return {
      templateUrl: 'scripts/directives/programList/programListView.html',
      restrict: 'E',
      scope: {
        programs: '=',
      },
      link: function postLink(scope) {

        scope.formattedPrograms = programListService.formatPrograms(scope.programs);

        scope.editFunction = function(program){
          $location.path('edit-program/' + program.id);
        };

        scope.removeFunction = function(program){
          programService.removeProgram(program.program);
        };

        scope.$watch(function(){
          return scope.programs;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.formattedPrograms = programListService.formatPrograms(scope.programs);
          }
        }, true);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramHeader
 * @description
 * # addProgramHeader
 */
angular.module('powerHouseApp')
  .directive('addProgramHeader', ['addProgramHeaderService', 'unitService', function (addProgramHeaderService, unitService) {
    return {
      templateUrl: 'scripts/directives/addProgram/addProgramHeaderView.html',
      restrict: 'E',
      scope: {
        programName: '=',
        programType: '=',
        increment: '='
      },
      link: function postLink(scope) {
        scope.programTypes = addProgramHeaderService.getProgramTypes(scope.programType);
        scope.unit = unitService.getCurrentUnit();

        scope.helpAddProgramUrl = addProgramHeaderService.helpAddProgramUrl;
        scope.helpAddProgramProgramIncrementUrl = addProgramHeaderService.helpAddProgramProgramIncrementUrl;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramHeaderService
 * @description
 * # addProgramHeaderService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramHeaderService', ['addProgramService', 'programTypeService', function (addProgramService, programTypeService) {
    var contract = {
      helpAddProgramUrl: 'scripts/directives/addProgram/helpAddProgramTemplate.html',
      helpAddProgramProgramIncrementUrl: 'scripts/directives/addProgram/helpAddProgramProgramIncrementTemplate.html'
    };

    contract.getProgramTypes = function(programType){
      var programTypes = angular.copy(programTypeService.getProgramTypes());
      if(programTypeService.validProgramType(programType) && programTypeService.containsProgramType(programTypes, programType) === false){
        programTypes.push(programType);
      }
      return programTypes;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramExerciseService
 * @description
 * # addProgramExerciseService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramExerciseService', function () {
    var contract = {
      helpAddProgramOneRepMaxUrl: 'scripts/directives/addProgram/helpAddProgramOneRepMaxTemplate.html'
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramExercise
 * @description
 * # addProgramExercise
 */
angular.module('powerHouseApp')
  .directive('addProgramExercise', ['addProgramExerciseService', function (addProgramExerciseService) {
    return {
      templateUrl: 'scripts/directives/addProgram/addProgramExerciseView.html',
      restrict: 'E',
      scope: {
        exercises: '='
      },
      link: function postLink(scope) {
        scope.helpAddProgramOneRepMaxUrl = addProgramExerciseService.helpAddProgramOneRepMaxUrl;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programService
 * @description
 * # programService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programService', ['utilService', 'storageService', 'keyHandlerService', 'toastService', 'recentlyActiveService', 'unitService', 'programConversionService', 'programCompleteService',
    function (utilService, storageService, keyHandlerService, toastService, recentlyActiveService, unitService, programConversionService, programCompleteService) {
    var contract = {
      programs: [],
    };

    var init = function(){
      contract.programs = getProgramsFromStorage();
      contract.convertPrograms();
      if(recentlyActiveService.currentlyActive() === false){
        recentlyActiveService.updateRecentlyActive(recentlyActiveService.nextActive(contract.getActivePrograms()));
      }
    };

    contract.reset = function(){
      contract.programs = [];
      storePrograms();
    };

    contract.convertPrograms = function(){
      contract.programs = programConversionService.convertPrograms(contract.programs);
      if(recentlyActiveService.currentlyActive() === false){
        recentlyActiveService.updateRecentlyActive(recentlyActiveService.nextActive(contract.getActivePrograms()));
      }
      else {
        // Find the corresponding program and set it as the new recently getActivePrograms
        recentlyActiveService.updateRecentlyActive(contract.programs[findProgramIndex(recentlyActiveService.getRecentlyActive())]); 
      }
      storePrograms();
    };

    contract.addProgram = function(programName, programType, increment, exercises){
      var program = generateProgram(utilService.getUniqueId(contract.programs), programName, programType, increment, exercises);
      contract.programs.push(program);
      contract.convertPrograms();
      recentlyActiveService.updateRecentlyActive(program);
      storePrograms();
    };

    contract.editProgram = function(oldProgram, id, programName, programType, increment, exercises){
      removeProgramWithoutToast(oldProgram);
      var program = mapProgramCompletion(oldProgram, generateProgram(id, programName, programType, increment, exercises));
      contract.programs.push(program);
      contract.updateProgramComplete(program);
      recentlyActiveService.updateRecentlyActive(program);
      storePrograms();
    };

    contract.removeProgram = function(program){
      var tempPrograms = angular.copy(contract.programs);

      toastService.showUndoToast('Program removed', function(){        
        contract.programs = tempPrograms;
        recentlyActiveService.undoRemove();
        storePrograms();
      });

      recentlyActiveService.removeProgram(program);
      removeProgram(program);
      recentlyActiveService.updateRecentlyActive(recentlyActiveService.nextActive(contract.getActivePrograms()));
    };

    contract.getPrograms = function(){
      return contract.programs;
    };

    contract.getProgram = function(id){
      var index = findProgramIndex({id: id});
      return contract.programs[index];
    };

    contract.nameTaken = function(programName){
      for(var i = 0; i < contract.programs.length; i++){
        if(utilService.isDefined(contract.programs[i].name) && contract.programs[i].name === programName){
          return true;
        }
      }
      return false;
    };

    contract.updateProgram = function(program){
      var index = findProgramIndex(program);
      contract.programs[index] = program;

      if(program.complete === false){
        recentlyActiveService.updateRecentlyActive(program);
      }
      else {
        recentlyActiveService.updateRecentlyActive(recentlyActiveService.nextActive(contract.getActivePrograms()));
      }

      storePrograms();
      return program;
    };

    contract.updateProgramComplete = function(program, day){
      var updatedProgram = program;

      var completedSets = 0;

      updatedProgram.weeks.forEach(function(week){
        week.days.forEach(function(day){
          day.sets.forEach(function(set){
            if(set.complete === true){
              completedSets += set.numberOfSets;
            }
          });
        });
      });

      updatedProgram.percentComplete = calculatePercentage(program.programType.totalNumberOfSets, completedSets);

      var previouslyComplete = updatedProgram.complete;
      updatedProgram.complete = completeProgram(program.programType.totalNumberOfSets, completedSets);
      var newlyComplete = updatedProgram.complete;

      // Program is newly completed
      if(previouslyComplete !== newlyComplete && updatedProgram.complete === true){
        programCompleteService.programComplete(updatedProgram);
      }
      else if(utilService.isDefined(day) && allSetsCompleteInDay(day)){
        // Check if we have completed all sets for today, if we have show an ad
        programCompleteService.dayComplete(day);
      }

      return contract.updateProgram(updatedProgram);
    };
    
    contract.getCompletedPrograms = function(){
      return contract.programs.filter(function(program){
        return program.complete === true;
      });
    };

    contract.getActivePrograms = function(){
      return contract.programs.filter(function(program){
        return (program.complete === false || utilService.isUndefined(program.complete));
      });
    };
    
    var allSetsCompleteInDay = function(day){
      for(var i = 0; i < day.sets.length; i++){
        if(day.sets[i].complete === false){
          return false;
        }
      }
      return true;
    };

    var completeProgram = function(totalSets, completedSets){
      return (totalSets === completedSets);
    };

    var removeProgram = function(program){
      contract.programs = utilService.removeFromArray(contract.programs, program);
      storePrograms();
    };

    var removeProgramWithoutToast = function(program){
      removeProgram(program);
    };

    var mapProgramCompletion = function(oldProgram, newProgram){
      var program = newProgram;

      if(program.programType.id === oldProgram.programType.id){
        oldProgram.weeks.forEach(function(week, wIndex){
          week.days.forEach(function(day, dIndex){
            day.sets.forEach(function(set, sIndex){
              if(set.complete === true){
                program.weeks[wIndex].days[dIndex].sets[sIndex].complete = true;
              }
            });
          });
        });
      }

      return program;
    };

    var calculatePercentage = function(total, complete){
      return ((complete / total) * 100);
    };

    var findProgramIndex = function(program){
      return contract.programs.findIndex(function(p){
        return utilService.getNumber(program.id) === utilService.getNumber(p.id);
      });
    };

    var generateProgram = function(id, programName, programType, increment, exercises){
      return {
        id: id,
        unit: unitService.getCurrentUnit().name,
        name: programName,
        weeks: generateWeeks(programType, increment, exercises),
        percentComplete: 0,
        programType: programType,
        increment: utilService.getNumber(increment).toFixed(1),
        exercises: exercises,
        default: false,
        complete: false
      };
    };

    var generateWeeks = function(programType, increment, exercises){
      return programType.weeks.map(function(week){
        return {
          id: week.id,
          name: week.name,
          days: generateDays(week, increment, exercises)
        };
      });
    };

    var generateDays = function(week, increment, exercises){
      return week.days.map(function(day){
        return {
          id: day.id,
          name: day.name,
          sets: generateSets(day, increment, exercises)
        };
      });
    };

    var generateSets = function(day, increment, exercises){
      return day.sets.map(function(set){
        return {
          id: set.id,
          setType: set.setType,
          numberOfSets: set.numberOfSets,
          exercises: generateSetExercises(set, increment, exercises),
          complete: false
        };
      });
    };

    var generateSetExercises = function(set, increment, exercises){
        return set.exercises.map(function(setExercise){
          if(setExercise.exercise.exerciseType.id === 0){
            setExercise.weight = generateWeight((setExercise.oneRepMaxPercentage * 0.01), setExercise.incrementMultiplier, increment, setExercise.exercise.id, exercises);
          }
          return setExercise;
        });
    };

    var generateWeight = function(oneRepMaxPercent, incrementMultiplier, increment, exerciseId, exercises){
      // (ORMP * exerciseORM) + increment
      return utilService.round((oneRepMaxPercent * findOneRepMax(exerciseId, exercises)) + (utilService.getNumber(increment) * incrementMultiplier), 1, 2.5);
    };

    var findOneRepMax = function(exerciseId, exercises){
      for(var i = 0; i < exercises.length; i++){
        if(exercises[i].id === exerciseId){
          return utilService.getNumber(exercises[i].oneRepMax);
        }
      }
      return -1;
    };

    var getProgramsFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.program, []);
    };

    var storePrograms = function(){
      storageService.storeValue(keyHandlerService.keys.program, contract.programs);
    };

    init();
    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programListService
 * @description
 * # programListService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programListService', ['unitService', 'keyHandlerService', 'orderListService', function (unitService, keyHandlerService, orderListService) {
    var contract = {
      orderKey: keyHandlerService.keys.programListOrderKey,
      reverseKey: keyHandlerService.keys.programListReversedKey,
      orderValues: [
        {
          prop: 'name',
          text: 'Name'
        },
        {
          prop: 'complete',
          text: 'Complete'
        },
        {
          prop: 'increment',
          text: 'Increment'
        },
        {
          prop: 'percentComplete',
          text: 'Percent Complete'
        },
        {
          prop: 'programType',
          text: 'Experience Level',
          comparator: function(v1, v2){
            if(v1.type === 'object' && v2.type === 'object'){
              var rValue = 0;
              
              if(v1.value.level.id < v2.value.level.id){
                rValue = -1;
              }
              else if(v1.value.level.id > v2.value.level.id){
                rValue = 1;
              }

              return rValue;
            }
          }
        },
      ]
    };

    contract.getOrderValues = function(){
      return orderListService.getOrderByValues(contract.orderValues);
    };

    contract.formatPrograms = function(programs){
      return programs.map(function(program){
        return formatProgram(program);
      });
    };

    var formatProgram = function(program){
      return {
        program: program,
        id: program.id,
        text: program.name,
        secondText: 'Total Weeks: ' + program.weeks.length,
        thirdText: 'Increment: ' + program.increment + unitService.getCurrentUnit().textName,
        percentage: program.percentComplete,
        href: '#/program-information/' + program.id,
        removable: !program.default,
        editable: true,
        color: program.complete ? 'green-50' : 'grey-A100'
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programInformationService
 * @description
 * # programInformationService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programInformationService', function () {
    var contract = {};

    return contract;
  });

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:EditprogramCtrl
 * @description
 * # EditprogramCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('EditProgramCtrl', ['$scope', '$routeParams', '$location', '$window', 'programService', 'addProgramService', 'utilService', function ($scope, $routeParams, $location, $window, programService, addProgramService, utilService) {

    $scope.program = programService.getProgram($routeParams.id);

    $scope.programName = angular.copy($scope.program.name);
    $scope.programType = angular.copy($scope.program.programType);
    $scope.increment = angular.copy(utilService.getNumber($scope.program.increment));
    $scope.exercises = angular.copy(addProgramService.getExercisesWithORM($scope.programType, $scope.program));

    $scope.addFunction = function(programName, programType, increment, exercises){
      addProgramService.editProgram($scope.program, $scope.program.id, programName, programType, increment, exercises);
      $window.history.back();
    };

    $scope.removeFunction = function(){
      $window.history.back();
    };

    $scope.invalidFunction = function(programName, programType, increment, exercises){
      return addProgramService.invalidAllowDuplicateNames(programName, programType, increment, exercises);
    };

    $scope.$watch(function(){
      return $scope.programType;
    },
    function(newValue, oldValue){
      if(newValue !== oldValue && newValue !== ''){
        $scope.exercises = addProgramService.getExercisesWithORM($scope.programType, $scope.program);
      }
    });

  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramService
 * @description
 * # addProgramService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramService', ['utilService', 'programService', 'exerciseTypeService', 'unitService', 'adTriggerService', 'adWeightService', function (utilService, programService, exerciseTypeService, unitService, adTriggerService, adWeightService) {
    var contract = {};

    contract.addProgram = function(programName, programType, increment, exercises){
      adTriggerService.incrementCount(adWeightService.weights.addProgram);
      programService.addProgram(programName, programType, increment, formatExercises(programType.exercises, exercises));
    };

    contract.editProgram = function(program, id, programName, programType, increment, exercises){
      adTriggerService.incrementCount(adWeightService.weights.editProgram);
      programService.editProgram(program, id, programName, programType, increment, formatExercises(programType.exercises, exercises));
    };

    contract.invalid = function(programName, programType, increment, exercises){
      return (programNameInvalid(programName) || programNameDuplicateInvalid(programName) || 
      programTypeInvalid(programType) || programIncrementInvalid(increment) || programExercisesInvalid(exercises));
    };

    contract.invalidAllowDuplicateNames = function(programName, programType, increment, exercises){
      return (programNameInvalid(programName) || programTypeInvalid(programType) || 
      programIncrementInvalid(increment) || programExercisesInvalid(exercises));
    };

    contract.getExercises = function(programType){
      // Return all the required one rep max exercises
      var rArray = [];

      programType.exercises.forEach(function(exercise){
        if(exercise.exerciseType.id === 0){
          rArray.push(exercise);
        }
      });

      return rArray;
    };

    contract.getExercisesWithORM = function(programType, program){
      var programTypeExercises = contract.getExercises(programType);
      var programExercises = contract.getExercises(program);

      for(var i = 0; i < programTypeExercises.length; i++){
        for(var y = 0; y < programExercises.length; y++){
          if(exerciseTypeService.exercisesSame(programTypeExercises[i], programExercises[y])){
            programTypeExercises[i].oneRepMax = programExercises[y].oneRepMax;
            break;
          }
        }        
      }

      return programTypeExercises;
    };

    var formatExercises = function(originalExercises, newExercises){
      var fExercises = originalExercises;

      var findIndex = function(array, id){
        return array.findIndex(function(value){
          return value.id === id;
        });
      };

      for(var i = 0; i < newExercises.length; i++){
        fExercises[findIndex(fExercises, newExercises[i].id)] = newExercises[i];
      }

      return fExercises; 
    };

    var programNameInvalid = function(programName){
      var invalid = false;

      if(programName === '' || utilService.isUndefined(programName)){
        invalid = true;
      }

      return invalid;
    };

    var programNameDuplicateInvalid = function(programName){
      var invalid = false;

      if(programService.nameTaken(programName)){
        invalid = true;
      }

      return invalid;
    };

    var programTypeInvalid = function(programType){
      var invalid = false;

      if(programType === '' || utilService.isUndefined(programType)){
        invalid = true;
      }

      return invalid;
    };

    var programIncrementInvalid = function(increment){
      var invalid = false;

      if(utilService.isNumber(increment) === false){
        invalid = true;
      }
      else if(increment < 0){
        invalid = true;
      }
      else if(increment !== 0 && increment % unitService.getCurrentUnit().interval !== 0){
        invalid = true;
      }

      return invalid;
    };

    var programExercisesInvalid = function(exercises){
      var invalid = false;

      for(var i = 0; i < exercises.length; i++){
        var exercise = exercises[i];
        if(utilService.isUndefined(exercise.oneRepMax) || exercise.oneRepMax < 1){
          invalid = true;
          break;
        }
      }

      return invalid;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:EditprogramtypeCtrl
 * @description
 * # EditprogramtypeCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('EditProgramTypeCtrl', ['$scope', '$routeParams', '$location', '$window', 'utilService', 'programTypeService', 'addProgramTypeService', 'programTypeLevelService', 
  function ($scope, $routeParams, $location, $window,utilService, programTypeService, addProgramTypeService, programTypeLevelService) {
    $scope.programType = programTypeService.getProgramType($routeParams.id);

    $scope.programTypeName = angular.copy($scope.programType.programTypeName);
    $scope.level = angular.copy(utilService.getValueOrDefault($scope.programType.level, programTypeLevelService.getDefault()));
    $scope.description = angular.copy(utilService.getValueOrDefault($scope.programType.description, ''));
    $scope.exercises = angular.copy($scope.programType.exercises);
    $scope.weeks = angular.copy($scope.programType.weeks);

    $scope.addFunction = function(programTypeName, level, description, exercises, weeks){
      addProgramTypeService.addProgramType(programTypeName, level, description, exercises, weeks);
      $location.path('program-type-list');
    };

    $scope.removeFunction = function(){
      $window.history.back();
    };

    $scope.invalidFunction = function(programName, level, description, exercises, weeks){
      return addProgramTypeService.isInvalid(programName, level, description, exercises, weeks);
    };

    $scope.$watchCollection(function(){
      return $scope.exercises;
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        addProgramTypeService.exercises = newValue;
      }
    });

  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:messageCard
 * @description
 * # messageCard
 */
angular.module('powerHouseApp')
  .directive('messageCard', ['$location', function ($location) {
    return {
      templateUrl: 'scripts/directives/messageCard/messageCardView.html',
      restrict: 'E',
      scope: {
        message: '=',
        buttonText: '=',
        link: '='
      },
      link: function postLink(scope) {
        scope.buttonClicked = function(){
          $location.path(scope.link);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.toastService
 * @description
 * # toastService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('toastService', ['$mdToast', function ($mdToast) {
    var contract = {};

    var position = 'bottom';

    contract.showUndoToast = function(text, undoFunction){
      $mdToast.show(getUndoToastObject(text, position)).then(function(response){
        if (response === 'ok'){
          undoFunction();
        }
      });
    };

    contract.showProgramCompleteToast = function(text, completeFunction){
      $mdToast.show(getProgramCompleteObject(text, position)).then(function(){
        completeFunction();
      });
    };

    var getUndoToastObject = function(text, position){
      return $mdToast.simple()
        .textContent(text)
        .action('UNDO')
        .highlightAction(true)
        .position(position);
    };

    var getProgramCompleteObject = function(text, position){
      return $mdToast.simple()
        .textContent(text)
        .position(position);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.defaultProgramTypeService
 * @description
 * # defaultProgramTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('defaultProgramTypeService', function () {
    var contract = {};

    var defaultProgramTypes = [
      {  
        'id':0,
        'description':'5 by 5 is a proved workout routine to gain strength, build muscle and burn fat. Five compound exercises are used in varying combinations with differing increment multipliers. This routine requires three days a week taking around fourty-five minutes per sessions to complete.',
        'level':{  
            'id':0,
            'name':'Beginner'
        },
        'totalNumberOfSets':78,
        'programTypeName':'5 x 5',
        'exercises':[  
            {  
              'id':0,
              'name':'Squat',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Bench Press',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Overhead Press',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Barbell Row',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':4,
              'name':'Deadlift',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Week One',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Barbell Row',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Barbell Row',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Week Two',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':3
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':4
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Barbell Row',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':5
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            }
        ],
        'default':true
      },
      {  
        'id':1,
        'description':'Smolov Junior is a shortened version of the Smolov squatting routine. This routine takes place four days a week and can often be used for bench press as an alternative to squats.',
        'level':{  
            'id':1,
            'name':'Intermediate'
        },
        'totalNumberOfSets':93,
        'programTypeName':'Smolov Junior',
        'exercises':[  
            {  
              'id':0,
              'name':'Squat',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Week One',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':6,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':6
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':7
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':8
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':10
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Week Two',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':6,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':6
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':7
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':8
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':10
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Week Three',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':6,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':6
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':7
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':8
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':10
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            }
        ],
        'default':true
      },
      {  
        'id':2,
        'description':'Smolov is a russian thirteen week squat training program. This program consists of five cycles including the phase in cycle, base cycle, switching phase, intense cycle and taper week. Note this program is for experts and is extremely challenging',
        'level':{  
            'id':2,
            'name':'Expert'
        },
        'totalNumberOfSets':195,
        'programTypeName':'Smolov',
        'exercises':[  
            {  
              'id':0,
              'name':'Squat',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Phase In (1)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':8,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':3
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':2,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':8,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':3
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':2,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':2,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Phase In (2)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':82.5,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Base Cycle (3)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':9,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':7,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':7
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':10
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Base Cycle (4)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':9,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':7,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':7
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':10
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':4,
              'name':'Base Cycle (5)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':9,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':7,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':7
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':2
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':10
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':5,
              'name':'Base Cycle (6)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':100,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':100,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':6,
              'name':'Intense Cycle (9)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':3
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':7,
              'name':'Intense Cycle (10)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':3
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':8,
              'name':'Intense Cycle (11)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':9,
              'name':'Intense Cycle (12)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':5
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':3
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':10,
              'name':'Taper (13)',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':2
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':3
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':4,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':4
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':100,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            }
        ],
        'default':true
      },
      {  
        'id':3,
        'description':'Jim Wendler 5/3/1 program starts with a relatively light weight percentage and consistently increases the weight percentage in order to hit new exercise repetitions personal records.',
        'level':{  
            'id':1,
            'name':'Intermediate'
        },
        'totalNumberOfSets':48,
        'programTypeName':'Wendler 5/3/1',
        'exercises':[  
            {  
              'id':0,
              'name':'Squat',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Bench Press',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Deadlift',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Overhead Press',
              'exerciseType':{  
                  'id':0,
                  'name':'Weighted'
              },
              'description':'',
              'confirmed':true
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Week One',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Week Two',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':80,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':90,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Week Three',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':75,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':3,
                                'oneRepMaxPercentage':85,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':1,
                                'oneRepMaxPercentage':95,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Week Four',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Squat',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Bench Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Deadlift',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':3,
                    'name':'Day Four',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':60,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':65,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Overhead Press',
                                    'exerciseType':{  
                                      'id':0,
                                      'name':'Weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':5,
                                'oneRepMaxPercentage':70,
                                'incrementMultiplier':0
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            }
        ],
        'default':true
      },
      {  
        'id':4,
        'description':'4 week power abs aims to slim your waist by getting rid of the \'flab\' along with build deep core abdominal muscle.',
        'level':{  
            'id':1,
            'name':'Intermediate'
        },
        'totalNumberOfSets':77,
        'programTypeName':'4 Week Power Abs',
        'exercises':[  
            {  
              'id':0,
              'name':'Reverse Crunch',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Crunch',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Oblique Crunch',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Rope Crunch',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':4,
              'name':'Hanging Knee Raise',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':5,
              'name':'Oblique Crossover Crunch',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':6,
              'name':'Double Crunch',
              'exerciseType':{  
                  'id':1,
                  'name':'Non-weighted'
              },
              'description':'',
              'confirmed':true
            },
            {  
              'id':7,
              'name':'Treadmil',
              'exerciseType':{  
                  'id':2,
                  'name':'Cardio'
              },
              'description':'',
              'confirmed':true
            }
        ],
        'weeks':[  
            {  
              'id':0,
              'name':'Week One',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':10
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':1,
              'name':'Week Two',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':12
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':2,
              'name':'Week Three',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':5,
                                    'name':'Oblique Crossover Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':6,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':5,
                                    'name':'Oblique Crossover Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':6,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':5,
                                    'name':'Oblique Crossover Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':15
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':6,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            },
            {  
              'id':3,
              'name':'Week Four',
              'days':[  
                  {  
                    'id':0,
                    'name':'Day One',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':6,
                                    'name':'Double Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':6,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':1,
                    'name':'Day Two',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':6,
                                    'name':'Double Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':5,
                                    'name':'Oblique Crossover Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':6,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':7,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  },
                  {  
                    'id':2,
                    'name':'Day Three',
                    'sets':[  
                        {  
                          'id':0,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':4,
                                    'name':'Hanging Knee Raise',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':1,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':0,
                                    'name':'Reverse Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':2,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':6,
                                    'name':'Double Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':3,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':1,
                                    'name':'Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':4,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':2,
                                    'name':'Oblique Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':5,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':5,
                                    'name':'Oblique Crossover Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':6,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':3,
                                    'name':'Rope Crunch',
                                    'exerciseType':{  
                                      'id':1,
                                      'name':'Non-weighted'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'numberOfReps':20
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        },
                        {  
                          'id':7,
                          'exercises':[  
                              {  
                                'id':0,
                                'confirmed':false,
                                'exercise':{  
                                    'id':7,
                                    'name':'Treadmil',
                                    'exerciseType':{  
                                      'id':2,
                                      'name':'Cardio'
                                    },
                                    'description':'',
                                    'confirmed':true
                                },
                                'minutes':30,
                                'seconds':0,
                                'duration':'30:00',
                                'numberOfReps':1
                              }
                          ],
                          'confirmed':true,
                          'complete':false,
                          'setType':{  
                              'id':0,
                              'name':'Normal'
                          },
                          'numberOfSets':1
                        }
                    ],
                    'confirmed':true
                  }
              ],
              'confirmed':true
            }
        ],
        'default':true
      }
    ];

    contract.getDefaultProgramTypes = function(){
      return defaultProgramTypes;
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.unitService
 * @description
 * # unitService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('unitService', ['utilService', 'storageService', 'keyHandlerService', function (utilService, storageService, keyHandlerService) {
    var contract = {
      currentUnit: 'kilograms',
      unitMap: {
        'kilograms': {
          name: 'kilograms',
          textName: 'kgs',
          interval: 2.5,
          conversion: 2.20462,
          conversionInterval: 5
        },
        'pounds': {
          name: 'pounds',
          textName: 'lbs',
          interval: 5,
          conversion: 0.453592,
          conversionInterval: 2.5
        }
      }
    };

    var init = function(){
      contract.currentUnit = getUnitFromStorage();
    };

    contract.reset = function(){
      contract.changeUnit('kilograms');
    };

    contract.changeUnit = function(key){
      contract.currentUnit = key;
      storeUnit();
    };

    contract.getUnits = function(){
      return Object.keys(contract.unitMap).map(function(unit){
        return contract.unitMap[unit];
      });
    };

    contract.getCurrentUnit = function(){
      return contract.unitMap[contract.currentUnit];
    };

    contract.convert = function(key, weight){
      var unit = contract.unitMap[key];
      return utilService.round(weight * unit.conversion, 1, unit.conversionInterval);
    };

    var getUnitFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.unit, 'kilograms');
    };

    var storeUnit = function(){
      storageService.storeValue(keyHandlerService.keys.unit, contract.currentUnit);
    };

    init();

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.dashboardService
 * @description
 * # dashboardService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('dashboardService', ['programService', 'recentlyActiveService', function (programService, recentlyActiveService) {
    var contract = {
      completedHeaderText: 'Programs',
      completedHighlightText: programService.getCompletedPrograms().length,
      completedHighlightColor: 'green-500',
      completeSubheadText: 'complete',
      
      activeHeaderText: 'Programs',
      activeHighlightText: programService.getActivePrograms().length,
      activeHighlightColor: 'deep-orange-500',
      activeSubheadText: 'active',
      
      quickCompleteProgram: recentlyActiveService.getRecentlyActive()
    };

    contract.getCompletedPrograms = function(){
      var completedPrograms = programService.getCompletedPrograms().length;
      if(changed(contract.completedHighlightText, completedPrograms)){
        contract.completedHighlightText = completedPrograms;
      }
      return completedPrograms;
    };

    contract.getActivePrograms = function(){
      var activePrograms = programService.getActivePrograms();
      if(changed(contract.activeHighlightText, activePrograms.length)){
        contract.activeHighlightText = activePrograms.length;
      }
      return activePrograms;
    };

    contract.getQuickCompleteProgram = function(){
      var quickCompleteProgram = recentlyActiveService.getRecentlyActive();
      if(changed(contract.quickCompleteProgram, quickCompleteProgram)){
        contract.quickCompleteProgram = quickCompleteProgram;
      }
      return quickCompleteProgram;
    };

    var changed = function(value1, value2){
      return value1 !== value2;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:highlightCard
 * @description
 * # highlightCard
 */
angular.module('powerHouseApp')
  .directive('highlightCard', function () {
    return {
      templateUrl: 'scripts/directives/highlightCard/highlightCardView.html',
      restrict: 'E',
      scope: {
        headerText: '=',
        highlightText: '=',
        highlightColor: '=',
        subheadText: '='
      },
      link: function postLink() {
        
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:quickComplete
 * @description
 * # quickComplete
 */
angular.module('powerHouseApp')
  .directive('quickComplete', ['utilService', 'quickCompleteService', '$location', function (utilService, quickCompleteService, $location) {
    return {
      templateUrl: 'scripts/directives/quickComplete/quickCompleteView.html',
      restrict: 'E',
      scope: {
        quickCompleteProgram: '='
      },
      link: function postLink(scope) {

        scope.helpTemplateUrl = quickCompleteService.helpTemplateUrl;
        scope.buttonText = 'Programs';

        scope.defined = function(){
          return quickCompleteService.defined(scope.quickCompleteProgram);
        };

        scope.calculatePercentageComplete = function(day){
          quickCompleteService.updateProgramComplete(scope.quickCompleteProgram, day);
        };

        scope.buttonClicked = function(){
          $location.path('program-list');
        };

        scope.$watch(function(){
          return scope.quickCompleteProgram;
        }, function(){
          if(scope.defined(scope.quickCompleteProgram) === true){
            var data = quickCompleteService.getNextSetData(scope.quickCompleteProgram);
            scope.week = data.week;
            scope.day = data.day;
            scope.set = data.set;
            scope.exercises = data.exercises;
          }
        }, true);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.quickCompleteService
 * @description
 * # quickCompleteService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('quickCompleteService', ['utilService', 'unitService', 'programService', function (utilService, unitService, programService) {
    var contract = {
      helpTemplateUrl: 'scripts/directives/quickComplete/quickCompleteHelpTemplate.html',
    };

    contract.defined = function(quickCompleteProgram){
      return (utilService.isDefined(quickCompleteProgram) && !angular.equals(quickCompleteProgram, {}));
    };

    contract.getNextSetData = function(quickCompleteProgram){
      var nextSet = findNextSet(quickCompleteProgram);
      return {
        week: nextSet.week,
        day: nextSet.day,
        set: nextSet.set,
        exercises: nextSet.set.exercises
      };
    };

    contract.updateProgramComplete = function(program, day){
      programService.updateProgramComplete(program, day);
    };

    var findNextSet = function(program){
      for(var i = 0; i < program.weeks.length; i++){
        var week = program.weeks[i];
        for(var y = 0; y < week.days.length; y++){
          var day = week.days[y];
          for(var z = 0; z < day.sets.length; z++){
            var set = day.sets[z];
            if(set.complete === false){
              return {                
                week: week,
                day: day,
                set: set
              };
            }
          }
        }
      }
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.recentlyActiveService
 * @description
 * # recentlyActiveService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('recentlyActiveService', ['utilService', 'storageService', 'keyHandlerService', function (utilService, storageService, keyHandlerService) {
    var contract = {
      recentlyActive: {},
      removedProgram: {}
    };

    var init = function(){
      contract.recentlyActive = getRecentlyActiveFromStorage();
    };

    contract.reset = function(){
      contract.updateRecentlyActive({});
    };

    contract.getRecentlyActive = function(){
      return contract.recentlyActive;
    };

    contract.updateRecentlyActive = function(recentlyActive){
      var mostRecent = {};

      // Not Complete
      if(defined(recentlyActive) && recentlyActive.complete === false){
        mostRecent = recentlyActive;
      }

      contract.recentlyActive = mostRecent;
      storeRecentlyActive();
    };

    contract.undoRemove = function(){
      contract.recentlyActive = contract.removedProgram;
      contract.removedProgram = {};
    };

    contract.removeProgram = function(program){
      if(contract.recentlyActive.id === program.id){
        contract.removedProgram = program;
        contract.updateRecentlyActive({});
      }
    };

    contract.nextActive = function(programs){
      if(programs.length === 0){
        return {};
      }
      // Can later make this more intelligent to tell which one of the
      // active programs was the next most active
      return programs[0];
    };

    contract.currentlyActive = function(){
      return defined(contract.recentlyActive);
    };

    var defined = function(recentlyActive){
      return (utilService.isDefined(recentlyActive) && !angular.equals(recentlyActive, {}));
    };

    var getRecentlyActiveFromStorage = function(){
      return storageService.getValueOrDefault(keyHandlerService.keys.recentlyActive, {});
    };

    var storeRecentlyActive = function(){
      storageService.storeValue(keyHandlerService.keys.recentlyActive, contract.recentlyActive);
    };

    init();

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.helpService
 * @description
 * # helpService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('helpService', ['$mdDialog', function ($mdDialog) {
    var contract = {};

    contract.display = function(templateUrl){
      $mdDialog.show({
        controller: 'dialogController',
        templateUrl: templateUrl,
        ariaLabel: 'Help Dialog',
        clickOutsideToClose: true
      });
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:help
 * @description
 * # help
 */
angular.module('powerHouseApp')
  .directive('help', ['helpService', function (helpService) {
    return {
      templateUrl: 'scripts/directives/help/helpView.html',
      restrict: 'E',
      scope: {
        templateUrl: '='
      },
      link: function postLink(scope) {
        scope.display = function(){
          helpService.display(scope.templateUrl);
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:DialogcontrollerCtrl
 * @description
 * # DialogcontrollerCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('dialogController', ['$scope', '$mdDialog', function ($scope, $mdDialog) {
    $scope.ariaLabel = 'Dialog';
    $scope.hideDialog = function(){
      $mdDialog.hide();
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:bottomNavigationBar
 * @description
 * # bottomNavigationBar
 */
angular.module('powerHouseApp')
  .directive('bottomNavigationBar', function () {
    return {
      templateUrl: 'scripts/directives/bottomNavigationBar/bottomNavigationBarView.html',
      restrict: 'E',
      link: function postLink() {
        
      }
    };
  });

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('SettingsCtrl', function () {
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:weightUnitSetting
 * @description
 * # weightUnitSetting
 */
angular.module('powerHouseApp')
  .directive('weightUnitSetting', ['weightUnitSettingService', 'unitService', function (weightUnitSettingService, unitService) {
    return {
      templateUrl: 'scripts/directives/weightUnitSetting/weightUnitSettingView.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.units = weightUnitSettingService.getUnits();
        scope.currentUnit = weightUnitSettingService.getCurrentUnit();

        scope.$watch(function(){
          return scope.currentUnit;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            weightUnitSettingService.changeUnit(newValue);
          }
        }, true);

        scope.$watch(function(){
          return unitService.currentUnit;
        }, function(newValue, oldValue){
          if(newValue !== oldValue && scope.currentUnit.name !== newValue){
            scope.currentUnit = weightUnitSettingService.getCurrentUnit();
          }
        });

      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.weightUnitSettingService
 * @description
 * # weightUnitSettingService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('weightUnitSettingService', ['unitService', 'programService', function (unitService, programService) {
    var contract = {};

    contract.changeUnit = function(unit){
      unitService.changeUnit(unit.name);
      programService.convertPrograms();
    };

    contract.getUnits = function(){
      return angular.copy(unitService.getUnits());
    };

    contract.getCurrentUnit = function(){
      return angular.copy(unitService.getCurrentUnit());
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programConversionService
 * @description
 * # programConversionService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programConversionService', ['utilService', 'unitService', function (utilService, unitService) {
    var contract = {};

    contract.convertPrograms = function(programs){
      return programs.map(function(program){
        if(utilService.isDefined(program.unit)){
          return convertProgram(program);
        }
      });
    };

    var convertProgram = function(program){
      var unit = unitService.getCurrentUnit();

      var convertedProgram = angular.copy(program);

      if(utilService.isDefined(convertedProgram.unit) && convertedProgram.unit !== unit.name){
        convertedProgram.increment = convertIncrement(convertedProgram.unit, convertedProgram.increment);
        convertedProgram.exercises = convertExercises(convertedProgram.unit, convertedProgram.exercises);
        convertedProgram.weeks = convertWeeks(convertedProgram.unit, convertedProgram.weeks);
        convertedProgram.unit = unit.name;
      }

      return convertedProgram;
    };

    var convertIncrement = function(key, increment){
      return unitService.convert(key, increment);
    };

    var convertExercises = function(key, exercises){
      return exercises.map(function(exercise){
        exercise.oneRepMax = unitService.convert(key, exercise.oneRepMax);
        return exercise;
      });
    };

    var convertWeeks = function(key, weeks){
      return weeks.map(function(week){
        week.days = week.days.map(function(day){
          day.sets = day.sets.map(function(set){
            set.exercises = set.exercises.map(function(setExercise){
              setExercise.weight = unitService.convert(key, setExercise.weight);
              return setExercise;
            });
            return set;
          });
          return day;
        });
        return week;
      }); 
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.adWeightService
 * @description
 * # adWeightService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('adWeightService', function () {
    var contract = {};

    contract.weights = {
      'addProgram': 20,
      'addProgramType': 20,
      'editProgram': 20,
      'editProgramType': 20,
      'completeProgram': 20,
      'completeDay': 20
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.adTriggerService
 * @description
 * # adTriggerService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('adTriggerService', function () {
    var contract = {
      threshold: 20,
      count: 0
    };

    contract.incrementCount = function(weight){
      contract.count += weight;
      if(thresholdMet(contract.threshold, contract.count)){
        contract.count = 0;
        prepareAd();
        showAd();
      }
    };

    var thresholdMet = function(threshold, count){
      return count >= threshold;
    };

    var prepareAd = function(){
      
    };

    var showAd = function(){
      console.log('SHOW AD');
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.sideNavigationService
 * @description
 * # sideNavigationService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('sideNavigationService', ['$mdSidenav', function ($mdSidenav) {
    var contract = {};

    contract.toggleSidenav = function(id){
      $mdSidenav(id).toggle();
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.navigationBarService
 * @description
 * # navigationBarService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('navigationBarService', ['sideNavigationService', function (sideNavigationService) {
    var contract = {
      id: 'sidenav',
      sideMenuItems: [
        {
          text: 'Settings',
          icon: 'images/icons/settingsBlack.svg',
          href: '#/settings'
        },
        {
          text: 'Help',
          icon: 'images/icons/info.svg',
          href: '#/help'
        },
        {
          text: 'Upgrade',
          icon: 'images/icons/moneyBlack.svg',
          href: '#/upgrade'
        },
        {
          text: 'Contact',
          icon: 'images/icons/email.svg',
          href: '#/contact'
        },
        {
          text: 'ORM Calculator',
          icon: 'images/icons/percent.svg',
          href: '#/one-rep-max-calculator'
        }  
      ]
    };

    contract.toggleSidenav = function(){
      sideNavigationService.toggleSidenav(contract.id);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:UpgradeCtrl
 * @description
 * # UpgradeCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('UpgradeCtrl', function () {
  });

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('ContactCtrl', ['$scope', function ($scope) {
    $scope.email = 'tylangesmith1995@gmail.com';
  }]);
'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('HelpCtrl', function () {
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:resetSetting
 * @description
 * # resetSetting
 */
angular.module('powerHouseApp')
  .directive('resetSetting', ['resetSettingService', function (resetSettingService) {
    return {
      templateUrl: 'scripts/directives/resetSetting/resetSettingView.html',
      restrict: 'E',
      link: function postLink(scope) {
        scope.helpResetSetting = resetSettingService.helpResetSetting;

        scope.resetClicked = function(){
          resetSettingService.resetClicked();
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.resetSettingService
 * @description
 * # resetSettingService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('resetSettingService', ['$mdDialog', 'programService', 'programTypeService', 'recentlyActiveService', 'unitService', 'storageService', function ($mdDialog, programService, programTypeService, recentlyActiveService, unitService, storageService) {
    var contract = {
      helpResetSetting: 'scripts/directives/resetSetting/helpResetSetting.html'
    };

    contract.resetClicked = function(){
      var confirm = $mdDialog.confirm()
        .title('Reset')
        .textContent('Are you sure you want to reset, this action cannot be undone.')
        .ariaLabel('Reset')
        .ok('Reset')
        .cancel('Cancel');

        $mdDialog.show(confirm)
          .then(function(){
          reset();
        });
    };

    var reset = function(){
      programService.reset();
      programTypeService.reset();
      recentlyActiveService.reset();
      unitService.reset();
      storageService.reset();
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:dashboardProgramList
 * @description
 * # dashboardProgramList
 */
angular.module('powerHouseApp')
  .directive('dashboardProgramList', [function () {
    return {
      templateUrl: 'scripts/directives/dashboardProgramList/dashboardProgramListView.html',
      restrict: 'E',
      scope: {
        programs: '='
      },
      link: function postLink(scope) {
        scope.emptyListMessage = 'No currently active programs';
        scope.emptyListButtonText = 'Add Program';
        scope.emptyListButtonList = '#/add-program';
        scope.helpActiveProgramListUrl = 'scripts/directives/dashboardProgramList/helpDashboardProgramListTemplate.html';
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:listEmpty
 * @description
 * # listEmpty
 */
angular.module('powerHouseApp')
  .directive('listEmpty', function () {
    return {
      templateUrl: 'scripts/directives/listEmpty/listEmptyView.html',
      restrict: 'E',
      scope: {
        message: '=',
        buttonText: '=',
        buttonLink: '='
      },
      link: function postLink() {
        
      }
    };
  });

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programTypeLevelService
 * @description
 * # programTypeLevelService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programTypeLevelService', function () {
    var contract = {};
    
    var levels = [
      { id: 0, name: 'Beginner' },
      { id: 1, name: 'Intermediate' },
      { id: 2, name: 'Expert' }
    ];

    contract.getLevels = function(){
      return levels;
    };

    contract.getDefault = function(){
      return levels[0];
    };

    contract.getLevelById = function(id){
      for(var i = 0; i < levels.length; i++){
        var level = levels[i];
        if(level.id === id){
          return level; 
        }
      }     
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:listFilter
 * @description
 * # listFilter
 */
angular.module('powerHouseApp')
  .directive('listFilter', ['listFilterService', function (listFilterService) {
    return {
      templateUrl: 'scripts/directives/listFilter/listFilterView.html',
      restrict: 'E',
      scope: {
        values: '=',
        originalValues: '=',
        property: '='
      },
      link: function postLink(scope) {

        scope.filterValue = '';

        scope.$watch(function(){
          return scope.filterValue;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.values = listFilterService.filter(scope.originalValues, scope.filterValue, scope.property);
          }
        });

        scope.clear = function(){
          scope.filterValue = '';
        };
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:orderList
 * @description
 * # orderList
 */
angular.module('powerHouseApp')
  .directive('orderList', ['utilService', 'orderListService', function (utilService, orderListService) {
    return {
      templateUrl: 'scripts/directives/orderList/orderListView.html',
      restrict: 'E',
      scope: {
        key: '=',
        reverseKey: '=',
        orderValues: '=',
        originalValues: '=',
        values: '='
      },
      link: function postLink(scope) {
        // Get default / persisted values
        scope.reversed = orderListService.getReversedValue(scope.reverseKey);
        scope.selectedOrder = orderListService.getOrderValue(scope.key);
        scope.lastSelected = scope.selectedOrder;

        // If orderChanges
        scope.$watch(function(){
          return scope.selectedOrder;
        }, function(newValue, oldValue){
          // Check that we have a change
          if(newValue !== oldValue){
            // Check that the selectedOrder is different to the stored one 
            if(scope.selectedOrder.text !== orderListService.getOrderValue(scope.key).text){
              orderListService.orderValueChanged(scope.key, scope.selectedOrder);
              scope.reversed = false;
              scope.values = orderListService.orderBy(scope.selectedOrder, scope.originalValues, scope.reversed);
              scope.lastSelected = scope.selectedOrder;
            }
            else if(scope.selectedOrder.text === orderListService.getOrderValue(scope.key).text){
              // sort the values
              scope.values = orderListService.orderBy(scope.selectedOrder, scope.originalValues, scope.reversed);
            }
          }
        });

        scope.$watch(function(){
          return scope.reversed;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            if(scope.reversed !== orderListService.getReversedValue(scope.reverseKey)){
              orderListService.orderValueReverseChanged(scope.reverseKey, scope.reversed);
            }
          }
        });

        scope.reverse = function(){
          scope.reversed = !scope.reversed;
          scope.values = orderListService.orderBy(scope.selectedOrder, scope.originalValues, scope.reversed);
        };

        scope.$watch(function(){
          return scope.originalValues;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.values = orderListService.orderBy(scope.selectedOrder, scope.originalValues, scope.reversed);
          }
        });
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.orderListService
 * @description
 * # orderListService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('orderListService', ['$filter', 'utilService', 'storageService', function ($filter, utilService, storageService) {
    var contract = {
      defaultValue: {
        prop: 'id',
        text: 'None'
      }
    };

    contract.getOrderByValues = function(values){
      return [contract.defaultValue].concat(values);
    };

    contract.getOrderValue = function(key){
      return getOrderValueFromStorage(key);
    };

    contract.getReversedValue = function(key){
      return getReversedFromStorage(key);
    };

    contract.orderBy = function(selectedOrder, values, reverse){
      if(utilService.isDefined(selectedOrder.comparator)){
        return $filter('orderBy')(values, selectedOrder.prop, reverse, selectedOrder.comparator);  
      }
      return $filter('orderBy')(values, selectedOrder.prop, reverse);
    };

    contract.orderValueChanged = function(key, value){
      storeOrderValue(key, value);
    };

    contract.orderValueReverseChanged = function(key, value){
      storeReversedValue(key, value);
    };

    var getOrderValueFromStorage = function(key){
      return storageService.getValueOrDefault(key, contract.defaultValue);
    };


    var getReversedFromStorage = function(key){
      return storageService.getValueOrDefault(key, false);
    };

    var storeOrderValue = function(key, value){
      storageService.storeValue(key, value);
    };

    var storeReversedValue = function(key, value){
      storageService.storeValue(key, value);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.listFilterService
 * @description
 * # listFilterService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('listFilterService', ['$filter', function ($filter) {
    var contract = {};

    contract.filter = function(originalValues, filterValue, property){
      return $filter('filter')(originalValues, combinedPropertyAndFilterValue(filterValue, property));
    };

    var combinedPropertyAndFilterValue = function(filterValue, property){
      var rObject = {};
      rObject[property] = filterValue;
      return rObject;
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.programCompleteService
 * @description
 * # programCompleteService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('programCompleteService', ['toastService', 'adTriggerService', 'adWeightService', function (toastService, adTriggerService, adWeightService) {
    var contract = {};

    contract.programComplete = function(completeProgram){
      toastService.showProgramCompleteToast('Well done, ' + completeProgram.name + ' complete', programCompleteAdFunction);
    };

    contract.dayComplete = function(day){
      toastService.showProgramCompleteToast('Well done, ' + day.name + ' complete', dayCompleteAdFunction);
    };

    var programCompleteAdFunction = function(){
      adTriggerService.incrementCount(adWeightService.weights.completeProgram);
    };

    var dayCompleteAdFunction = function(){
      adTriggerService.incrementCount(adWeightService.weights.completeDay);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.setTypeService
 * @description
 * # setTypeService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('setTypeService', function () {
    var contract = {};

    contract.types = [
      {
        id: 0,
        name: 'Normal'
      },
      {
        id: 1,
        name: 'Superset'
      },
    ];

    contract.getDefault = function(){
      return contract.types[0];
    };

    return contract;
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetType
 * @description
 * # addProgramTypeSetType
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetType', ['setTypeService', function (setTypeService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/setInformation/addProgramTypeSetTypeView.html',
      restrict: 'E',
      scope: {
        setType: '='
      },
      link: function postLink(scope) {
        scope.setTypes = setTypeService.types;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetTypeNormal
 * @description
 * # addProgramTypeSetTypeNormal
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetTypeNormal', ['addProgramTypeSetTypeNormalService', function (addProgramTypeSetTypeNormalService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeNormalView.html',
      restrict: 'E',
      scope: {
        exercises: '=',
        set: '='
      },
      link: function postLink(scope) {

        var init = function(){
          scope.set.exercises = addProgramTypeSetTypeNormalService.initSetExercise(scope.set.exercises);
        };

        init();
      }
    };
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetExerciseWeighted
 * @description
 * # addProgramTypeSetExerciseWeighted
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetExerciseWeighted', function () {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseWeightedView.html',
      restrict: 'E',
      scope: {
        setExercise: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetExerciseSelect
 * @description
 * # addProgramTypeSetExerciseSelect
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetExerciseSelect', function () {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/setInformation/addProgramTypeSetExerciseSelectView.html',
      restrict: 'E',
      scope: {
        exercises: '=',
        exercise: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetNumberOfSets
 * @description
 * # addProgramTypeSetNumberOfSets
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetNumberOfSets', function () {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/setInformation/addProgramTypeSetNumberOfSetsView.html',
      restrict: 'E',
      scope: {
        numberOfSets: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetExerciseNonWeighted
 * @description
 * # addProgramTypeSetExerciseNonWeighted
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetExerciseNonWeighted', function () {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseNonWeightedView.html',
      restrict: 'E',
      scope: {
        setExercise: '='
      },      
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetExerciseCardio
 * @description
 * # addProgramTypeSetExerciseCardio
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetExerciseCardio', function () {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseCardioView.html',
      restrict: 'E',
      scope: {
        setExercise: '='
      },
      link: function postLink() {
      }
    };
  });

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:addProgramTypeSetTypeSuperset
 * @description
 * # addProgramTypeSetTypeSuperset
 */
angular.module('powerHouseApp')
  .directive('addProgramTypeSetTypeSuperset', ['addProgramTypeSetTypeSupersetService', function (addProgramTypeSetTypeSupersetService) {
    return {
      templateUrl: 'scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeSupersetView.html',
      restrict: 'E',
      scope: {
        exercises: '=',
        set: '='
      },
      link: function postLink(scope) {

        scope.remove = addProgramTypeSetTypeSupersetService.remove;
        scope.edit = addProgramTypeSetTypeSupersetService.edit;
        scope.duplicate = addProgramTypeSetTypeSupersetService.duplicate;
        scope.move = addProgramTypeSetTypeSupersetService.move;

        var init = function(){
          scope.set.exercises = addProgramTypeSetTypeSupersetService.initSetExercise(scope.set.exercises);
        };

        scope.addSuperset = function(){
          scope.set.exercises = addProgramTypeSetTypeSupersetService.addSuperset(scope.set.exercises);
        };

        scope.editSetExercise = function(setExercise){
          setExercise.confirmed = false;
        };

        scope.duplicateSetExercise = function(setExercise){
          scope.set.exercises = addProgramTypeSetTypeSupersetService.duplicateSetExercise(scope.set.exercises, setExercise);
        };

        scope.moveSetExercise = function(setExercise, direction){
          scope.set.exercises = addProgramTypeSetTypeSupersetService.moveSetExercise(scope.set.exercises, setExercise, direction);
        };

        scope.confirmSetExercise = function(setExercise){
          setExercise.confirmed = true;
        };

        scope.removeSetExercise = function(setExercise){
          scope.set.exercises = addProgramTypeSetTypeSupersetService.removeSuperset(scope.set.exercises, setExercise);
        };

        scope.isInvalid = function(setExercise){
          return addProgramTypeSetTypeSupersetService.isInvalid(setExercise);
        };

        scope.hasConfirmed = function(){
          return addProgramTypeSetTypeSupersetService.hasConfirmed(scope.set.exercises);
        };

        scope.$watch(function(){
          return addProgramTypeSetTypeSupersetService.superSets;
        }, function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.set.exercises = addProgramTypeSetTypeSupersetService.superSets;
          }
        });

        init();
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramSetTypeSupersetService
 * @description
 * # addProgramSetTypeSupersetService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeSetTypeSupersetService', ['utilService', 'addProgramTypeSetService', 'addProgramTypeSetExerciseService', 'toastService', function (utilService, addProgramTypeSetService, addProgramTypeSetExerciseService, toastService) {
    var contract = {
      remove: true,
      edit: true,
      duplicate: true,
      move: true,
      superSets: []
    };

    contract.initSetExercise = function(setExercises){
      return setExercises.filter(function(setExercise){
        return setExercise.confirmed === true;
      });
    };

    contract.addSuperset = function(setExercises){
      return addProgramTypeSetExerciseService.addSetExercise(setExercises);
    };

    contract.removeSuperset = function(setExercises, setExercise){
      var tempExerciseSetsArray = angular.copy(setExercises);
      toastService.showUndoToast('Superset removed', function(){
        contract.superSets = tempExerciseSetsArray;
      });

      return addProgramTypeSetExerciseService.removeSetExercise(setExercises, setExercise);
    };

    contract.duplicateSetExercise = function(setExerciseArray, setExercise){
      var newSetExercise = angular.copy(setExercise);
      newSetExercise.id = utilService.getUniqueId(setExerciseArray);
      setExerciseArray.push(newSetExercise);
      return setExerciseArray;
    };

    contract.moveSetExercise = function(setExerciseArray, setExercise, direction){
      var moveFunctions = {
        up: function(rArray, setExercise, index){
          if(index !== -1 && index !== 0){
            rArray[index] = rArray[index - 1];
            rArray[index - 1] = setExercise;
          }
          return rArray;
        },
        down: function(rArray, setExercise, index){
          if(index !== -1 && index !== (rArray.length - 1)){
            rArray[index] = rArray[index + 1];
            rArray[index + 1] = setExercise;
          }
          return rArray;
        }
      }

      var rArray = setExerciseArray;

      var index = setExerciseArray.findIndex(function(element){
        return element.id === setExercise.id;
      });
    
      return moveFunctions[direction](rArray, setExercise, index);
    };

    contract.hasConfirmed = function(setExercises){
      for(var i = 0; i < setExercises.length; i++){
        if(setExercises[i].confirmed === true){
          return true;
        }
      }
      return false;  
    };

    contract.isInvalid = function(setExercise){
      return addProgramTypeSetService.setExerciseTypesInvalid(setExercise);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeSetTypeNormalService
 * @description
 * # addProgramTypeSetTypeNormalService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeSetTypeNormalService', ['addProgramTypeSetExerciseService', function (addProgramTypeSetExerciseService) {
    var contract = {};

    contract.initSetExercise = function(setExercises){
      if(setExercises.length > 0){
        return setExercises;
      }
      return addProgramTypeSetExerciseService.addSetExercise(setExercises);
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.addProgramTypeSetExerciseService
 * @description
 * # addProgramTypeSetExerciseService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('addProgramTypeSetExerciseService', ['utilService', function (utilService) {
    var contract = {};

    contract.addSetExercise = function(setExerciseArray){
      setExerciseArray.push(generateSetExercise(utilService.getUniqueId(setExerciseArray)));
      return setExerciseArray;
    };

    contract.removeSetExercise = function(setExerciseArray, setExercise){
      return utilService.removeFromArray(setExerciseArray, setExercise);
    };

    var generateSetExercise = function(id){
      return {
        id: id,
        confirmed: false,
        exercise: {},
      };
    };

    return contract;
  }]);

'use strict';

/**
 * @ngdoc function
 * @name powerHouseApp.controller:OnerepmaxcalculatorCtrl
 * @description
 * # OnerepmaxcalculatorCtrl
 * Controller of the powerHouseApp
 */
angular.module('powerHouseApp')
  .controller('OneRepMaxCalculatorCtrl', ['$scope', 'oneRepMaxCalculatorService', function ($scope, oneRepMaxCalculatorService) {
    var init = function(){
      oneRepMaxCalculatorService.reset();
      $scope.weightLifted = '';
      $scope.numberOfReps = '';
      $scope.oRMPercentages = oneRepMaxCalculatorService.getORMPercentages();
      $scope.unit = oneRepMaxCalculatorService.getUnit();
      $scope.helpOneRepMaxCalculatorUrl = oneRepMaxCalculatorService.helpOneRepMaxCalculatorUrl;
    };

    $scope.$watchGroup([
      'weightLifted',
      'numberOfReps'
    ], function(newValues, oldValues){
      if(newValues !== oldValues){
        oneRepMaxCalculatorService.calculateORMPercentages(newValues[0], newValues[1]);
      }
    });

    $scope.$watch(function(){
      return oneRepMaxCalculatorService.getUnit();
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        $scope.unit = oneRepMaxCalculatorService.getUnit();
      }
    });

    $scope.$watchCollection(function(){
      return oneRepMaxCalculatorService.getORMPercentages();
    }, function(newValue, oldValue){
      if(newValue !== oldValue){
        $scope.oRMPercentages = oneRepMaxCalculatorService.getORMPercentages();
      }
    });

    init();
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.oneRepMaxCalculatorService
 * @description
 * # oneRepMaxCalculatorService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('oneRepMaxCalculatorService', ['utilService', 'unitService', function (utilService, unitService) {
    var contract = {
      helpOneRepMaxCalculatorUrl: 'views/helpOneRepMaxCalculator.html'
    };

    var init = function(){
      contract.reset();
    };

    contract.reset = function(){
      contract.oRMPercentages = [];
      for(var i = 100; i > 0; i = i - 5){
        contract.oRMPercentages.push({
          name: i + '% ORM',
          percentage: i / 100,
          value: 0
        })
      }
    };

    contract.getUnit = function(){
      return unitService.getCurrentUnit();
    };

    contract.getORMPercentages = function(){
      return contract.oRMPercentages;
    };

    contract.calculateORMPercentages = function(weightLifted, numberOfReps){
      var oRM = 0;
      if(valuesInvalid(weightLifted, numberOfReps) === false){
        oRM = calculateORM(weightLifted, numberOfReps);
      }
      
      contract.oRMPercentages = calculatePercentagesOfORM(oRM, contract.oRMPercentages);
    };

    var calculatePercentagesOfORM = function(oRM, percentages){
      return percentages.map(function(percentage){
        percentage.value = utilService.round((oRM * percentage.percentage), 0, 1);
        return percentage;
      });
    };

    var calculateORM = function(weightLifted, numberOfReps){
      return utilService.round((weightLifted / (1.0278 - (0.0278 * numberOfReps) )), 0, 1);
    };

    var valuesInvalid = function(weightLifted, numberOfReps){
      return (utilService.isUndefined(weightLifted) || !utilService.isNumber(weightLifted) || 
      weightLifted === '' || weightLifted <= 0 || utilService.isUndefined(numberOfReps) || 
      !utilService.isNumber(numberOfReps) || numberOfReps === '' || numberOfReps <= 0 || numberOfReps > 12);
    };

    init();

    return contract;
  }]);

'use strict';

/**
 * @ngdoc directive
 * @name powerHouseApp.directive:optionsButton
 * @description
 * # optionsButton
 */
angular.module('powerHouseApp')
  .directive('optionsButton', ['optionsButtonService', function (optionsButtonService) {
    return {
      templateUrl: 'scripts/directives/optionsButton/optionsButtonView.html',
      restrict: 'E',
      scope: {
        value: '=',
        remove: '=',
        removeFunction: '=',
        edit: '=',
        editFunction: '=',
        duplicate: '=',
        duplicateFunction: '=',
        move: '=',
        moveFunction: '='
      },
      link: function postLink(scope) {
        scope.direction = optionsButtonService.direction;
        scope.moving = false;
        scope.isOpen = false;

        scope.moveClicked = function(){
          scope.moving = true;
        };

        scope.moveDone = function(){
          scope.moving = false;
        };

        scope.moveUp = function(){
          scope.moveFunction(scope.value, 'up');
        };

        scope.moveDown = function(){
          scope.moveFunction(scope.value, 'down');
        };

      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name powerHouseApp.optionsButtonService
 * @description
 * # optionsButtonService
 * Service in the powerHouseApp.
 */
angular.module('powerHouseApp')
  .service('optionsButtonService', function () {
    var contract = {
      direction: 'left'
    };

    return contract;
  });

angular.module('powerHouseApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('index.html',
    "<!doctype html> <html> <head> <meta charset=\"utf-8\"> <title></title> <meta name=\"description\" content=\"\"> <meta name=\"viewport\" content=\"width=device-width\"> <!-- Place favicon.ico and apple-touch-icon.png in the root directory --> <!-- build:css(.) styles/vendor.css --> <!-- bower:css --> <link rel=\"stylesheet\" href=\"bower_components/angular-material/angular-material.css\"> <link rel=\"stylesheet\" href=\"bower_components/angular-material-expansion-panel/dist/md-expansion-panel.css\"> <!-- endbower --> <!-- endbuild --> <!-- build:css(.tmp) styles/main.css --> <link rel=\"stylesheet\" href=\"styles/main.css\"> <!-- endbuild --> </head> <body ng-app=\"powerHouseApp\"> <!--[if lte IE 8]>\r" +
    "\n" +
    "      <p class=\"browsehappy\">You are using an <strong>outdated</strong> browser. Please <a href=\"http://browsehappy.com/\">upgrade your browser</a> to improve your experience.</p>\r" +
    "\n" +
    "    <![endif]--> <!-- Add your site or application content here --> <div layout=\"column\" layout-fill> <navigation-bar></navigation-bar> <md-content flex=\"grow\"> <div ng-cloak ng-view></div> </md-content> <bottom-navigation-bar></bottom-navigation-bar> </div> <!-- Google Analytics: change UA-XXXXX-X to be your site's ID --> <script>!function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){\r" +
    "\n" +
    "       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),\r" +
    "\n" +
    "       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)\r" +
    "\n" +
    "       }(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\r" +
    "\n" +
    "\r" +
    "\n" +
    "       ga('create', 'UA-XXXXX-X');\r" +
    "\n" +
    "       ga('send', 'pageview');</script> <!-- build:js(.) scripts/vendor.js --> <!-- bower:js --> <script src=\"bower_components/angular/angular.js\"></script> <script src=\"bower_components/angular-animate/angular-animate.js\"></script> <script src=\"bower_components/angular-aria/angular-aria.js\"></script> <script src=\"bower_components/angular-cookies/angular-cookies.js\"></script> <script src=\"bower_components/angular-messages/angular-messages.js\"></script> <script src=\"bower_components/angular-resource/angular-resource.js\"></script> <script src=\"bower_components/angular-route/angular-route.js\"></script> <script src=\"bower_components/angular-sanitize/angular-sanitize.js\"></script> <script src=\"bower_components/angular-touch/angular-touch.js\"></script> <script src=\"bower_components/angular-material/angular-material.js\"></script> <script src=\"bower_components/angular-local-storage/dist/angular-local-storage.js\"></script> <script src=\"bower_components/angular-material-expansion-panel/dist/md-expansion-panel.js\"></script> <!-- endbower --> <!-- endbuild --> <!-- build:js({.tmp,app}) scripts/scripts.js --> <script src=\"scripts/app.js\"></script> <script src=\"scripts/directives/navigationBar/navigationBar.js\"></script> <script src=\"scripts/controllers/dashboard.js\"></script> <script src=\"scripts/controllers/programList.js\"></script> <script src=\"scripts/controllers/addProgram.js\"></script> <script src=\"scripts/controllers/addProgramType.js\"></script> <script src=\"scripts/controllers/programTypeList.js\"></script> <script src=\"scripts/services/addProgramTypeService.js\"></script> <script src=\"scripts/services/programTypeService.js\"></script> <script src=\"scripts/services/exerciseTypeService.js\"></script> <script src=\"scripts/services/utilService.js\"></script> <script src=\"scripts/directives/addRemove/addRemove.js\"></script> <script src=\"scripts/directives/addProgramType/addProgramType.js\"></script> <script src=\"scripts/directives/addProgramType/header/addProgramTypeHeader.js\"></script> <script src=\"scripts/directives/addProgramType/header/addProgramTypeHeaderService.js\"></script> <script src=\"scripts/directives/addProgramType/exercise/addProgramTypeExercise.js\"></script> <script src=\"scripts/directives/addProgramType/exercise/addProgramTypeExerciseService.js\"></script> <script src=\"scripts/directives/addProgramType/week/addProgramTypeWeek.js\"></script> <script src=\"scripts/directives/addProgramType/week/addProgramTypeWeekService.js\"></script> <script src=\"scripts/directives/addProgramType/day/addProgramTypeDay.js\"></script> <script src=\"scripts/directives/addProgramType/day/addProgramTypeDayService.js\"></script> <script src=\"scripts/directives/addProgramType/set/addProgramTypeSet.js\"></script> <script src=\"scripts/directives/addProgramType/set/addProgramTypeSetService.js\"></script> <script src=\"scripts/services/storageService.js\"></script> <script src=\"scripts/services/keyHandlerService.js\"></script> <script src=\"scripts/directives/programTypeList/programTypeList.js\"></script> <script src=\"scripts/directives/list/list.js\"></script> <script src=\"scripts/directives/programTypeList/programTypeListService.js\"></script> <script src=\"scripts/controllers/programTypeInformation.js\"></script> <script src=\"scripts/controllers/programInformation.js\"></script> <script src=\"scripts/services/programTypeInformationService.js\"></script> <script src=\"scripts/directives/addProgram/addProgram.js\"></script> <script src=\"scripts/directives/programList/programList.js\"></script> <script src=\"scripts/directives/addProgram/addProgramHeader.js\"></script> <script src=\"scripts/directives/addProgram/addProgramHeaderService.js\"></script> <script src=\"scripts/directives/addProgram/addProgramExerciseService.js\"></script> <script src=\"scripts/directives/addProgram/addProgramExercise.js\"></script> <script src=\"scripts/services/programService.js\"></script> <script src=\"scripts/directives/programList/programListService.js\"></script> <script src=\"scripts/services/programInformationService.js\"></script> <script src=\"scripts/controllers/editProgram.js\"></script> <script src=\"scripts/services/addProgramService.js\"></script> <script src=\"scripts/controllers/editProgramType.js\"></script> <script src=\"scripts/directives/messageCard/messageCard.js\"></script> <script src=\"scripts/services/toastService.js\"></script> <script src=\"scripts/services/defaultProgramTypeService.js\"></script> <script src=\"scripts/services/unitService.js\"></script> <script src=\"scripts/services/dashboardService.js\"></script> <script src=\"scripts/directives/highlightCard/highlightCard.js\"></script> <script src=\"scripts/directives/quickComplete/quickComplete.js\"></script> <script src=\"scripts/directives/quickComplete/quickCompleteService.js\"></script> <script src=\"scripts/services/recentlyActiveService.js\"></script> <script src=\"scripts/directives/help/helpService.js\"></script> <script src=\"scripts/directives/help/help.js\"></script> <script src=\"scripts/controllers/dialogController.js\"></script> <script src=\"scripts/directives/bottomNavigationBar/bottomNavigationBar.js\"></script> <script src=\"scripts/controllers/settings.js\"></script> <script src=\"scripts/directives/weightUnitSetting/weightUnitSetting.js\"></script> <script src=\"scripts/directives/weightUnitSetting/weightUnitSettingService.js\"></script> <script src=\"scripts/services/programconversionservice.js\"></script> <script src=\"scripts/services/adWeightService.js\"></script> <script src=\"scripts/services/adTriggerService.js\"></script> <script src=\"scripts/services/sideNavigationService.js\"></script> <script src=\"scripts/directives/navigationBar/navigationBarService.js\"></script> <script src=\"scripts/controllers/upgrade.js\"></script> <script src=\"scripts/controllers/contact.js\"></script> <script src=\"scripts/controllers/help.js\"></script> <script src=\"scripts/directives/resetSetting/resetSetting.js\"></script> <script src=\"scripts/directives/resetSetting/resetSettingService.js\"></script> <script src=\"scripts/directives/dashboardProgramList/dashboardProgramList.js\"></script> <script src=\"scripts/directives/listEmpty/listEmpty.js\"></script> <script src=\"scripts/services/programTypeLevelService.js\"></script> <script src=\"scripts/directives/listFilter/listFilter.js\"></script> <script src=\"scripts/directives/orderList/orderList.js\"></script> <script src=\"scripts/directives/orderList/orderListService.js\"></script> <script src=\"scripts/directives/listFilter/listFilterService.js\"></script> <script src=\"scripts/services/programcompleteservice.js\"></script> <script src=\"scripts/services/setTypeService.js\"></script> <script src=\"scripts/directives/addProgramType/set/setInformation/addProgramTypeSetType.js\"></script> <script src=\"scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeNormal.js\"></script> <script src=\"scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseWeighted.js\"></script> <script src=\"scripts/directives/addProgramType/set/setInformation/addProgramTypeSetExerciseSelect.js\"></script> <script src=\"scripts/directives/addProgramType/set/setInformation/addProgramTypeSetNumberOfSets.js\"></script> <script src=\"scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseNonWeighted.js\"></script> <script src=\"scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseCardio.js\"></script> <script src=\"scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeSuperset.js\"></script> <script src=\"scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeSupersetService.js\"></script> <script src=\"scripts/directives/addProgramType/set/setType/addprogramtypesettypenormalservice.js\"></script> <script src=\"scripts/services/addProgramTypeSetExerciseService.js\"></script> <script src=\"scripts/controllers/oneRepMaxCalculator.js\"></script> <script src=\"scripts/services/oneRepMaxCalculatorService.js\"></script> <script src=\"scripts/directives/optionsButton/optionsButton.js\"></script> <script src=\"scripts/directives/optionsButton/optionsButtonService.js\"></script> <!-- endbuild --> </body> </html>"
  );


  $templateCache.put('scripts/directives/addProgram/addProgramExerciseView.html',
    "<div layout=\"column\"> <md-card ng-if=\"exercises && exercises.length > 0\"> <md-card-header layout-align=\"none center\"> <md-card-header-text>Enter One Rep Max</md-card-header-text> <help template-url=\"helpAddProgramOneRepMaxUrl\"></help> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <form name=\"addProgramExerciseForm\" layout=\"column\"> <md-input-container ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\" ng-repeat=\"exercise in exercises\"> <label>{{exercise.name}}</label> <input name=\"programExerciseORM\" ng-model=\"exercise.oneRepMax\" type=\"number\" step=\"1\" min=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramExerciseForm.programExerciseORM.$error\"> <div ng-message=\"required\">A one rep max is required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> </form> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgram/addProgramHeaderView.html',
    "<div layout=\"column\"> <!-- Program Name and Program Type--> <md-card> <md-card-header layout-align=\"none center\"> <md-card-header-text>Add Program</md-card-header-text> <help template-url=\"helpAddProgramUrl\"></help> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <form name=\"addProgramForm\" layout=\"column\"> <md-input-container flex=\"100\" ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\"> <label>Program Name</label> <input name=\"programNameInput\" ng-model=\"programName\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramForm.programNameInput.$error\"> <div ng-message=\"required\">A program name is required.</div> </div> </md-input-container> <md-input-container ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\" flex=\"grow\"> <div layout=\"row\"> <div flex=\"grow\"> <label>Program Increment ({{unit.textName}})</label> <input name=\"programIncrement\" ng-model=\"increment\" type=\"number\" step=\"{{unit.interval}}\" min=\"0\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramForm.programIncrement.$error\"> <div ng-message=\"required\">A program increment is required.</div> <div ng-message=\"min\">A program increment cannot be less than 0.</div> </div> </div> <div> <help template-url=\"helpAddProgramProgramIncrementUrl\"></help> </div> </div> </md-input-container> <md-input-container ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-16' : true }\"> <md-select name=\"programType\" ng-model=\"programType\" placeholder=\"Select Program Type\" required md-no-asterisk=\"true\"> <md-option ng-repeat=\"type in programTypes\" ng-selected=\"programType.id === type.id\" ng-value=\"type\">{{type.programTypeName}}</md-option> </md-select> <div ng-messages=\"addProgramForm.programType.$error\"> <div ng-message=\"required\">A program type is required.</div> </div> </md-input-container> </form> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgram/addProgramView.html',
    "<div layout=\"column\"> <add-program-header program-name=\"programName\" program-type=\"programType\" increment=\"increment\"></add-program-header> <add-program-exercise exercises=\"exercises\"></add-program-exercise> <add-remove add-function=\"addFunction(programName, programType, increment, exercises)\" remove-function=\"removeFunction()\" invalid-function=\"invalidFunction(programName, programType, increment, exercises)\" name=\"'Program'\"></add-remove> </div>"
  );


  $templateCache.put('scripts/directives/addProgram/helpAddProgramOneRepMaxTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>One Rep Max</h3> <p>The maximum amount of weight that can be lifted in a single repetition for a given exercise.</p> <p>Not sure of your one rep max? Try the calculator by clicking the button below.</p> <div layout=\"row\" layout-align=\"center center\"> <md-button class=\"md-raised\" ng-href=\"#/one-rep-max-calculator\" ng-click=\"hideDialog()\">ORM Calculator</md-button> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgram/helpAddProgramProgramIncrementTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Program Increment</h3> <p>To build muscle progressive overloading is needed.</p> <p>This value will determine the gradual increase of weight added to each exercise that requires progressive overloading.</p> <div layout=\"column\"> <p>E.g. Bench Press, for 12 reps. Increment of 2.5kgs</p> <span flex>Week 1: Bench Press weight is 80kgs</span> <span flex>Week 2: Bench Press weight is 80kgs + 2.5kgs</span> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgram/helpAddProgramTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Add Program</h3> <p>A program is a fitness plan tailored to your fitness level.</p> <p>Once a program is created based off of a program type, you will be able to complete sets within the program maintaining track of your progress.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/addProgramTypeView.html',
    "<div layout=\"column\"> <add-program-type-header program-type-name=\"programTypeName\" level=\"level\" description=\"description\"></add-program-type-header> <add-program-type-exercise program-type-exercises=\"exercises\"></add-program-type-exercise> <add-program-type-week program-type-weeks=\"weeks\"></add-program-type-week> <add-remove add-function=\"addFunction(programTypeName, level, description, exercises, weeks)\" remove-function=\"removeFunction()\" name=\"'Type'\" invalid-function=\"invalidFunction(programTypeName, level, description, exercises, weeks)\"></add-remove> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/day/addProgramTypeDayView.html',
    "<div layout=\"column\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true, 'no-padding-bottom': true }\" layout-padding> <span class=\"md-subhead\">Days</span> <md-divider></md-divider> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"day in programTypeDays\" ng-if=\"day.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Name: {{day.name}}</h3> <h4>Total Sets: {{day.sets.length}}</h4> </div> <div layout=\"row\" class=\"md-secondary\"> <options-button value=\"day\" remove=\"remove\" remove-function=\"removeDay\" edit=\"edit\" edit-function=\"editDay\" duplicate=\"duplicate\" duplicate-function=\"duplicateDay\" move=\"move\" move-function=\"moveDay\"></options-button> </div> </md-list-item> </md-list> <span ng-repeat=\"day in programTypeDays\" ng-if=\"day.confirmed === false\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true }\"> <form name=\"programTypeDayForm\" layout=\"column\"> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <label>Day Name</label> <input name=\"programTypeDayNameInput\" ng-model=\"day.name\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeDayForm.programTypeDayNameInput.$error\"> <div ng-message=\"required\">A day name is required.</div> </div> </md-input-container> </form> <add-program-type-set program-type-sets=\"day.sets\"></add-program-type-set> <add-remove add-function=\"confirmDay(day)\" remove-function=\"removeDay(day)\" invalid-function=\"isInvalid(day)\" name=\"'Day'\"></add-remove> </span> <div layout=\"column\" ng-class=\"{ 'no-padding-bottom': true, 'no-padding-top': true }\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addDay()\" aria-label=\"Add Day\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Day</span> </div> </md-button> </div> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/exercise/addProgramTypeExerciseView.html',
    "<div layout=\"column\"> <md-card> <md-card-header> <md-card-header-text>Exercises</md-card-header-text> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <div layout=\"column\"> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"exercise in programTypeExercises\" ng-if=\"exercise.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Name: {{exercise.name}}</h3> <h4>Type: {{exercise.exerciseType.name}}</h4> </div> <div layout=\"column\" class=\"md-secondary\" layout-align=\"center center\"> <options-button value=\"exercise\" remove=\"remove\" remove-function=\"removeExercise\" edit=\"edit\" edit-function=\"editExercise\"></options-button> </div> </md-list-item> </md-list> <form name=\"programTypeExerciseForm\" layout=\"column\" ng-repeat=\"exercise in programTypeExercises\" ng-if=\"exercise.confirmed === false\"> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <label>Exercise Name</label> <input name=\"programTypeExerciseNameInput\" ng-model=\"exercise.name\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeExerciseForm.programTypeExerciseNameInput.$error\"> <div ng-message=\"required\">An exercise name is required.</div> </div> </md-input-container> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <div layout=\"row\"> <div flex=\"grow\"> <md-select ng-class=\"{ 'no-margin-top': true, 'padding-top-4': true }\" name=\"programTypeExerciseTypeSelect\" ng-model=\"exercise.exerciseType\" placeholder=\"Exercise Type\" required md-no-asterisk=\"true\"> <md-option ng-repeat=\"exerciseType in exerciseTypes\" ng-selected=\"exercise.exerciseType.id === exerciseType.id\" ng-value=\"exerciseType\">{{exerciseType.name}}</md-option> </md-select> <div ng-messages=\"programTypeExerciseForm.programTypeExerciseTypeSelect.$error\"> <div ng-message=\"required\">An exercise type is required.</div> </div> </div> <div> <help template-url=\"helpAddProgramTypeExerciseTypeUrl\"></help> </div> </div> </md-input-container> <add-remove add-function=\"confirmExercise(exercise)\" remove-function=\"removeExercise(exercise)\" invalid-function=\"isInvalid(exercise)\" name=\"'Exercise'\"></add-remove> </form> <div ng-class=\"{ 'padding-bottom-8': true }\" layout=\"column\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addExercise()\" aria-label=\"Add Exercise\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Exercise</span> </div> </md-button> </div> </div> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/header/addProgramTypeHeaderView.html',
    "<div layout=\"column\"> <md-card> <md-card-header layout-align=\"none center\"> <md-card-header-text>Add Program Type</md-card-header-text> <help template-url=\"helpAddProgramTypeUrl\"></help> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <form name=\"programTypeDetailsForm\" layout=\"column\"> <md-input-container flex=\"100\" ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\"> <label>Program Type Name</label> <input name=\"programTypeNameInput\" ng-model=\"programTypeName\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeDetailsForm.programTypeNameInput.$error\"> <div ng-message=\"required\">A program type name is required.</div> </div> </md-input-container> <md-input-container flex=\"100\" ng-class=\"{ 'no-margin-top' : true }\"> <label>Experience Level</label> <md-select ng-class=\"{ 'no-margin-top': true, 'padding-top-4': true }\" name=\"programTypeExperienceLevelSelect\" ng-model=\"level\" placeholder=\"Experience Level\" required md-no-asterisk=\"true\"> <md-option ng-repeat=\"experienceLevel in levels\" ng-selected=\"level.id === experienceLevel.id\" ng-value=\"experienceLevel\">{{experienceLevel.name}}</md-option> </md-select> <div ng-messages=\"programTypeExerciseForm.programTypeExerciseTypeSelect.$error\"> <div ng-message=\"required\">An exercise type is required.</div> </div> </md-input-container> <md-input-container flex=\"100\" ng-class=\"{ 'no-margin-top' : true, 'margin-bottom-8' : true }\"> <label>Description</label> <textarea name=\"programTypeDescriptionInput\" ng-model=\"description\">\r" +
    "\n" +
    "                </textarea></md-input-container> </form> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/help/helpAddProgramTypeExerciseTypeTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Exercise Types</h3> <p>There are three types of exercise types.</p> <div layout=\"column\"> <span class=\"padding-bottom-4\"><span class=\"bold-text\">Weighted</span>: exercises that required weight (E.g. Bench Press).</span> <span class=\"padding-bottom-4\"><span class=\"bold-text\">Non-weighted</span>: exercises that do not require weight (E.g. Situps).</span> <span class=\"padding-bottom-4\"><span class=\"bold-text\">Cardio</span>: cardiovascular exercises which require a duration (E.g. Running).</span> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/help/helpAddProgramTypeIncrementTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Increment Multiplier</h3> <p>The amount of times an increment will be added to the calculated weight.</p> <div layout=\"column\"> <p>E.g. Bench Press, for 12 reps. Increment of 2.5kgs</p> <span flex>Multiplier of 1: Bench Press weight is 80kgs + 2.5kgs</span> <span flex>Multiplier of 2: Bench Press weight is 80kgs + 5kgs</span> </div> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/help/helpAddProgramTypeOneRepMaxTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>One Rep Max Percent</h3> <p>A percentage of the one rep max that determines the weight to be used.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/help/helpAddProgramTypeTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Add Program Type</h3> <p>A program type is a scaffold outlining the weeks, days, sets and exercises for a custom fitness program.</p> <p>Once created the program type can be used to generate multiple programs.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/addProgramTypeSetView.html',
    "<div layout=\"column\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true, 'no-padding-bottom': true }\" layout-padding> <span class=\"md-subhead\">Sets</span> <md-divider></md-divider> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"set in programTypeSets\" ng-if=\"set.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Set type: {{set.setType.name}}</h3> <h4>Exercises: {{set.exercises.length}}, Sets: {{set.numberOfSets}}</h4> </div> <div layout=\"row\" class=\"md-secondary\"> <options-button value=\"set\" remove=\"remove\" remove-function=\"removeSet\" edit=\"edit\" edit-function=\"editSet\" duplicate=\"duplicate\" duplicate-function=\"duplicateSet\" move=\"move\" move-function=\"moveSet\"></options-button> </div> </md-list-item> </md-list> <span ng-repeat=\"set in programTypeSets\" ng-if=\"set.confirmed === false\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true }\"> <add-program-type-set-type set-type=\"set.setType\"></add-program-type-set-type> <add-program-type-set-type-normal ng-if=\"set.setType.id === 0\" exercises=\"exercises\" set=\"set\"></add-program-type-set-type-normal> <add-program-type-set-type-superset ng-if=\"set.setType.id === 1\" exercises=\"exercises\" set=\"set\"></add-program-type-set-type-superset> <add-remove add-function=\"confirmSet(set)\" remove-function=\"removeSet(set)\" invalid-function=\"isInvalid(set)\" name=\"'Set'\"></add-remove> </span> <div layout=\"column\" ng-class=\"{ 'no-padding-bottom': true, 'no-padding-top': true }\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addSet()\" aria-label=\"Add Set\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Set</span> </div> </md-button> </div> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseCardioView.html',
    "<div layout=\"column\"> <form name=\"addProgramTypeSetExerciseCardioForm\" layout=\"column\" class=\"no-padding-bottom\"> <div layout=\"row\"> <!-- Minutes --> <md-input-container class=\"no-margin-bottom no-margin-top\" flex=\"100\"> <label>Minutes</label> <input name=\"programTypeSetMinutesInput\" ng-model=\"setExercise.minutes\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetExerciseCardioForm.programTypeSetMinutesInput.$error\"> <div ng-message=\"required\">Minutes are required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 0 is required.</div> </div> </md-input-container> <!-- Seconds --> <md-input-container class=\"no-margin-bottom no-margin-top\" flex=\"100\"> <label>Seconds</label> <input name=\"programTypeSetSecondsInput\" ng-model=\"setExercise.seconds\" type=\"number\" min=\"0\" max=\"59\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetExerciseCardioForm.programTypeSetSecondsInput.$error\"> <div ng-message=\"required\">Seconds are required.</div> <div ng-message=\"type\">A number is required.</div> <div ng-message=\"min\">A number greater than 0 is required.</div> <div ng-message=\"max\">A number less than 59 is required.</div> </div> </md-input-container> </div> </form> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseNonWeightedView.html',
    "<div layout=\"column\"> <form name=\"addProgramTypeSetExerciseNonWeightedForm\" layout=\"column\" class=\"no-padding-bottom\"> <!-- Numner of reps --> <md-input-container class=\"no-margin-bottom no-margin-top\"> <label>Number of Reps</label> <input name=\"numberOfRepsInput\" ng-model=\"setExercise.numberOfReps\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetExerciseNonWeightedForm.numberOfRepsInput.$error\"> <div ng-message=\"required\">Number of reps are required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> </form> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/exerciseType/addProgramTypeSetExerciseWeightedView.html',
    "<div layout=\"column\"> <form name=\"addProgramTypeSetExerciseWeightedForm\" layout=\"column\" class=\"no-padding-bottom\"> <!-- Numner of reps --> <md-input-container class=\"no-margin-bottom no-margin-top\"> <label>Number of Reps</label> <input name=\"numberOfRepsInput\" ng-model=\"setExercise.numberOfReps\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetExerciseWeightedForm.numberOfRepsInput.$error\"> <div ng-message=\"required\">Number of reps are required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> <!-- ORM --> <md-input-container class=\"no-margin-bottom no-margin-top\"> <label>One Rep Max %</label> <input name=\"oneRepMaxInput\" ng-model=\"setExercise.oneRepMaxPercentage\" type=\"number\" min=\"0\" max=\"100\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetExerciseWeightedForm.oneRepMaxInput.$error\"> <div ng-message=\"required\">A one rep max is required.</div> <div ng-message=\"min\">Must be greater than 0.</div> <div ng-message=\"max\">Must be less than 100.</div> </div> </md-input-container> <!-- Increment Multiplier --> <md-input-container class=\"no-margin-bottom no-margin-top\"> <label>Increment Multiplier</label> <input name=\"incrementMultiplierInput\" ng-model=\"setExercise.incrementMultiplier\" type=\"number\" min=\"0\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetExerciseWeightedForm.incrementMultiplierInput.$error\"> <div ng-message=\"required\">An increment multiplier is required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> </form> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/setInformation/addProgramTypeSetExerciseSelectView.html',
    "<div layout=\"column\"> <form name=\"addProgramTypeSetExerciseSelectForm\" layout=\"column\" class=\"no-padding-bottom\"> <md-input-container class=\"no-margin-bottom no-margin-top\"> <md-select ng-model=\"exercise\" placeholder=\"Exercise\" aria-label=\"Exercise Select\"> <md-option ng-repeat=\"ex in exercises\" ng-selected=\"exercise.id === ex.id\" ng-value=\"ex\">{{ex.name}}</md-option> </md-select> </md-input-container> </form> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/setInformation/addProgramTypeSetNumberOfSetsView.html',
    "<div layout=\"column\"> <form name=\"addProgramTypeSetNumberOfSetsForm\" layout=\"column\"> <md-input-container class=\"no-margin-top no-margin-bottom\"> <label>Number of Sets</label> <input name=\"numberOfSetsInput\" ng-model=\"numberOfSets\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"addProgramTypeSetNumberOfSetsForm.numberOfSetsInput.$error\"> <div ng-message=\"required\">Number of sets are required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> </form> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/setInformation/addProgramTypeSetTypeView.html',
    "<div layout=\"column\"> <form name=\"addProgramTypeSetTypeForm\" layout=\"column\" class=\"no-padding-bottom\"> <md-input-container> <md-select ng-model=\"setType\" aria-label=\"Set Type Select\"> <md-option ng-repeat=\"type in setTypes\" ng-selected=\"setType.id === type.id\" ng-value=\"type\">{{type.name}}</md-option> </md-select> </md-input-container> </form> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeNormalView.html',
    "<div layout=\"column\"> <add-program-type-set-exercise-select class=\"padding-bottom-8\" exercises=\"exercises\" exercise=\"set.exercises[0].exercise\"></add-program-type-set-exercise-select> <add-program-type-set-number-of-sets class=\"padding-top-8\" number-of-sets=\"set.numberOfSets\"></add-program-type-set-number-of-sets> <add-program-type-set-exercise-weighted ng-if=\"set.exercises[0].exercise.exerciseType.id === 0\" set-exercise=\"set.exercises[0]\"></add-program-type-set-exercise-weighted> <add-program-type-set-exercise-non-weighted ng-if=\"set.exercises[0].exercise.exerciseType.id === 1\" set-exercise=\"set.exercises[0]\"></add-program-type-set-exercise-non-weighted> <add-program-type-set-exercise-cardio ng-if=\"set.exercises[0].exercise.exerciseType.id === 2\" set-exercise=\"set.exercises[0]\"></add-program-type-set-exercise-cardio> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/set/setType/addProgramTypeSetTypeSupersetView.html',
    "<div layout=\"column\"> <add-program-type-set-number-of-sets class=\"padding-top-8\" number-of-sets=\"set.numberOfSets\"></add-program-type-set-number-of-sets> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"exer in set.exercises\" ng-if=\"exer.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Exercise: {{exer.exercise.name}}</h3> <h4>Type: {{exer.exercise.exerciseType.name}}</h4> <span ng-if=\"exer.exercise.exerciseType.id === 0 || exer.exercise.exerciseType.id === 1\"> <h4>Reps: {{exer.numberOfReps}}</h4> </span> <span ng-if=\"exer.exercise.exerciseType.id === 2\"> <h4>Duration: {{exer.duration}}</h4> </span> </div> <div layout=\"row\" class=\"md-secondary\"> <options-button value=\"exer\" remove=\"remove\" remove-function=\"removeSetExercise\" edit=\"edit\" edit-function=\"editSetExercise\" duplicate=\"duplicate\" duplicate-function=\"duplicateSetExercise\" move=\"move\" move-function=\"moveSetExercise\"></options-button> </div> </md-list-item> </md-list> <span layout=\"column\" ng-repeat=\"exer in set.exercises\" ng-if=\"exer.confirmed === false\" class=\"no-padding-right no-padding-left padding-bottom-8\"> <add-program-type-set-exercise-select class=\"padding-bottom-8\" exercises=\"exercises\" exercise=\"exer.exercise\"></add-program-type-set-exercise-select> <add-program-type-set-exercise-weighted ng-if=\"exer.exercise.exerciseType.id === 0\" class=\"padding-top-8\" set-exercise=\"exer\"></add-program-type-set-exercise-weighted> <add-program-type-set-exercise-non-weighted ng-if=\"exer.exercise.exerciseType.id === 1\" class=\"padding-top-8\" set-exercise=\"exer\"></add-program-type-set-exercise-non-weighted> <add-program-type-set-exercise-cardio ng-if=\"exer.exercise.exerciseType.id === 2\" class=\"padding-top-8 padding-bottom-8\" set-exercise=\"exer\"></add-program-type-set-exercise-cardio> <add-remove add-function=\"confirmSetExercise(exer)\" remove-function=\"removeSetExercise(exer)\" invalid-function=\"isInvalid(exer)\" name=\"'Superset'\"></add-remove> </span> <div layout=\"column\" class=\"no-padding-bottom no-padding-top\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addSuperset()\" aria-label=\"Add Superset\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Superset</span> </div> </md-button> </div> </div>"
  );


  $templateCache.put('scripts/directives/addProgramType/week/addProgramTypeWeekView.html',
    "<div layout=\"column\"> <md-card> <md-card-header> <md-card-header-text>Weeks</md-card-header-text> </md-card-header> <md-card-content ng-class=\"{ 'no-padding-top' : true, 'no-padding-bottom' : true }\"> <div layout=\"column\"> <md-list ng-if=\"hasConfirmed()\" flex> <md-list-item class=\"md-2-line secondary-button-padding\" ng-repeat=\"week in programTypeWeeks\" ng-if=\"week.confirmed === true\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>Name: {{week.name}}</h3> <h4>Total Days: {{week.days.length}}</h4> </div> <div layout=\"row\" class=\"md-secondary\"> <options-button value=\"week\" remove=\"remove\" remove-function=\"removeWeek\" edit=\"edit\" edit-function=\"editWeek\" duplicate=\"duplicate\" duplicate-function=\"duplicateWeek\" move=\"move\" move-function=\"moveWeek\"></options-button> </div> </md-list-item> </md-list> <span ng-repeat=\"week in programTypeWeeks\" ng-if=\"week.confirmed === false\" ng-class=\"{ 'no-padding-right': true, 'no-padding-left': true }\"> <form name=\"programTypeWeekForm\" layout=\"column\"> <md-input-container ng-class=\"{ 'no-margin-top': true, 'no-margin-bottom': true }\" flex=\"100\"> <label>Week Name</label> <input name=\"programTypeWeekNameInput\" ng-model=\"week.name\" required md-no-asterisk=\"true\"> <div ng-messages=\"programTypeWeekForm.programTypeWeekNameInput.$error\"> <div ng-message=\"required\">A week name is required.</div> </div> </md-input-container> </form> <add-program-type-day program-type-days=\"week.days\"></add-program-type-day> <add-remove add-function=\"confirmWeek(week)\" remove-function=\"removeWeek(week)\" invalid-function=\"isInvalid(week)\" name=\"'Week'\"></add-remove> </span> <div ng-class=\"{ 'padding-bottom-8': true }\" layout=\"column\" layout-align=\"center center\"> <md-button class=\"md-primary md-raised\" ng-click=\"addWeek()\" aria-label=\"Add Week\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/add.svg\"></md-icon> <span flex>Week</span> </div> </md-button> </div> </div> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/addRemove/addRemoveView.html',
    "<div layout=\"row\"> <md-button class=\"md-raised flex\" md-colors=\"{ background: 'green-600'}\" ng-click=\"addFunction()\" ng-disabled=\"invalidFunction()\" aria-label=\"Add\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/check.svg\" flex=\"none\"></md-icon> <span flex>{{name}}</span> </div> </md-button> <md-button class=\"md-raised flex\" md-colors=\"{ background: 'deep-orange-600'}\" ng-click=\"removeFunction()\" aria-label=\"Remove\"> <div layout=\"row\" layout-align=\"center center\"> <md-icon md-svg-src=\"images/icons/remove.svg\" flex=\"none\"></md-icon> <span flex>{{name}}</span> </div> </md-button> </div>"
  );


  $templateCache.put('scripts/directives/bottomNavigationBar/bottomNavigationBarView.html',
    "<div layout=\"row\"> <md-toolbar md-colors=\"{ background: 'primary-50'}\"> <div class=\"md-toolbar-tools\"> <a class=\"icon-width\" ng-href=\"#/add-program\" aria-label=\"Add Program\"> <div class=\"navbar-height\" layout=\"column\" layout-align=\"center center\"> <div> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/checkBlack.svg\"></md-icon> </div> <div> <span class=\"icon-text truncate-text\">Add Program</span> </div> </div> </a> <a class=\"icon-width\" ng-href=\"#/program-list\" aria-label=\"Program List\"> <div class=\"navbar-height\" layout=\"column\" layout-align=\"center center\"> <div> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/listCheckBlack.svg\"></md-icon> </div> <div> <span class=\"icon-text truncate-text\">Program List</span> </div> </div> </a> <span flex></span> <span flex></span> <a class=\"icon-width\" ng-href=\"#/add-program-type\" aria-label=\"Add Program Type\"> <div class=\"navbar-height\" layout=\"column\" layout-align=\"center center\"> <div> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/addBlack.svg\"></md-icon> </div> <div> <span class=\"icon-text truncate-text\">Add Type</span> </div> </div> </a> <a class=\"icon-width\" ng-href=\"#/program-type-list\" aria-label=\"Program Type List\"> <div class=\"navbar-height\" layout=\"column\" layout-align=\"center center\"> <div> <md-icon class=\"black-icon\" md-svg-icon=\"images/icons/listAddBlack.svg\"></md-icon> </div> <div> <span class=\"icon-text truncate-text\">Type List</span> </div> </div> </a> </div> </md-toolbar> </div>"
  );


  $templateCache.put('scripts/directives/dashboardProgramList/dashboardProgramListView.html',
    "<div layout=\"column\" class=\"padding-left-8 padding-right-8\"> <div layout=\"column\"> <div layout=\"row\" layout-align=\"none center\"> <span class=\"padding-left-14 font-weight-700\" flex=\"grow\">Active Programs</span> <help template-url=\"helpActiveProgramListUrl\"></help> </div> <md-divider class=\"margin-top-8 padding-bottom-8\"></md-divider> </div> <program-list ng-if=\"programs && programs.length > 0\" programs=\"programs\"></program-list> <list-empty ng-if=\"!programs || programs.length <= 0\" message=\"emptyListMessage\" button-text=\"emptyListButtonText\" button-link=\"emptyListButtonList\"></list-empty> </div>"
  );


  $templateCache.put('scripts/directives/dashboardProgramList/helpDashboardProgramListTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Active Program List</h3> <p>A program is considered active when it is not complete.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/help/helpView.html',
    "<div layout=\"column\"> <md-button class=\"md-icon-button\" ng-click=\"display()\" aria-label=\"help\"> <md-icon md-svg-icon=\"images/icons/help.svg\"></md-icon> </md-button> </div>"
  );


  $templateCache.put('scripts/directives/highlightCard/highlightCardView.html',
    "<div layout=\"column\"> <md-card md-colors=\"{ 'background': '{{highlightColor}}' }\"> <md-card-header class=\"padding-top-8 padding-bottom-8\"> <md-card-header-text> <span class=\"font-size-16 font-weight-600\">{{headerText}}</span> </md-card-header-text> </md-card-header> <md-card-title class=\"no-padding-top\"> <md-card-title-text layout-align=\"center center\"> <span class=\"font-size-48 center-text\">{{highlightText}}</span> <span class=\"md-subhead no-padding-top center-text\">{{subheadText}}</span> </md-card-title-text> </md-card-title> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/list/listView.html',
    "<div layout=\"column\"> <span ng-if=\"values && values.length > 0\" flex> <md-list> <md-list-item class=\"md-3-line background-white margin-bottom-10\" ng-repeat=\"value in values\" ng-href=\"{{value.href}}\" md-whiteframe=\"2\"> <div class=\"padding-top-24 padding-bottom-16 padding-right-16 padding-left-16\" layout=\"row\" flex=\"100\" md-colors=\"{ background: '{{value.color}}' }\"> <div layout=\"column\" flex> <div layout=\"column\" flex> <p class=\"list-text headline truncate-text\">{{value.text}}</p> <p class=\"list-text subhead truncate-text\">{{value.secondText}}</p> <p class=\"list-text subhead truncate-text\">{{value.thirdText}}</p> </div> </div> <div layout=\"row\" flex=\"none\" layout-align=\"center start\"> <md-button ng-if=\"value.editable\" class=\"md-icon-button\" md-colors=\"{ background: 'orange-300' }\" ng-click=\"editFunction(value)\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button ng-if=\"value.removable\" class=\"md-icon-button\" md-colors=\"{ background: 'red-300' }\" class=\"md-raised\" ng-click=\"removeFunction(value)\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> <md-progress-linear ng-if=\"value.percentage >= 0\" class=\"list-progress\" md-mode=\"determinate\" value=\"{{value.percentage}}\"></md-progress-linear> </div> </md-list-item> </md-list> </span> </div>"
  );


  $templateCache.put('scripts/directives/listEmpty/listEmptyView.html',
    "<div layout=\"column\"> <md-card md-colors=\"{ background: 'orange-500'}\"> <md-card-content> <div layout=\"column\"> <div ng-if=\"message\" class=\"padding-bottom-8\" layout=\"column\" layout-align=\"center center\"> <span class=\"font-weight-700\">{{message}}</span> </div> <div ng-if=\"buttonText && buttonLink\" layout=\"column\" layout-align=\"center center\"> <md-button md-colors=\"{ background: 'primary-50' }\" class=\"md-raised\" ng-href=\"{{buttonLink}}\"> {{buttonText}} </md-button> </div> </div> </md-card-content> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/listFilter/listFilterView.html',
    "<div layout=\"column\"> <div layout=\"row\" layout-align=\"center none\"> <div layout=\"column\" flex=\"grow\"> <md-input-container class=\"no-margin-bottom margin-top-4\"> <label><md-icon class=\"padding-right-4\" md-svg-src=\"images/icons/searchBlack.svg\"></md-icon>Filter</label> <input ng-model=\"filterValue\" flex> </md-input-container> </div> <div layout=\"column\" flex=\"nogrow\"> <md-button class=\"md-icon-button\" ng-click=\"clear()\" aria-label=\"Clear\"> <md-icon class=\"padding-right-4\" md-svg-src=\"images/icons/clearBlack.svg\"></md-icon> </md-button> </div> </div> </div>"
  );


  $templateCache.put('scripts/directives/messageCard/messageCardView.html',
    "<div class=\"column\"> <md-card md-colors=\"{ background: 'orange-200' }\"> <md-card-title class=\"padding-top-16 padding-bottom-8\"> <md-card-title-text layout-align=\"center center\">{{message}}</md-card-title-text> </md-card-title> <md-card-actions class=\"margin-bottom-16\" layout=\"column\" layout-align=\"center center\"> <md-button class=\"md-raised\" md-colors=\"{ background: 'orange-700', color: 'grey-900' }\" ng-click=\"buttonClicked()\">{{buttonText}}</md-button> </md-card-actions> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/navigationBar/navigationBarView.html',
    "<div layout=\"row\"> <md-toolbar class=\"md-hue-2\"> <div class=\"md-toolbar-tools\"> <a class=\"icon-width\" ng-click=\"toggleSidenav()\" aria-label=\"Sidenav Menu\"> <div class=\"navbar-height\" layout=\"column\" layout-align=\"center center\"> <div> <md-icon md-svg-icon=\"images/icons/menu.svg\"></md-icon> </div> <div> <span class=\"icon-text truncate-text\">Menu</span> </div> </div> </a> <span flex></span> <h2 class=\"title-text\">POWERHOUSE</h2> <span flex></span> <a class=\"icon-width\" ng-href=\"#/\" aria-label=\"dashboard\"> <div class=\"navbar-height\" layout=\"column\" layout-align=\"center center\"> <div> <md-icon md-svg-icon=\"images/icons/dashboard.svg\"></md-icon> </div> <div> <span class=\"icon-text truncate-text\">Dashboard</span> </div> </div> </a> </div> </md-toolbar> <md-sidenav md-colors=\"{ 'background': 'primary-50' }\" md-component-id=\"sidenav\" class=\"md-sidenav-left\" md-disable-scroll-target md-whiteframe=\"4\"> <md-content md-colors=\"{ 'background': 'primary-50' }\" layout-padding> <md-list> <md-list-item ng-repeat=\"menuItems in sideMenuItems\" ng-click=\"toggleSidenav()\" ng-href=\"{{menuItems.href}}\"> <div layout=\"row\" layout-align=\"center center\" flex> <md-icon class=\"margin-right-16\" md-svg-icon=\"{{menuItems.icon}}\" flex=\"nogrow\"></md-icon> <h3 flex=\"grow\">{{menuItems.text}}</h3> </div> </md-list-item> </md-list> </md-content> </md-sidenav> </div>"
  );


  $templateCache.put('scripts/directives/optionsButton/optionsButtonView.html',
    "<div layout=\"column\"> <div class=\"width-56 height-52\" layout=\"row\"> <md-fab-speed-dial ng-if=\"moving === false\" class=\"md-scale md-fab-top-left postion-top-0 postion-bottom-0 postion-right-0 postion-left-0 padding-right-16\" md-open=\"isOpen\" md-direction=\"{{direction}}\"> <md-fab-trigger> <md-button class=\"md-fab md-mini\" aria-label=\"Menu\"> <md-icon md-svg-src=\"images/icons/menu.svg\"></md-icon> </md-button> </md-fab-trigger> <md-fab-actions flex> <md-button ng-if=\"remove\" class=\"md-fab md-mini md-raised\" ng-click=\"removeFunction(value)\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> <md-button ng-if=\"edit\" class=\"md-fab md-mini md-raised\" ng-click=\"editFunction(value)\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button ng-if=\"duplicate\" class=\"md-fab md-mini md-raised\" ng-click=\"duplicateFunction(value)\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"duplicate\"> <md-icon md-svg-src=\"images/icons/duplicate.svg\"></md-icon> </md-button> <md-button ng-if=\"move\" class=\"md-fab md-mini md-raised\" ng-click=\"moveClicked()\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"move\"> <md-icon md-svg-src=\"images/icons/move.svg\"></md-icon> </md-button> </md-fab-actions> </md-fab-speed-dial> <div ng-if=\"moving === true\" layout=\"row\" layout-align=\"center center\"> <md-button class=\"md-fab md-mini md-raised\" ng-click=\"moveDown()\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"Move Down\"> <md-icon md-svg-src=\"images/icons/arrowDown.svg\"></md-icon> </md-button> <md-button class=\"md-fab md-mini md-raised\" ng-click=\"moveUp()\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"Move Up\"> <md-icon md-svg-src=\"images/icons/arrowUp.svg\"></md-icon> </md-button> <md-button class=\"md-fab md-mini md-raised\" ng-click=\"moveDone()\" md-colors=\"{ background: 'deep-orange-A700' }\" aria-label=\"Move Done\"> <md-icon md-svg-src=\"images/icons/check.svg\"></md-icon> </md-button> </div> </div> </div>"
  );


  $templateCache.put('scripts/directives/orderList/orderListView.html',
    "<div layout=\"column\"> <div layout=\"row\" layout-align=\"center none\"> <div layout=\"column\" flex=\"grow\"> <md-input-container class=\"no-margin-top no-margin-bottom\"> <md-select ng-model=\"selectedOrder\" aria-label=\"Order List Select\"> <md-option ng-repeat=\"orderValue in orderValues\" ng-selected=\"orderValue.text === selectedOrder.text\" ng-value=\"orderValue\"> {{orderValue.text}} </md-option> </md-select> </md-input-container> </div> <div layout=\"column\" flex=\"nogrow\"> <md-button class=\"md-icon-button\" ng-click=\"reverse(selectedOrder)\" aria-label=\"Clear\"> <md-icon ng-if=\"reversed === true\" class=\"padding-right-4\" md-svg-src=\"images/icons/downArrowBlack.svg\"></md-icon> <md-icon ng-if=\"reversed === false\" class=\"padding-right-4\" md-svg-src=\"images/icons/upArrowBlack.svg\"></md-icon> </md-button> </div> </div> </div>"
  );


  $templateCache.put('scripts/directives/programList/programListView.html',
    "<div layout=\"column\"> <list edit-function=\"editFunction\" remove-function=\"removeFunction\" values=\"formattedPrograms\"></list> </div>"
  );


  $templateCache.put('scripts/directives/programTypeList/ProgramTypeListView.html',
    "<div layout=\"column\"> <list edit-function=\"editFunction\" remove-function=\"removeFunction\" values=\"formattedProgramTypes\"></list> </div>"
  );


  $templateCache.put('scripts/directives/quickComplete/quickCompleteHelpTemplate.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Quick Complete</h3> <p>Allows the quick completion of the next set in the most recently active program.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/quickComplete/quickCompleteView.html',
    "<div layout=\"column\"> <md-card ng-if=\"defined()\"> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">{{quickCompleteProgram.name}}</span> <span>{{week.name}} | {{day.name}}</span> <span flex=\"nogrow\">{{set.numberOfSets}} sets</span> </div> </md-card-header-text> <md-checkbox class=\"no-margin\" ng-model=\"set.complete\" ng-change=\"calculatePercentageComplete(day)\" aria-label=\"complete set\" flex=\"nogrow\"></md-checkbox> <help template-url=\"helpTemplateUrl\"></help> </md-card-header> <md-progress-linear ng-if=\"quickCompleteProgram.percentComplete >= 0\" md-mode=\"determinate\" value=\"{{quickCompleteProgram.percentComplete}}\"></md-progress-linear> <md-card-content class=\"no-padding-top no-padding-bottom no-padding-left no-padding-right\"> <md-list> <span class=\"body-list-item\"> <md-list-item class=\"md-2-line\" ng-repeat=\"setExercise in exercises\" flex> <div ng-if=\"setExercise.exercise.exerciseType.id === 0\" class=\"md-list-item-text\" flex> <h3 flex>{{setExercise.exercise.name}}</h3> <p>{{setExercise.numberOfReps}} reps at {{setExercise.weight}}{{unit.textName}}</p> </div> <div ng-if=\"setExercise.exercise.exerciseType.id === 1\" class=\"md-list-item-text\"> <h3 flex>{{setExercise.exercise.name}}</h3> <p>{{setExercise.numberOfReps}} reps</p> </div> <div ng-if=\"setExercise.exercise.exerciseType.id === 2\" class=\"md-list-item-text\"> <h3 flex>{{setExercise.exercise.name}}</h3> <p>Duration: {{setExercise.duration}}</p> </div> </md-list-item> </span> </md-list> </md-card-content> </md-card> <md-card class=\"quickcomplete\" ng-if=\"!defined()\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header class=\"no-padding-right\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">No most recent program</span> </div> </md-card-header-text> <help template-url=\"helpTemplateUrl\"></help> </md-card-header> </md-card> </div>"
  );


  $templateCache.put('scripts/directives/resetSetting/helpResetSetting.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>Reset</h3> <p>This will reset the application back to it's default state.</p> <p class=\"font-weight-700\">This means that:</p> <p>- All programs will be removed</p> <p>- All custom program types will be removed</p> <p>- Custom setting will be restored</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('scripts/directives/resetSetting/resetSettingView.html',
    "<div layout=\"column\"> <div layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <md-button class=\"md-raised md-warn\" ng-click=\"resetClicked()\">Reset All</md-button> </div> <help template-url=\"helpResetSetting\" flex=\"nogrow\"></help> </div> </div>"
  );


  $templateCache.put('scripts/directives/weightUnitSetting/weightUnitSettingView.html',
    "<div layout=\"column\"> <md-input-container class=\"no-margin-bottom no-margin-top\"> <div layout=\"row\" layout-align=\"none center\"> <div class=\"padding-right-8\" flex=\"noshrink\"> <p>Weight unit:</p> </div> <div flex=\"grow\"> <md-select ng-model=\"currentUnit\" aria-label=\"Units\"> <md-option ng-repeat=\"unit in units\" ng-selected=\"unit.name === currentUnit.name\" ng-value=\"unit\">{{unit.name}}</md-option> </md-select> </div> </div> </md-input-container> </div>"
  );


  $templateCache.put('views/addProgram.html',
    "<div layout=\"column\" layout-padding> <add-program program-name=\"programName\" program-type=\"programType\" increment=\"increment\" exercises=\"exercises\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program> </div>"
  );


  $templateCache.put('views/addProgramType.html',
    "<div layout=\"column\" layout-padding> <add-program-type program-type-name=\"programTypeName\" level=\"level\" description=\"description\" exercises=\"exercises\" weeks=\"weeks\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program-type> </div>"
  );


  $templateCache.put('views/contact.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <md-card> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">Contact</span> </div> </md-card-header-text> </md-card-header> <md-card-content> <div layout=\"row\" layout-align=\"center center\" flex> <md-icon class=\"margin-right-16\" md-svg-icon=\"images/icons/email.svg\" flex=\"nogrow\"></md-icon> <span flex=\"grow\">{{email}}</span> </div> </md-card-content> </md-card> </div> </div>"
  );


  $templateCache.put('views/dashboard.html',
    "<div layout=\"column\" layout-padding> <div layout=\"row\"> <div flex=\"50\"> <highlight-card header-text=\"completedHeaderText\" highlight-text=\"completedHighlightText\" highlight-color=\"completedHighlightColor\" subhead-text=\"completeSubheadText\"></highlight-card> </div> <div flex=\"50\"> <highlight-card header-text=\"activeHeaderText\" highlight-text=\"activeHighlightText\" highlight-color=\"activeHighlightColor\" subhead-text=\"activeSubheadText\"></highlight-card> </div> </div> <div layout=\"column\" flex> <quick-complete quick-complete-program=\"quickCompleteProgram\"></quick-complete> </div> <div layout=\"column\" flex> <dashboard-program-list programs=\"programs\"></dashboard-program-list> </div> </div>"
  );


  $templateCache.put('views/editProgram.html',
    "<div layout=\"column\" layout-padding> <add-program program-name=\"programName\" program-type=\"programType\" increment=\"increment\" exercises=\"exercises\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program> </div>"
  );


  $templateCache.put('views/editProgramType.html',
    "<div layout=\"column\" layout-padding> <add-program-type program-type-name=\"programTypeName\" level=\"level\" description=\"description\" exercises=\"exercises\" weeks=\"weeks\" add-function=\"addFunction\" remove-function=\"removeFunction\" invalid-function=\"invalidFunction\"></add-program-type> </div>"
  );


  $templateCache.put('views/help.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <md-card> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">Help</span> </div> </md-card-header-text> </md-card-header> <md-card-content layout=\"column\"> <div class=\"padding-bottom-24\" layout=\"column\"> <span class=\"padding-bottom-4 font-weight-600\">About</span> <md-divider></md-divider> <p class=\"no-margin-bottom\">Powerhouse is an application that makes it easy to track tailored workout programs.</p> <p class=\"no-margin-bottom\">Custom programs can be entered, allowing for unlimited customization and freedom to design and plan workouts.</p> </div> <div class=\"padding-bottom-24\" layout=\"column\"> <span class=\"padding-bottom-4 font-weight-600\">Getting Started</span> <md-divider></md-divider> <p>To get started simply add a new program based off of a pre-defined program type or start by defining a program type yourself.</p> <div layout=\"row\" layout-align=\"center center\"> <div layout=\"column\" flex> <md-button class=\"md-raised\" ng-href=\"#/add-program\">Add Program</md-button> </div> <div layout=\"column\" flex> <md-button class=\"md-raised\" ng-href=\"#/add-program-type\">Add Type</md-button> </div> </div> <p class=\"no-margin-bottom\">Once the program is created the application will automatically calculate your tailored workout.</p> <p>From here find your program in the program list, once found click on the program to view and complete the components of the workout.</p> <div layout=\"row\" layout-align=\"center center\"> <md-button class=\"md-raised\" ng-href=\"#/program-list\">Program List</md-button> </div> </div> <div class=\"padding-bottom-24\" layout=\"column\"> <span class=\"padding-bottom-4 font-weight-600\">Programs</span> <md-divider></md-divider> <p class=\"no-margin-bottom\">A program is a tailored workout based off of a program type.</p> <p class=\"no-margin-bottom\">Each program will contain a number of weeks and days. Each day will have a number of sets with exercises that are intented to be complete.</p> <p>Once a set exercise is complete mark it as done by checking the checkbox. This will automatically update the percentage completion of the program.</p> <div layout=\"row\" layout-align=\"center center\"> <md-button class=\"md-raised\" ng-href=\"#/add-program\">Add Program</md-button> </div> </div> <div class=\"padding-bottom-24\" layout=\"column\"> <span class=\"padding-bottom-4 font-weight-600\">Program Types</span> <md-divider></md-divider> <p class=\"no-margin-bottom\">A program type is a scaffold used to create tailored workouts. Complete customization is available to cater for a wide range of potential workouts.</p> <div layout=\"row\" layout-align=\"center center\"> <md-button class=\"md-raised\" ng-href=\"#/add-program-type\">Add Program Type</md-button> </div> </div> </md-card-content> </md-card> </div> </div>"
  );


  $templateCache.put('views/helpOneRepMaxCalculator.html',
    "<md-dialog aria-label=\"{{ariaLabel}}\"> <form ng-cloak> <md-dialog-content> <div class=\"md-dialog-content\"> <h3>One Rep Max Calculator</h3> <p>A one rep max (ORM) is the maximum amount of weight that can be lifted in a single repetition for a given exercise.</p> <p>This calculator makes it easy to calculate an estimated ORM by simply inputing a weight amount and the number of repetitions performed.</p> </div> </md-dialog-content> <md-dialog-actions layout=\"row\"> <md-button ng-click=\"hideDialog()\">Ok</md-button> </md-dialog-actions> </form> </md-dialog>"
  );


  $templateCache.put('views/oneRepMaxCalculator.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <md-card> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"row\" layout-align=\"none center\" flex=\"grow\"> <span class=\"font-weight-600\" flex=\"grow\">One Rep Max Calculator</span> <help template-url=\"helpOneRepMaxCalculatorUrl\" flex=\"nogrow\"></help> </div> </md-card-header-text> </md-card-header> <md-card-content> <div class=\"padding-top-8\" layout=\"column\"> <form name=\"oneRepMaxCalculatorForm\" layout=\"column\"> <md-input-container class=\"no-margin-top no-margin-bottom\"> <label>Weight Lifted ({{unit.textName}})</label> <input name=\"weightLifted\" ng-model=\"weightLifted\" type=\"number\" min=\"0\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"oneRepMaxCalculatorForm.weightLifted.$error\"> <div ng-message=\"required\">The amount of weight is required.</div> <div ng-message=\"min\">Must be greater than 0.</div> </div> </md-input-container> <md-input-container class=\"no-margin-top no-margin-bottom\"> <label>Number of Reps</label> <input name=\"numberOfReps\" ng-model=\"numberOfReps\" type=\"number\" min=\"0\" max=\"12\" step=\"1\" required md-no-asterisk=\"true\"> <div ng-messages=\"oneRepMaxCalculatorForm.numberOfReps.$error\"> <div ng-message=\"required\">The number of reps is required.</div> <div ng-message=\"min\">Must be greater than 0.</div> <div ng-message=\"max\">Must be less than 12.</div> </div> </md-input-container> </form> </div> </md-card-content> </md-card> <md-card> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">One Rep Max Percentages</span> </div> </md-card-header-text> </md-card-header> <md-card-content> <div layout=\"column\"> <md-list> <span ng-repeat=\"oRMPercentage in oRMPercentages\"> <md-list-item class=\"md-2-line\"> <div class=\"md-list-item-text\" layout=\"column\"> <h3>{{oRMPercentage.name}}</h3> <p>{{oRMPercentage.value}}{{unit.textName}}</p> </div> </md-list-item> <md-divider ng-if=\"!$last\"></md-divider> </span> </md-list> </div> </md-card-content> </md-card> </div> </div>"
  );


  $templateCache.put('views/programInformation.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <span ng-if=\"program !== undefined\" flex> <!-- HEADER --> <md-list> <md-list-item class=\"md-3-line background-white margin-bottom-10 no-padding-left no-padding-right\" md-whiteframe=\"2\"> <div class=\"padding-top-24 padding-bottom-16 padding-right-16 padding-left-16\" layout=\"row\" flex=\"100\"> <div layout=\"column\" flex> <div layout=\"column\" flex> <p class=\"list-text headline truncate-text\">{{program.name}}</p> <p class=\"list-text subhead truncate-text\">Total Weeks: {{program.weeks.length}}</p> <p class=\"list-text subhead truncate-text\">Increment: {{program.increment}}{{unit.textName}}</p> </div> </div> <div layout=\"row\" flex=\"none\" layout-align=\"center start\"> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'orange-300' }\" ng-click=\"editFunction(program)\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'red-300' }\" class=\"md-raised\" ng-click=\"removeFunction(program)\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </div> <md-progress-linear class=\"list-progress\" md-mode=\"determinate\" value=\"{{program.percentComplete}}\"></md-progress-linear> </md-list-item> </md-list> <!-- BODY --> <md-expansion-panel-group> <md-expansion-panel ng-repeat=\"week in program.weeks\"> <md-expansion-panel-collapsed> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <md-list class=\"no-padding-bottom\" ng-repeat=\"day in week.days\" flex> <p class=\"no-margin-top\">{{day.name}}</p> <md-divider></md-divider> <span ng-repeat=\"set in day.sets\"> <span class=\"header-list-item\"> <md-list-item class=\"md-2-line\" md-colors=\"{ background: 'primary-50' }\" flex> <div class=\"md-list-item-text\"> <h3 flex>Set type: {{set.setType.name}}</h3> <p>Number of sets: {{set.numberOfSets}}</p> </div> <md-checkbox class=\"md-secondary\" ng-model=\"set.complete\" ng-change=\"calculatePercentageComplete(day)\" aria-label=\"Complete Set\"></md-checkbox> </md-list-item> </span> <span class=\"body-list-item\"> <md-list-item class=\"md-2-line\" ng-repeat=\"setExercise in set.exercises\" flex> <div ng-if=\"setExercise.exercise.exerciseType.id === 0\" class=\"md-list-item-text\" flex> <h3 flex>{{setExercise.exercise.name}}</h3> <p>{{setExercise.numberOfReps}} reps at {{setExercise.weight}}{{unit.textName}}</p> </div> <div ng-if=\"setExercise.exercise.exerciseType.id === 1\" class=\"md-list-item-text\"> <h3 flex>{{setExercise.exercise.name}}</h3> <p>{{setExercise.numberOfReps}} reps</p> </div> <div ng-if=\"setExercise.exercise.exerciseType.id === 2\" class=\"md-list-item-text\"> <h3 flex>{{setExercise.exercise.name}}</h3> <p>Duration: {{setExercise.duration}}</p> </div> </md-list-item> </span> <md-divider></md-divider> </span> </md-list> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> </md-expansion-panel-group> </span> </div> </div>"
  );


  $templateCache.put('views/programList.html',
    "<div layout=\"column\" layout-padding> <list-filter class=\"no-padding-bottom\" values=\"filteredPrograms\" original-values=\"originalPrograms\" property=\"filterProperty\"></list-filter> <order-list class=\"no-padding-top\" order-values=\"orderValues\" key=\"orderKey\" reverse-key=\"reverseKey\" values=\"programs\" original-values=\"filteredPrograms\"></order-list> <program-list class=\"no-padding-top\" ng-if=\"programs && programs.length > 0\" programs=\"programs\" remove-function=\"removeFunction\" edit-function=\"editFunction\"></program-list> <list-empty ng-if=\"!programs || programs.length <= 0\" message=\"emptyListMessage\" button-text=\"emptyListButtonText\" button-link=\"emptyListButtonLink\"></list-empty> </div>"
  );


  $templateCache.put('views/programTypeInformation.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <span ng-if=\"programType !== undefined\" flex> <!-- HEADER --> <md-list> <md-list-item class=\"md-3-line background-white margin-bottom-10 no-padding-left no-padding-right\" md-whiteframe=\"2\"> <div class=\"padding-top-24 padding-bottom-16 padding-right-16 padding-left-16\" layout=\"row\" flex=\"100\"> <div layout=\"column\" flex> <div layout=\"column\" flex> <p class=\"list-text headline truncate-text\">{{programType.programTypeName}}</p> <p ng-if=\"programType.level\" class=\"list-text subhead truncate-text\">Experience Level: {{programType.level.name}}</p> <p class=\"list-text subhead truncate-text\">Total Weeks: {{programType.weeks.length}}, Total Sets: {{programType.totalNumberOfSets}}</p> </div> </div> <div layout=\"row\" flex=\"none\" layout-align=\"center start\"> <md-button class=\"md-icon-button\" md-colors=\"{ background: 'orange-300' }\" ng-click=\"editFunction(programType)\" aria-label=\"Edit\"> <md-icon md-svg-src=\"images/icons/edit.svg\"></md-icon> </md-button> <md-button ng-if=\"!programType.default\" class=\"md-icon-button\" md-colors=\"{ background: 'red-300' }\" class=\"md-raised\" ng-click=\"removeFunction(programType)\" aria-label=\"Remove\"> <md-icon md-svg-src=\"images/icons/remove.svg\"></md-icon> </md-button> </div> </div> </md-list-item> </md-list> <!-- BODY --> <md-expansion-panel-group> <!-- Description --> <md-expansion-panel ng-if=\"programType.description && programType.description.length > 0\"> <md-expansion-panel-collapsed> <div class=\"md-title\">Description</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">Description</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <p>{{programType.description}}</p> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> <!-- Exercises --> <md-expansion-panel> <md-expansion-panel-collapsed> <div class=\"md-title\">Exercises</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">Exercises</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <md-list ng-class=\"{ 'no-padding-top': true, 'no-padding-bottom': true }\" ng-repeat=\"exercise in programType.exercises\" flex> <md-list-item class=\"md-2-line\" flex> <div class=\"md-list-item-text\" flex> <h3 flex>{{exercise.name}}</h3> <p>Type: {{exercise.exerciseType.name}}</p> </div> </md-list-item> <md-divider ng-if=\"!$last\"></md-divider> </md-list> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> <!-- Weeks --> <md-expansion-panel ng-repeat=\"week in programType.weeks\"> <md-expansion-panel-collapsed> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-collapsed> <md-expansion-panel-expanded> <md-expansion-panel-header ng-click=\"$panel.collapse()\"> <div class=\"md-title\">{{week.name}}</div> <div class=\"md-summary\"></div> <md-expansion-panel-icon></md-expansion-panel-icon> </md-expansion-panel-header> <md-expansion-panel-content> <md-list class=\"no-padding-bottom\" ng-repeat=\"day in week.days\" flex> <p class=\"no-margin-top\">{{day.name}}</p> <md-divider></md-divider> <span ng-repeat=\"set in day.sets\"> <span class=\"header-list-item\"> <md-list-item class=\"md-2-line\" md-colors=\"{ background: 'primary-50' }\" flex> <div class=\"md-list-item-text\"> <h3 flex>Set type: {{set.setType.name}}</h3> <p>Number of sets: {{set.numberOfSets}}</p> </div> </md-list-item> </span> <span class=\"body-list-item\"> <md-list-item class=\"md-2-line\" ng-repeat=\"setExercise in set.exercises\" flex> <div ng-if=\"setExercise.exercise.exerciseType.id === 0\" class=\"md-list-item-text\" flex> <h3 flex>{{setExercise.exercise.name}}</h3> <p>{{setExercise.numberOfReps}} reps at {{setExercise.oneRepMaxPercentage}}% ORM, Increment Multiplier: {{setExercise.incrementMultiplier}}</p> </div> <div ng-if=\"setExercise.exercise.exerciseType.id === 1\" class=\"md-list-item-text\"> <h3 flex>{{setExercise.exercise.name}}</h3> <p>{{setExercise.numberOfReps}} reps</p> </div> <div ng-if=\"setExercise.exercise.exerciseType.id === 2\" class=\"md-list-item-text\"> <h3 flex>{{setExercise.exercise.name}}</h3> <p>Duration: {{setExercise.duration}}</p> </div> </md-list-item> </span> <md-divider></md-divider> </span> </md-list> </md-expansion-panel-content> </md-expansion-panel-expanded> </md-expansion-panel> </md-expansion-panel-group> </span> </div> </div>"
  );


  $templateCache.put('views/programTypeList.html',
    "<div layout=\"column\" layout-padding> <list-filter class=\"no-padding-bottom\" values=\"filteredProgramTypes\" original-values=\"originalProgramTypes\" property=\"filterProperty\"></list-filter> <order-list class=\"no-padding-top\" order-values=\"orderValues\" key=\"orderKey\" reverse-key=\"reverseKey\" values=\"programTypes\" original-values=\"filteredProgramTypes\"></order-list> <program-type-list class=\"no-padding-top\" ng-if=\"programTypes && programTypes.length > 0\" program-types=\"programTypes\"></program-type-list> <list-empty ng-if=\"!programTypes || programTypes.length <= 0\" message=\"emptyListMessage\" button-text=\"emptyListButtonText\" button-link=\"emptyListButtonLink\"></list-empty> </div>"
  );


  $templateCache.put('views/settings.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\"> <md-card> <md-card-header class=\"no-padding-right\" md-colors=\"{ 'background' : 'primary-50' }\"> <md-card-header-text layout=\"row\"> <div layout=\"column\" layout-align=\"center none\" flex=\"grow\"> <span class=\"font-weight-600\">Settings</span> </div> </md-card-header-text> </md-card-header> <md-card-content> <weight-unit-setting></weight-unit-setting> <reset-setting></reset-setting> </md-card-content> </md-card> </div> </div>"
  );


  $templateCache.put('views/upgrade.html',
    "<div layout=\"column\" layout-padding> <div layout=\"column\" layout-align=\"none center\"> <h3>Premium app coming soon.</h3> </div> </div>"
  );

}]);
