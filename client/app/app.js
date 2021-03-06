import peachRc from '../../.peachrc';

import angular from 'angular';
import angularAnimate from 'angular-animate';
import angularAria from 'angular-aria';
import angularCache from 'angular-cache';
import angularCookies from 'angular-cookies';
import angularMaterial from 'angular-material';
import angularRoute from 'angular-route';
import angularSanitize from 'angular-sanitize';
import 'lodash';
import 'ng-peach';

import 'angular-material/angular-material.min.css';
import 'peach.css';

import routing from './app.config';

// Components
import Home from './components/home/home';
import Todo from './components/todo/todo';
import TodoEdit from './components/todo/todo-edit';

// Services
import AccountPrefsService from './common/services/account-prefs-service/account-prefs-service';
import InitializeService from './common/services/initialize-service/initialize-service';
import TasksService from './common/services/tasks-service/tasks-service';
import TaskSchedulesService from './common/services/task-schedules-service/task-schedules-service';
import UsersService from './common/services/users-service/users-service';

angular.module(peachRc.framework.angular.module, [
  angularAnimate,
  angularAria,
  angularCache,
  angularCookies,
  angularMaterial,
  angularRoute,
  angularSanitize,
  'ngPeach.ui', // Need to fix this to export properly from ngPeach
  AccountPrefsService.module_name,
  InitializeService.module_name,
  TasksService.module_name,
  TaskSchedulesService.module_name,
  UsersService.module_name
])
  .config(routing)
  .controller(Home.controllerName, Home.controller)
  .controller(Todo.controllerName, Todo.controller)
  .controller(TodoEdit.controllerName, TodoEdit.controller);

export default peachRc.framework.angular.module;
