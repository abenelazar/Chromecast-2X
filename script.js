var currentMediaSession = null;
var currentVolume = 0.5;
var progressFlag = 1;
var mediaCurrentTime = 0;
var session = null;
var autoJoinPolicy = 'tab_and_origin_scoped';
var mediaInfo = null;



$(document).ready(function(){
	
	if (!chrome.cast || !chrome.cast.isAvailable) {
		setTimeout(initializeCastApi, 1000);
	}
	
	function initializeCastApi() {
	  var sessionRequest = new chrome.cast.SessionRequest(chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID);
	  var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
	    sessionListener,
	    receiverListener,
	    autoJoinPolicy);
	
	  chrome.cast.initialize(apiConfig, onInitSuccess, onError);
	};
		
		
	function sessionListener(e) {
	  console.log('New session ID: ' + e.sessionId);
	  session = e;
	  if (session.media.length != 0) {
	      onMediaDiscovered('onRequestSessionSuccess_', session.media[0]);
	  }
	  session.addMediaListener(
	      onMediaDiscovered.bind(this, 'addMediaListener'));
	  session.addUpdateListener(sessionUpdateListener.bind(this));  
	}
	
	
	function receiverListener(e) {
	  if( e === 'available' ) {
	    console.log("receiver found");
	  }
	  else {
	    console.log("receiver list empty");
	  }
	}		
	
	function onMediaDiscovered(how, mediaSession) {
	  console.log("new media session ID:" + mediaSession.mediaSessionId);
	  currentMediaSession = mediaSession;
	  //mediaSession.addUpdateListener(onMediaStatusUpdate);

	}
	

	function launchApp() {
	  console.log("launching app...");
	  chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
	}
	
	
	function onInitSuccess() {
		launchApp();
	}
	
	
	function onRequestSessionSuccess(e){
		console.log("success");
		session = e;
	}


	function onError() {
	  console.log("error");
	}


	function onSuccess(message) {
	  console.log(message);
	}
	
	
	function onLaunchError(){
	  console.log("launch error");		
	}
	
	
	function onMediaError(e) {
	  console.log("media error");
	}
	

	function loadMedia(){
		mediaInfo = new chrome.cast.media.MediaInfo('http://www.nasa.gov/downloadable/videos/noaas_goes-east_satellite_shows_storm_systems.mp4', 'video/mp4');
		mediaInfo.metadata = new chrome.cast.media.PhotoMediaMetadata();
		mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.PHOTO;
		mediaInfo.contentType = 'video/mp4';
		var request = new chrome.cast.media.LoadRequest(mediaInfo);
		session.loadMedia(request,onMediaDiscovered.bind(this, 'loadMedia'), onMediaError.bind(this));


	}
	
	
	$('#castme').click(function(e){
		loadMedia();
	});



	
});

	function speed(x){
  		session.playbackRate=x;
		$('#pbrate').html(x);
	}		
