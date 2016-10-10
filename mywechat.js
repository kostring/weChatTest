'use strict';

var API = require('wechat-api');
var config = require('./config/env/' + (process.env.NODE_ENV || 'production'));
var api = new API(config.wechat.appid, config.wechat.appsecret);
var Promise = require('bluebird');

console.log('current env:', process.env.NODE_ENV);

function getMenu() {
  api.getMenu(function(err, menu) {
    if (err) {
      return console.error(err);
    }

    console.log('当前菜单\n', JSON.stringify(menu));
  });
}

function createMenu() {
  var menu = {
    button: [{
      name: '点赞',
      sub_button: [{
        type: 'view',
        name: '我要报名',
        url: 'http://www.netshero.com/events/4/signup'
      }, {
        type: 'view',
        name: '最新活动',
        url: 'http://www.netshero.com/wechat/events'
      }, {
        type: 'view',
        name: '活动回顾',
        url: 'http://www.netshero.com/wechat/news'
      }]
    }, {
      name: '点将台',
      sub_button: [{
        type: 'view',
        name: '导师语录',
        url: 'http://www.netshero.com/wechat/mentor'
      }, {
        type: 'view',
        name: '会员风采',
        url: 'http://www.netshero.com/wechat/shero'
      }, {
        type: 'click',
        name: '领袖对话',
        key: 'COMING_SOON'
      }, {
        type: 'click',
        name: '合作伙伴',
        key: 'http://www.netshero.com/partners.html'
      }]
    }, {
      name: '点点有礼',
      sub_button: [{
        type: 'view',
        name: '在线注册',
        url: 'http://www.netshero.com/wechat/register'
      }, {
        type: 'click',
        name: '增值服务',
        key: 'COMING_SOON'
      }]
    }]
  };

  api.createMenu(menu, function(err, res) {
    console.log(err, res);
  });
}

//createMenu();

function hashPass(password) {
  var bcrypt = require('bcryptjs');
  bcrypt.hash(password, 8, function(err, hash) {
    if (err) {
      throw err;
    }
    console.log(hash);
  });
}

//hashPass('xxx');
function getUser(openid) {
  api.getUser(openid, function(err, user) {
    console.log(err || user);
  });
}
//getUser('oCL2ljn3bFHuOCRoN1XX0T5jADlE');

function fixPassport() {
  var sails = require('sails');
  sails.lift(function(err, sails) {
    console.log('app lifted');

    function updateUser(openid) {
      var User = sails.models.user;
      var Passport = sails.models.passport;

      var passport = {
        protocol: 'oauth2',
        provider: 'wechat',
        tokens: {
          accessToken: 'OezXcEiiBSKSxW0eoylIeNWYzR8xMx5XzBTPAYrgOdF78ZH6Q3TKv90ODpOaWm2GiJKEDbYkCWkHcw5Xxp2pZuET5qKufqwr_7jXsv5J4dU6vFwSwLR0mVqTiADjZsj3fR6Z1Wj_4Pm7XhGKX0ePvQ',
          refreshToken: 'OezXcEiiBSKSxW0eoylIeNWYzR8xMx5XzBTPAYrgOdF78ZH6Q3TKv90ODpOaWm2GAVrVYLxS'
        }
      };
      api.getUser(openid, function(err, user) {
        passport.profile = user;
        passport.identifier = user.unionid || user.openid;

        User.findOneByUsername('wx-' + openid).then(function(user) {
          passport.user = user.id;
          user.username = 'wx-' + passport.identifier;
          console.log('save user', user);
          return user.save();
        }).then(function() {
          return Passport.create(passport);
        }).then(function(passport) {
          console.log('created passport', passport);
        }).catch(function(err) {
          console.error(err);
        });
      });
    }

    var openids = [
      'oCL2ljn3bFHuOCRoN1XX0T5jADlE',
      'oCL2ljnYZ2HBJaVcX6rgkkGQw5qs',
      'oCL2ljui3FuXdHpjWmIAF2g0Ud-k',
      'oCL2ljhEjixuit8J15QYHMkL6QSA',
      'oCL2ljuDoiSFz9MxwRSUvYDUavWQ'
    ];

    openids.forEach(updateUser);

  });
}

//fixPassport();

function grantPermissions() {
  var sails = require('sails');
  sails.lift(function(err, sails) {
    console.log('app lifted');
    var PermissionService = sails.services.permissionservice;

    function grant(role, permissions) {
      var runners = [];
      permissions.forEach(function(permission) {
        permission.actions.map(function(action) {
          return PermissionService.grant({
            role: role,
            model: permission.model,
            action: action
          });
        }).concat(runners);
      });
      return runners;
    }

    function flatPermissions(permissions) {
      return _.flatten(permissions.map(function(permission) {
        console.log(permission);
        return permission.actions.map(function(action) {
          return {
            model: permission.model,
            action: action
          };
        });
      }));
    }

    var settings = [{
      model: 'Article',
      actions: ['create', 'read', 'update', 'delete']
    }, {
      model: 'Page',
      actions: ['read', 'update']
    }, {
      model: 'Event',
      actions: ['create', 'read', 'update']
    }];
    var Role = sails.models.role;

    Role.findOne({
      name: 'editor'
    }).then(function(role) {
      if (role) {
        return Promise.all(grant('editor', settings))
.then(function(permissions) {

          console.log(permissions);

        });
      }

      PermissionService.createRole({
        name: 'editor',
        permissions: flatPermissions(settings)
      }).then(function(permissions) {

        console.log(permissions);

      });
    });
  });
}

function grantUser(username) {
  var sails = require('sails');
  sails.lift(function(err, sails) {
    console.log('app lifted');
    var PermissionService = sails.services.permissionservice;

    PermissionService.addUsersToRole(username, 'editor').then(function(result) {
      console.log(result);
    });
  });
}

//grantPermissions();
//grantUser('loulin');

function sendText() {
  api.sendTemplate('oRqqWwLvigNgNOUb5k3-iTRoIV_U', 'jeL4WaoA4tUSI7SXQM5c5rEFwPdAcp27FNEsSx8TZDI', null, '#FF0000', {
    first: {
      value: '报名成功通知',
      color: '#173177'
    },
    keynote1: {
      value: '今晚抱枕旅行正式开启',
      color: '#173177'
    },
    keynote2: {
      value: '凌晨一点钟',
      color: '#173177'
    },
    keynote3: {
      value: '你家楼顶',
      color: '#173177'
    },
    remark: {
      value: '记得带上女朋友哦',
      color: '#173177'
    }
  }, function(err, result) {
    console.log(err, result);
  });
}

//sendText();
