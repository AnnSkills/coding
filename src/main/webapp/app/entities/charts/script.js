desktopApp = angular.module('desktopApp', []);

desktopApp.run(function () {
  var tag = document.createElement('script');
  tag.src = "//www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

desktopApp.service('youtubePlayerApi', ['$window', '$rootScope', '$log',
  function ($window, $rootScope, $log) {
    var service = $rootScope.$new(true);

    // Youtube callback when API is ready
    $window.onYouTubeIframeAPIReady = function () {
      $log.info('Youtube API is ready');
      service.ready = true;
      service.loadPlayer();
    };

    service.ready = false;
    service.playerId = 'yplayer';//id of a player element
    service.player = null;
    service.videoId = null;
    service.playerHeight = '390';
    service.playerWidth = '640';

    service.bindVideoPlayer = function (videoId) {
      $log.info('Binding to player ' + videoId);
      service.videoId = videoId;
    };

    service.createPlayer = function () {
      $log.info('Creating a new Youtube player for DOM id ' + this.playerId + ' and video ' + this.videoId);
      return new YT.Player(this.playerId, {
        height: this.playerHeight,
        width: this.playerWidth,
        videoId: this.videoId,
        events: {
          'onReady': this.onPlayerReady
        }
      });
    };

    service.onPlayerReady = function(event) {
      $log.info('onPlayerReady');
      event.target.playVideo();
    };
    service.loadPlayer = function () {
      // API ready?
      $log.info('API ready?');
      $log.info(this.ready);
      $log.info(this.playerId);
      $log.info(this.videoId);

      if (this.ready && this.playerId && this.videoId) {
        if(this.player) {
          //this.player.destroy();
          var playerState = this.player.getPlayerState();
          if(playerState==1 || playerState==2 || playerState==3){
            this.player.stopVideo();
          }
          this.player.loadVideoById({'videoId': this.videoId});
        }
        else{
          $log.info('loadPlayer');
          this.player = this.createPlayer();
        }
      }
    };

    return service;
  }])


desktopApp.controller('PlayerController', ['$scope', 'youtubePlayerApi',
  function($scope, youtubePlayerApi) {
    youtubePlayerApi.bindVideoPlayer('pco91kroVgQ');

    $scope.changeSlide = function(videoId){
      youtubePlayerApi.bindVideoPlayer(videoId);
      youtubePlayerApi.loadPlayer();

    }
  }]);

