'use strict';

app.factory('YoutubePlaylist', function ($http) {
  return {
    getPlaylist: function(){
      return $http({
          method: 'GET',
          url: 'https://www.googleapis.com/youtube/v3/search',
          params: {
            part: 'snippet',
            order: 'rating',
            // TODO: put this in a config file
            q: 'front end web development',
            type: 'video',
            videoEmbeddable: true,
            // TODO: put this in a config file
            maxResults: 20,
            // TODO: put this in a config file
            key: 'AIzaSyCu56RQ7hVXo3sUsFGE_SSLTR_DJNIUsJQ'
          }
        }).then(function(response){
          var items = response.data.items,
              list = [];
          for (var el in items) {
            list.push({type: 'yt',
                       id: items[el].id.videoId,
                       title: items[el].snippet.title,
                       // not using moments.js, since Date is parsing this format correctly
                       date: new Date(items[el].snippet.publishedAt)});
          }
          return list;
      });
    }
  }
});

app.factory('SoundcloudPlaylist', function ($http) {
  return {
    getPlaylist: function(userId){
      return $http({
          method: 'GET',
          url: 'http://api.soundcloud.com/users/' + userId + '/tracks',
          params: {
            // TODO: put this in a config file
            client_id: 'd570f7e4f4a321e577dfa5271ba42f32'
          }
        }).then(function(response){
          var items = response.data,
              list = [];
          for (var el in items) {
            list.push({type: 'sc',
                       id: items[el].id,
                       title: items[el].title,
                       // not using moments.js, since Date is parsing this format correctly
                       date: new Date(items[el].created_at)});
          }
          return list;
      });
    }
  }
});
