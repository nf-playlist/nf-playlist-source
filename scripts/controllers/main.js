'use strict';

app.controller('PlaylistCtrl', function ($scope, $http, YoutubePlaylist, SoundcloudPlaylist) {
  // SoundCloud stuff
  var iframeElement = document.querySelector('#scIframe'),
      widget = SC.Widget(iframeElement);
  $scope.scWidget = widget;

	// YouTube stuff
	function onYouTubeIframeAPIReady() {
		$scope.ytWidget = new YT.Player('ytIframe', {
			height: '390',
			width: '640',
			videoId: '',
			events: {
				'onReady': function(event){
          event.target.playVideo();
        },
        'onStateChange': function(data){
          if (data === 0) {
            $scope.playNext();
          }
        }
			}
		});
	}

  $scope.elements = [];

  YoutubePlaylist.getPlaylist().then(function(playlist){
    $scope.elements = $scope.elements.concat(playlist);
  }).then(function(){
    SoundcloudPlaylist.getPlaylist('130907148').then(function(playlist){
      $scope.elements = $scope.elements.concat(playlist);
    });
  }).then(function(){
    SoundcloudPlaylist.getPlaylist('206137365').then(function(playlist){
      $scope.elements = $scope.elements.concat(playlist);
      $scope.elements.sort(function(a, b){
       return b.date - a.date;
      });
			// XXX: comment this out?
			$scope.play($scope.elements[0]);
    });
  });

  $scope.scVisible = false;

  $scope.currentIndex = 0;

  $scope.playNext = function(){
    $scope.play($scope.elements[$scope.currentIndex + 1]);
  };

	var playSoundcloud = function(id){
    $scope.scVisible = true;
    var newSoundUrl = 'http://api.soundcloud.com/tracks/' + id + '?client_id=d570f7e4f4a321e577dfa5271ba42f32';
    $scope.scWidget.bind(SC.Widget.Events.READY, function() {
      $scope.scWidget.load(newSoundUrl, {
        show_artwork: false,
        auto_play: true
      });
    });
    $scope.scWidget.bind(SC.Widget.Events.FINISH, function() {
      $scope.playNext();
    });
  };

  var playYoutube = function(id){
    $scope.scVisible = false;
    $scope.scWidget.pause();
    $ytWidget.loadVideoById(id);
  };

  $scope.play = function(element){
    $scope.currentIndex = $scope.elements.indexOf(element);
    var id = element.id,
        player = element.type;
    if (player === 'sc') {
      playSoundcloud(id);
    } else {
      playYoutube(id);
    }
  };
});
