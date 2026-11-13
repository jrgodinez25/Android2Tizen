(function () {
  "use strict";
  var songs = window.DEMO_SONGS || [];
  var selected = null;
  var queue = [];
  var typed = "";
  var playing = false;
  var demoStartedAt = 0;
  var pausedAt = 0;
  var tickHandle = null;
  var audioObjectUrl = null;
  var audio = document.getElementById("audio");
  var $ = function (id) { return document.getElementById(id); };

  function detectDeviceRuntime() {
    var parts = [];
    try {
      if (window.tizen && tizen.systeminfo) {
        parts.push("TIZEN " + tizen.systeminfo.getCapability("http://tizen.org/feature/platform.version"));
      }
    } catch (e) { parts.push("TIZEN VERSION UNAVAILABLE"); }
    try {
      if (window.webapis && webapis.productinfo) {
        var model = webapis.productinfo.getModel();
        var firmware = webapis.productinfo.getFirmware();
        if (model) parts.push(model);
        if (firmware) parts.push("FW " + firmware);
      }
    } catch (e) { parts.push("PRODUCT INFO UNAVAILABLE"); }
    var label = $("deviceRuntime");
    if (label) label.textContent = parts.length ? parts.join(" · ") : "TV PLATFORM: BROWSER / NOT DETECTED";
    console.log("[Karaoke TV] Runtime diagnostics:", parts);
  }

  function toast(message) {
    var old = document.querySelector(".toast");
    if (old) old.remove();
    var el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2100);
  }
  function formatTime(seconds) {
    seconds = Math.max(0, Math.floor(seconds || 0));
    return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
  }
  function renderSongs() {
    var q = $("search").value.trim().toLowerCase();
    var filtered = songs.filter(function (s) {
      return !q || (s.number + " " + s.title + " " + s.artist).toLowerCase().indexOf(q) >= 0;
    });
    $("songCount").textContent = String(filtered.length).padStart(2, "0");
    $("songList").innerHTML = "";
    filtered.forEach(function (song) {
      var button = document.createElement("button");
      button.className = "song" + (selected && selected.number === song.number ? " selected" : "");
      button.dataset.number = song.number;
      button.innerHTML = '<span class="song-number"></span><span class="song-meta"><strong></strong><small></small></span><span class="song-add">＋</span>';
      button.querySelector(".song-number").textContent = song.number;
      button.querySelector("strong").textContent = song.title;
      button.querySelector("small").textContent = song.artist;
      button.addEventListener("click", function () { selectSong(song); });
      $("songList").appendChild(button);
    });
  }
  function renderQueue() {
    $("queueCount").textContent = String(queue.length).padStart(2, "0");
    $("queueList").innerHTML = "";
    if (!queue.length) {
      var empty = document.createElement("div");
      empty.className = "empty-queue";
      empty.innerHTML = "Your queue is empty.<br><small>Choose a song and press RESERVE.</small>";
      $("queueList").appendChild(empty);
      return;
    }
    queue.forEach(function (song, index) {
      var row = document.createElement("div");
      row.className = "queue-item";
      var pos = document.createElement("span"); pos.className = "queue-pos"; pos.textContent = String(index + 1).padStart(2, "0");
      var info = document.createElement("span"); info.className = "queue-info";
      var title = document.createElement("strong"); title.textContent = song.title;
      var artist = document.createElement("small"); artist.textContent = song.number + " · " + song.artist;
      info.appendChild(title); info.appendChild(artist);
      var remove = document.createElement("button"); remove.className = "remove"; remove.textContent = "×"; remove.setAttribute("aria-label", "Remove " + song.title);
      remove.addEventListener("click", function () { queue.splice(index, 1); renderQueue(); });
      row.appendChild(pos); row.appendChild(info); row.appendChild(remove); $("queueList").appendChild(row);
    });
  }
  function updateNumber() {
    var display = (typed + "_____").slice(0, 5).split("").join(" ");
    $("numberDisplay").textContent = display;
    var landingDisplay = $("selectNumberDisplay");
    if (landingDisplay) landingDisplay.textContent = display;
  }
  function renderQuickPicks() {
    var host = $("quickPickList");
    if (!host) return;
    var query = ($("selectSearch") ? $("selectSearch").value : "").trim().toLowerCase();
    var filtered = songs.filter(function (song) {
      if (!query) return true;
      var lyrics = (song.lyrics || []).map(function (cue) { return cue.text; }).join(" ");
      return (song.number + " " + song.title + " " + song.artist + " " + lyrics).toLowerCase().indexOf(query) >= 0;
    });
    host.innerHTML = "";
    filtered.slice(0, 8).forEach(function (song) {
      var button = document.createElement("button");
      button.className = "quick-song";
      button.innerHTML = '<span class="quick-index"></span><span><strong></strong><small></small></span>';
      button.querySelector(".quick-index").textContent = song.number;
      button.querySelector("strong").textContent = song.title;
      button.querySelector("small").textContent = song.artist;
      button.addEventListener("click", function () { selectSong(song); });
      host.appendChild(button);
    });
    if (!filtered.length) {
      var empty = document.createElement("div");
      empty.className = "quick-empty";
      empty.textContent = "No matching demo songs. Try a title, singer, number or lyric phrase.";
      host.appendChild(empty);
    }
    var count = $("quickResultCount");
    if (count) count.textContent = filtered.length + " MATCH" + (filtered.length === 1 ? "" : "ES");
  }
  function handleDigitAction(button) {
    if (!button) return;
    if (button.dataset.digit !== undefined) {
      if (typed.length < 5) typed += button.dataset.digit;
      updateNumber();
      if (typed.length === 5) findNumber();
    } else if (button.dataset.action === "clear") {
      typed = ""; updateNumber();
    } else if (button.dataset.action === "backspace") {
      typed = typed.slice(0, -1); updateNumber();
    }
  }
  function selectSong(song) {
    selected = song;
    var landing = $("selectScreen");
    if (landing) landing.style.display = "none";
    $("stageNumber").textContent = song.number;
    $("stageTitle").textContent = song.title;
    $("stageArtist").textContent = song.artist;
    $("nowPlaying").textContent = song.title + " — " + song.artist;
    $("playbackLabel").textContent = "DEMO LYRIC CUE · NO MUSIC TRACK";
    $("stageMode").textContent = "READY";
    $("elapsed").textContent = "00:00 / " + formatTime(song.duration);
    $("playBtn").disabled = false; $("stopBtn").disabled = false; $("nextBtn").disabled = false;
    $("lyricArea").innerHTML = '<p class="lyric muted">Press PLAY DEMO to preview the synchronized lyric cues.</p>';
    stopPlayback(false);
    renderSongs();
  }
  function findNumber() {
    if (typed.length !== 5) { toast("Enter a five-digit song number."); return; }
    var song = songs.find(function (s) { return s.number === typed; });
    if (!song) { toast("That number is not in the demo catalog."); return; }
    selectSong(song); typed = ""; updateNumber();
  }
  function reserveSelected() {
    if (!selected) { toast("Select a song first."); return; }
    if (queue.some(function (s) { return s.number === selected.number; })) { toast("That song is already reserved."); return; }
    queue.push(selected); renderQueue(); toast("Reserved: " + selected.title);
  }
  function renderLyrics(time) {
    if (!selected) return;
    var cues = selected.lyrics;
    var current = -1;
    for (var i = 0; i < cues.length; i++) if (time >= cues[i].at) current = i;
    var area = $("lyricArea"); area.innerHTML = "";
    if (current < 0) {
      var waiting = document.createElement("p"); waiting.className = "lyric muted"; waiting.textContent = "♪  Get ready to sing  ♪"; area.appendChild(waiting); return;
    }
    [current, current + 1].forEach(function (idx, offset) {
      if (!cues[idx]) return;
      var line = document.createElement("p");
      line.className = "lyric " + (offset === 0 ? "active" : "muted");
      line.textContent = cues[idx].text;
      area.appendChild(line);
    });
  }
  function activeDuration() {
    return audio.src && isFinite(audio.duration) ? audio.duration : (selected ? selected.duration : 0);
  }
  function tick() {
    if (!playing || !selected) return;
    var time = audio.src ? audio.currentTime : (Date.now() - demoStartedAt) / 1000;
    var duration = activeDuration();
    renderLyrics(time);
    $("elapsed").textContent = formatTime(time) + " / " + formatTime(duration);
    if (time >= duration) { stopPlayback(false); toast("Demo cue finished."); }
    else tickHandle = setTimeout(tick, 100);
  }
  function startPlayback() {
    if (!selected) return;
    if (audio.src) {
      try { audio.currentTime = 0; var p = audio.play(); if (p && p.catch) p.catch(function () { toast("Audio playback is unavailable. Using lyric cue preview."); audio.removeAttribute("src"); startCueOnly(); }); }
      catch (e) { startCueOnly(); }
    } else startCueOnly();
  }
  function startCueOnly() {
    playing = true; demoStartedAt = Date.now(); $("stageMode").textContent = "LYRIC PREVIEW";
    $("statusText").textContent = "LYRIC PREVIEW RUNNING"; $("playBtn").textContent = "Ⅱ PAUSE";
    tick();
  }
  function pausePlayback() {
    if (!playing) return;
    var current = audio.src ? audio.currentTime : (Date.now() - demoStartedAt) / 1000;
    pausedAt = current; playing = false; clearTimeout(tickHandle);
    if (audio.src) audio.pause();
    $("stageMode").textContent = "PAUSED"; $("playBtn").textContent = "▶ RESUME";
  }
  function stopPlayback(reset) {
    playing = false; clearTimeout(tickHandle);
    if (audio.src) { audio.pause(); try { audio.currentTime = 0; } catch (e) {} }
    if (reset !== false && selected) { renderLyrics(0); $("elapsed").textContent = "00:00 / " + formatTime(selected.duration); }
    $("playBtn").textContent = "▶ PLAY DEMO";
    if (selected) { $("stageMode").textContent = "READY"; $("statusText").textContent = "READY TO SING"; }
  }
  function resumePlayback() {
    if (!selected) return;
    if (audio.src) { audio.play(); playing = true; $("stageMode").textContent = "PLAYING"; $("playBtn").textContent = "Ⅱ PAUSE"; tick(); }
    else { playing = true; demoStartedAt = Date.now() - pausedAt * 1000; $("stageMode").textContent = "LYRIC PREVIEW"; $("playBtn").textContent = "Ⅱ PAUSE"; tick(); }
  }
  function nextSong() {
    stopPlayback();
    if (!queue.length) { toast("No reserved songs."); return; }
    selected = queue.shift(); renderQueue(); selectSong(selected); toast("Next song selected. Load its matching audio and LRC files.");
  }
  $("search").addEventListener("input", renderSongs);
  if ($("selectKeypad")) $("selectKeypad").addEventListener("click", function (event) {
    handleDigitAction(event.target.closest("button"));
  });
  if ($("selectFindBtn")) $("selectFindBtn").addEventListener("click", findNumber);
  if ($("selectSearch")) $("selectSearch").addEventListener("input", renderQuickPicks);
  $("keypad").addEventListener("click", function (event) {
    var button = event.target.closest("button"); if (!button) return;
    if (button.dataset.digit !== undefined) { if (typed.length < 5) typed += button.dataset.digit; updateNumber(); if (typed.length === 5) findNumber(); }
    if (button.dataset.action === "clear") { typed = ""; updateNumber(); }
    if (button.dataset.action === "backspace") { typed = typed.slice(0, -1); updateNumber(); }
  });
  $("findBtn").addEventListener("click", findNumber);
  $("reserveBtn").addEventListener("click", reserveSelected);
  $("clearQueue").addEventListener("click", function () { queue = []; renderQueue(); toast("Queue cleared."); });
  $("playBtn").addEventListener("click", function () { if (playing) pausePlayback(); else if (pausedAt > 0 && $("stageMode").textContent === "PAUSED") resumePlayback(); else startPlayback(); });
  $("stopBtn").addEventListener("click", function () { pausedAt = 0; stopPlayback(); });
  $("nextBtn").addEventListener("click", nextSong);
  $("loadAudioBtn").addEventListener("click", function () { $("audioFile").click(); });
  $("loadLrcBtn").addEventListener("click", function () { $("lrcFile").click(); });
  $("audioFile").addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
    audioObjectUrl = URL.createObjectURL(file);
    audio.src = audioObjectUrl;
    audio.load();
    if (!selected) selectSong(songs[0]);
    $("playbackLabel").textContent = "LOCAL AUDIO · " + file.name;
    toast("Audio loaded. Import a matching .LRC file for synchronized lyrics.");
  });
  $("lrcFile").addEventListener("change", function (event) {
    var file = event.target.files && event.target.files[0];
    if (!file || !selected) { toast("Select a song before loading an LRC file."); return; }
    var reader = new FileReader();
    reader.onload = function () {
      var lines = String(reader.result || "").split(/\r?\n/);
      var cues = [];
      lines.forEach(function (line) {
        var match = line.match(/^\s*\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\](.*)$/);
        if (!match) return;
        var fraction = match[3] ? Number("0." + match[3]) : 0;
        cues.push({at: Number(match[1]) * 60 + Number(match[2]) + fraction, text: match[4].trim()});
      });
      cues.sort(function (a, b) { return a.at - b.at; });
      if (!cues.length) { toast("No valid LRC timestamp lines found."); return; }
      selected.lyrics = cues;
      toast("Loaded " + cues.length + " lyric cues.");
      if (!playing) renderLyrics(0);
    };
    reader.readAsText(file);
  });
  $("audio").addEventListener("loadedmetadata", function () {
    if (selected) $("elapsed").textContent = "00:00 / " + formatTime(activeDuration());
  });
  $("audio").addEventListener("ended", function () { stopPlayback(); });


  var settingsContent = {
    sound: ["Sound", "Choose an instrument sound and tune the mix for your room.", [["Instrument banks","Major · DreamsAM · Classic","Sound-bank loading and MIDI synthesis are a separate audio-engine milestone."],["Sound mixer","Bass · Drums · Others · Bass boost · Treble","Mixer controls will be connected after the Tizen audio engine is integrated."],["Echo","Off · Light · Normal · Strong","Echo processing is not active in this UI milestone."],["Sound quality","Auto · High · Light","Quality profiles require audio-engine benchmarking on the TV."]]],
    singing: ["Singing", "Configure melody guidance, scoring, count-in and recording behavior.", [["Melody guide","On / Off","MIDI melody-channel playback is not yet connected."],["Score after each song","For fun · Mic · Off","Microphone scoring requires supported audio input and DSP."],["Count-in","Dots · 4 3 2 1 · Your pictures","Count-in presentation will be implemented with the stage player."],["Recording","Audio · Video · Per-song file","Recording is not enabled in this build."]]],
    lyrics: ["Lyrics", "Customize the appearance and placement of karaoke lyrics.", [["Font","Standard · Easy to read · Modern · Narrow · Heavy","Font choices will be applied to the live lyric renderer."],["Colour","Classic · Mint · Gold · Pink · White to Yellow","Word-level colour wipe requires timed lyric syllables."],["Outline","Thin · Normal · Thick","Outline preferences will be persisted in a later settings milestone."],["Lines and position","2 lines · 3 lines · Lower · Middle","The current preview supports two timed cue lines."]]],
    screen: ["Screen and background", "Choose the stage look, background media and TV presentation.", [["Theme","Green · Ocean blue · Purple night · Rose · Soft dark","The green theme is currently active; theme switching is planned."],["Background","Videos and photos · Videos only · Photos only · Plain","Background slideshow playback is not yet integrated."],["Picture changes","Once a song · Every 5 s · Every 8 s · Every 10 s","Requires local media library support."],["Singing screen","Auto-rotate · Landscape · Portrait · Stage on TV","TV output and orientation behavior will be verified on hardware."]]],
    library: ["Your songs and sounds", "Add user-owned songs, sound banks, photos and videos.", [["USB drive or SD card","Add a folder","TV file-picker and removable-storage access need device testing."],["Kara-okay folder","Scan a selected folder","Folder scanning and catalog indexing are not yet implemented."],["Song formats","MIDI · KAR · MP3 · MP4","Only browser-supported local audio preview is currently available."],["Sound bank","SF2","SF2 loading depends on the selected licensed synthesizer."]]],
    remote: ["TV and remote", "Use a phone as a remote or configure TV-first navigation.", [["Phone remote","Pair device","A local-network remote service and pairing flow are not yet implemented."],["Allow other phones","Admin / Guest","Authentication and guest permissions are planned."],["Screen layout","Automatic · TV · Phone","This Tizen app currently targets the TV layout."]]],
    about: ["Songs, app and about", "Review catalog status, updates, storage and application information.", [["Song catalog","Demo catalog only","No commercial or copyrighted song catalog is bundled."],["Updates","Check for an update","An update service is not configured."],["About","Android2Tizen · KARAOKE TV","Independent clean-room Tizen implementation."]]]
  };
  function openSettings() {
    $("selectScreen").style.display = "none";
    $("settingsScreen").hidden = false;
    $("settingsDetail").hidden = true;
    $("settingsGrid").hidden = false;
    var first = $("settingsGrid").querySelector("button");
    if (first) first.focus();
  }
  function closeSettings() {
    $("settingsScreen").hidden = true;
    if (!selected && !playing) {
      $("selectScreen").style.display = "grid";
      if ($("selectKeypad")) $("selectKeypad").querySelector("button").focus();
    }
  }
  function showSettingsDetail(key) {
    var item = settingsContent[key];
    if (!item) return;
    $("settingsDetailTitle").textContent = item[0];
    $("settingsDetailText").textContent = item[1];
    var body = $("settingsDetailBody");
    body.innerHTML = "";
    item[2].forEach(function (row) {
      var el = document.createElement("div");
      el.className = "settings-detail-row";
      var title = document.createElement("strong"); title.textContent = row[0];
      var choices = document.createElement("div"); choices.textContent = row[1];
      var note = document.createElement("small"); note.textContent = row[2];
      el.appendChild(title); el.appendChild(choices); el.appendChild(note); body.appendChild(el);
    });
    $("settingsGrid").hidden = true;
    $("settingsDetail").hidden = false;
    $("settingsDetailBack").focus();
  }
  if ($("settingsOpen")) $("settingsOpen").addEventListener("click", openSettings);
  if ($("settingsBack")) $("settingsBack").addEventListener("click", closeSettings);
  if ($("settingsDetailBack")) $("settingsDetailBack").addEventListener("click", function () {
    $("settingsDetail").hidden = true; $("settingsGrid").hidden = false;
    var first = $("settingsGrid").querySelector("button"); if (first) first.focus();
  });
  if ($("settingsGrid")) $("settingsGrid").addEventListener("click", function (event) {
    var card = event.target.closest("button[data-setting]");
    if (card) showSettingsDetail(card.dataset.setting);
  });

  document.addEventListener("keydown", function (event) {
    var key = event.key;
    if (/^[0-9]$/.test(key) && document.activeElement.tagName !== "INPUT") {
      if (typed.length < 5) typed += key; updateNumber(); if (typed.length === 5) findNumber(); event.preventDefault(); return;
    }
    if (key === "Enter" && document.activeElement.closest && document.activeElement.closest(".quick-song")) {
      return; // Let the focused quick-pick button receive its native activation.
    }
    if (key === "Enter" && document.activeElement.tagName !== "INPUT") {
      var focusedSong = document.activeElement.closest ? document.activeElement.closest(".song") : null;
      if (focusedSong) {
        var focusedMatch = songs.find(function (s) { return s.number === focusedSong.dataset.number; });
        if (focusedMatch) selectSong(focusedMatch);
      } else if (document.activeElement.id === "playBtn") {
        if (playing) pausePlayback(); else if (pausedAt > 0 && $("stageMode").textContent === "PAUSED") resumePlayback(); else startPlayback();
      } else if (document.activeElement.id === "reserveBtn") reserveSelected();
      else if (document.activeElement.id === "nextBtn") nextSong();
      else if (document.activeElement.id === "stopBtn") { pausedAt = 0; stopPlayback(); }
      else if (document.activeElement.dataset && document.activeElement.dataset.digit !== undefined) {
        if (typed.length < 5) typed += document.activeElement.dataset.digit;
        updateNumber(); if (typed.length === 5) findNumber();
      } else if (selected) reserveSelected();
      event.preventDefault();
    }
    if (key === "ArrowDown" || key === "ArrowUp" || key === "ArrowLeft" || key === "ArrowRight") {
      var focusables = Array.prototype.slice.call(document.querySelectorAll("button:not(:disabled),input:not(:disabled)"))
        .filter(function (el) { return el.offsetWidth > 0 && el.offsetHeight > 0; });
      var current = focusables.indexOf(document.activeElement);
      if (current < 0) { focusables[0] && focusables[0].focus(); }
      else {
        var currentRect = document.activeElement.getBoundingClientRect();
        var direction = key.replace("Arrow", "").toLowerCase();
        var candidates = focusables.filter(function (el) {
          if (el === document.activeElement) return false;
          var r = el.getBoundingClientRect();
          if (direction === "down") return r.top >= currentRect.bottom - 8;
          if (direction === "up") return r.bottom <= currentRect.top + 8;
          if (direction === "right") return r.left >= currentRect.right - 8;
          return r.right <= currentRect.left + 8;
        }).map(function (el) {
          var r = el.getBoundingClientRect();
          var dx = (r.left + r.width / 2) - (currentRect.left + currentRect.width / 2);
          var dy = (r.top + r.height / 2) - (currentRect.top + currentRect.height / 2);
          return { el: el, score: Math.abs(direction === "left" || direction === "right" ? dx : dy) + Math.abs(direction === "left" || direction === "right" ? dy : dx) * 2 };
        }).sort(function (x, y) { return x.score - y.score; });
        if (candidates[0]) candidates[0].el.focus();
      }
      event.preventDefault();
    }
    if (key === "Escape" || key === "Backspace" || event.keyCode === 10009) {
      if (!$("settingsScreen").hidden) {
        if (!$("settingsDetail").hidden) { $("settingsDetail").hidden = true; $("settingsGrid").hidden = false; $("settingsBack").focus(); }
        else closeSettings();
        event.preventDefault(); return;
      }
      var landing = $("selectScreen");
      if (landing && landing.style.display === "none" && !playing) {
        landing.style.display = "grid";
        if ($("selectSearch")) $("selectSearch").value = "";
        renderQuickPicks();
        event.preventDefault();
        return;
      }
      if (document.activeElement === $("search")) { $("search").blur(); $("search").value = ""; renderSongs(); }
      else if (typed) { typed = ""; updateNumber(); }
      else toast("Use STOP or NEXT to control playback.");
      event.preventDefault();
    }
    if (key === "MediaPlayPause") { if (playing) pausePlayback(); else startPlayback(); event.preventDefault(); }
  });

  function updateClock() { var d = new Date(); $("clock").textContent = d.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}); }
  updateClock(); setInterval(updateClock, 30000);
  renderSongs(); renderQueue(); renderQuickPicks(); updateNumber();
  detectDeviceRuntime();
  if ($("selectKeypad")) {
    var firstDigit = $("selectKeypad").querySelector("button");
    if (firstDigit) firstDigit.focus();
  }
  try {
    if (window.tizen && tizen.tvinputdevice) {
      ["MediaPlayPause","MediaStop","MediaPlay","MediaPause"].forEach(function (k) { try { tizen.tvinputdevice.registerKey(k); } catch (e) {} });
    }
  } catch (e) {}
  window.addEventListener("beforeunload", function () { stopPlayback(false); if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl); });
}());
