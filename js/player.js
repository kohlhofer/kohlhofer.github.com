// Load the IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var isPlaying = false;
var currentVideoId = '';

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '315',
    width: '560',
    playerVars: {
      listType: 'playlist',
      list: 'PLLXJQ4obAI9pHl0V7kgGh3reBL5bNS8EK',
      enablejsapi: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      rel: 0,
      loop: 1,
      iv_load_policy: 3,
      playlist: 'PLLXJQ4obAI9pHl0V7kgGh3reBL5bNS8EK',
      endscreen: 0
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  // Check if there's a video ID in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const videoId = urlParams.get('v');
  
  if (videoId) {
    // Find the index of the video in the playlist
    const playlist = player.getPlaylist();
    const videoIndex = playlist.indexOf(videoId);
    
    if (videoIndex !== -1) {
      // If video is in playlist, play it at its position
      player.playVideoAt(videoIndex);
      updateBackgroundImage(videoId); // Set initial background
    } else {
      // If video is not in playlist, load the playlist normally
      player.playVideoAt(0);
      updateBackgroundImage(playlist[0]); // Set background for first video
    }
  } else {
    // No specific video requested, start from beginning
    const playlist = player.getPlaylist();
    player.playVideoAt(0);
    if (playlist && playlist.length > 0) {
      updateBackgroundImage(playlist[0]); // Set background for first video
    }
  }
  
  // Enable shuffle by default
  player.setShuffle(true);
  document.getElementById('shuffleToggle').checked = true;
  
  updatePlayButton();
  setupEventListeners();
}

function onPlayerStateChange(event) {
  // Update play state
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
  } else if (event.data === YT.PlayerState.ENDED) {
    // When the last video ends, play the first one
    const playlist = player.getPlaylist();
    if (playlist && playlist.length > 0) {
      player.playVideoAt(0);
    }
  }
  
  updatePlayButton();
  
  // Update URL and background when video changes or starts playing
  const videoData = player.getVideoData();
  if (videoData && videoData.video_id !== currentVideoId) {
    currentVideoId = videoData.video_id;
    updateURL(currentVideoId);
    updateBackgroundImage(currentVideoId);
  }
}

function setupEventListeners() {
  document.getElementById('playButton').addEventListener('click', togglePlay);
  document.getElementById('nextButton').addEventListener('click', nextVideo);
  document.getElementById('prevButton').addEventListener('click', previousVideo);
  document.getElementById('shuffleToggle').addEventListener('change', toggleShuffle);
}

function nextVideo() {
  const playlist = player.getPlaylist();
  const currentIndex = player.getPlaylistIndex();
  
  if (currentIndex === playlist.length - 1) {
    // If at the last video, go to the first one
    player.playVideoAt(0);
  } else {
    player.nextVideo();
  }
}

function previousVideo() {
  const playlist = player.getPlaylist();
  const currentIndex = player.getPlaylistIndex();
  
  if (currentIndex === 0) {
    // If at the first video, go to the last one
    player.playVideoAt(playlist.length - 1);
  } else {
    player.previousVideo();
  }
}

function togglePlay() {
  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
}

function toggleShuffle() {
  const shuffleToggle = document.getElementById('shuffleToggle');
  const isShuffle = shuffleToggle.checked;
  shuffleToggle.checked = isShuffle;
  player.setShuffle(isShuffle);
}

function updatePlayButton() {
  const playButton = document.getElementById('playButton');
  const icon = playButton.querySelector('i');
  icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

function updateURL(videoId) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('v', videoId);
  window.history.replaceState({}, '', newUrl);
}

function updateBackgroundImage(videoId) {
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  // Create a temporary image to check if maxresdefault is available
  const img = new Image();
  img.onload = function() {
    const backgroundEl = document.getElementById('background-image');
    backgroundEl.style.backgroundImage = `url(${thumbnailUrl})`;
  };
  img.onerror = function() {
    // Fallback to hqdefault if maxresdefault is not available
    const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const backgroundEl = document.getElementById('background-image');
    backgroundEl.style.backgroundImage = `url(${fallbackUrl})`;
  };
  img.src = thumbnailUrl;
} 