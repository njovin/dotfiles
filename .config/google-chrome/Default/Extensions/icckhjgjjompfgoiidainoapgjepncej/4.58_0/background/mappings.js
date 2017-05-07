(function() {
  var mapping;

  window.findScriptByHost = function(host) {
    var name, script, value;
    if (host.indexOf("youtube") !== -1 && localStorage.getItem("ignore-youtube") === "true") {
      return "controllers/ShimController.js";
    }
    host = host.toLowerCase();
    script = null;
    for (name in mapping) {
      value = mapping[name];
      if (mapping.hasOwnProperty(name)) {
        if (host.indexOf(name) !== -1) {
          script = value;
        }
      }
    }
    console.log("Script", script, host);
    if (script) {
      return "controllers/" + script;
    } else {
      return "controllers/ShimController.js";
    }
  };

  mapping = {
    '8tracks': 'EightTracksController.js',
    '22tracks': '22tracksController.js',
    '99percentinvisible': 'SCMController.js',
    'amazon': 'AmazonController.js',
    'app.napster': 'NapsterController.js',
    'audible': 'AudibleController.js',
    'audiomack': 'AudiomackController.js',
    'audiosplitter': 'AudiosplitterController.js',
    'bandcamp': 'BandcampController.js',
    'bbc': 'BBCRadioPopOutController.js',
    'beatsmusic': 'BeatsMusicController.js',
    'bronytunes': 'BronyTunesController.js',
    'cliggo': 'CliggoController.js',
    'connect.monstercat': 'MonstercatController.js',
    'deezer': 'DeezerController.js',
    'di.fm': 'DIController.js',
    'dr.dk': 'DRController.js',
    'dreamfm': 'DreamfmController.js',
    'earbits': 'EarbitsController.js',
    'feedly': 'FeedlyController.js',
    'focusatwill': 'FocusAtWillController.js',
    'gaana': 'GaanaController.js',
    'getworkdonemusic': 'GetWorkDoneController.js',
    'giantbomb': 'GiantBombController.js',
    'gold.monstercat': 'MonstercatController.js',
    'hearthis': 'HearThisController.js',
    'hypem': 'HypemachineController.js',
    'iheart': 'iHeartController.js',
    'indieshuffle': 'IndieshuffleController.js',
    'jango': 'JangoController.js',
    'last': 'LastfmController.js',
    'license.monstercat': 'MonstercatController.js',
    'mixcloud': 'MixcloudController.js',
    'mixrad': 'NokiaMixradioController.js',
    'music.microsoft': 'XboxController.js',
    'musicforprogramming': 'MusicforprogrammingController.js',
    'netflix': 'NetflixController.js',
    'noonpacific': 'NoonPacificController.js',
    'one.npr': 'NPROneController.js',
    'overcast': 'OvercastController.js',
    'pandora': 'PandoraController.js',
    'play.google': 'GoogleMusicController.js',
    'player.fm': 'PlayerFMController.js',
    'pleer.com': 'PleerController.js',
    'plex': 'PlexController.js',
    'pocketcasts.com': 'PocketCastsController.js',
    'poolside': 'PoolsideController.js',
    'pony.fm': 'PonyFmController.js',
    'ponyvillelive': 'PonyvilleLiveController.js',
    'rbmaradio': 'RbmaController.js',
    'rdio': 'RdioController.js',
    'reddit.music.player.il.ly': 'RedditplayerController.js',
    'reddit.musicplayer.io': 'RedditplayerController.js',
    'rhapsody': 'RhapsodyController.js',
    'saavn': 'SaavnController.js',
    'scribd': 'ScribdController.js',
    'scmplayer': 'SCMFramelessController.js',
    'slacker': 'SlackerController.js',
    'songdrop': 'SongdropController.js',
    'soundcloud': 'SoundcloudController.js',
    'soundtracker': 'SoundtrackerController.js',
    'spotify': 'SpotifyController.js',
    'smule': 'SmuleController.js',
    'stitcher': 'StitcherController.js',
    'subsonic': 'SubsonicController.js',
    'sverigesradio': 'SverigesradioController.js',
    'themusicninja': 'TheMusicNinjaController.js',
    'thesixtyone': 'ThesixtyoneController.js',
    'tidal': 'TidalController.js',
    'tumblr': 'SCMController.js',
    'tunein': 'TuneinController.js',
    'twitter': 'TwitterController.js',
    'vimeo': 'VimeoController.js',
    'vk': 'VkController.js',
    'y.qq': 'QQMusicController.js',
    'music.yandex': 'YandexMusicController.js',
    'radio.yandex': 'YandexRadioController.js',
    'youtube': 'YoutubeController.js',
    'albumkings': 'AlbumKingsController.js',
    'itunes.apple.com': 'AppleMusicController.js'
  };

}).call(this);
