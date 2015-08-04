var platform = process.platform;
platform = /^win/.test(platform)? 'win' : /^darwin/.test(platform)? 'mac' : 'linux' + (process.arch == 'ia32' ? '32' : '64');

var gui = require('nw.gui');
var win = gui.Window.get();
var clipboard = gui.Clipboard.get();
var base = '';

if (gui.App.manifest.debug) {
  win.showDevTools();
  base = 'src/';
}

win.hide();

var iframe, tray, menu, menuItemLatin, menuItemHTML, menuItemParagraphs = [], asHTML = false, asLatin = false, shortcut;
var sounds = ['sound1.ogg', 'sound2.ogg', 'sound3.ogg', 'sound4.ogg', 'sound5.ogg'];

function notify(text, icon){
  var options = {
    icon: icon,
    body: text
  };

  var notification = new Notification(gui.App.manifest.name, options);

  notification.onshow = function(){
    setTimeout(function() {
      notification.close();
    }, 5000);
  }
}

function checkReady(){
  if (iframe.contentWindow && iframe.contentWindow.document && iframe.contentWindow.document.body) {
    tray = new gui.Tray({icon: base + 'public/assets/icon-small.png'});
    menu = new gui.Menu();

    var submenuItemParagraphs = new gui.MenuItem({type: 'normal', label: 'Paragraphs'});

    var submenu = new gui.Menu();

    menuItemParagraphs[0] = new gui.MenuItem({type: 'checkbox', label: '1 Paragraph'});
    menuItemParagraphs[0].checked = true;
    menuItemParagraphs[0].on('click', function(){ setParagraph(1); });
    submenu.append(menuItemParagraphs[0]);

    menuItemParagraphs[1] = new gui.MenuItem({type: 'checkbox', label: '2 Paragraphs'});
    menuItemParagraphs[1].on('click', function(){ setParagraph(2); });
    submenu.append(menuItemParagraphs[1]);

    menuItemParagraphs[2] = new gui.MenuItem({type: 'checkbox', label: '3 Paragraphs'});
    menuItemParagraphs[2].on('click', function(){ setParagraph(3); });
    submenu.append(menuItemParagraphs[2]);

    menuItemParagraphs[3] = new gui.MenuItem({type: 'checkbox', label: '4 Paragraphs'});
    menuItemParagraphs[3].on('click', function(){ setParagraph(4); });
    submenu.append(menuItemParagraphs[3]);

    submenuItemParagraphs.submenu = submenu;

    menu.append(submenuItemParagraphs);


    var menuItem = new gui.MenuItem({icon: base + 'public/assets/minion-small.png', type: 'normal', label: 'Bananaaa!! ' + (platform === 'mac' ? '(cmd+shift+m)' : '(ctrl+shift+m)')});
    menuItem.on('click', getDefault);
    menu.append(menuItem);

    menuItemLatin = new gui.MenuItem({icon: base + 'public/assets/minion-roman-small.png', type: 'normal', label: 'Gimme Latin!!'});
    menuItemLatin.on('click', getLatin);
    menu.append(menuItemLatin);

    var menuItem = new gui.MenuItem({type: 'separator'});
    menu.append(menuItem);

    menuItemHTML = new gui.MenuItem({type: 'checkbox', label: 'HTML paragraphs?'});
    menuItemHTML.on('click', toggleHTML);
    menu.append(menuItemHTML);

    var menuItem = new gui.MenuItem({type: 'separator'});
    menu.append(menuItem);

    menuItemHTML = new gui.MenuItem({type: 'normal', label: 'Quit'});
    menuItemHTML.on('click', gui.App.quit);
    menu.append(menuItemHTML);

    tray.menu = menu;


    shortcut = new gui.Shortcut({key: 'Ctrl+Shift+M'});
    gui.App.registerGlobalHotKey(shortcut);
    shortcut.on('active', getDefault);
  } else {
    setTimeout(checkReady, 50);
  }
}

function setParagraph(count){
  for (var i = 0; i < menuItemParagraphs.length; i++) {
    menuItemParagraphs[i].checked = (i === count - 1);
  }

  $(iframe.contentWindow.document.body).find('.paragraph-number-selector li').each(function(){
    if ($(this).html().replace(/\s/g) === count.toString()) {
      $(this).trigger('click');
    }
  });

  $(iframe.contentWindow.document.body).find('.paragraph-active-number').html(count.toString());
}


function toggleHTML(event){
  asHTML = menuItemHTML.checked;
}

function getLatin(){
  asLatin = true;
  fetchData();
}

function getDefault(){
  asLatin = false;
  fetchData();
}


function fetchData(){
  if (asLatin) {
    $(iframe.contentWindow.document.body).find('#button-latin').trigger('click');
  } else {
    $(iframe.contentWindow.document.body).find('#button-banana').trigger('click');
  }

  var content = '';

  if (asHTML) {
    content = $(iframe.contentWindow.document.body).find('#divText').html();
  } else {
    $(iframe.contentWindow.document.body).find('#divText').find('p').each(function(){
      if (content.length > 0) {
        content += "\n\n";
      }

      content += $(this).html();
    });
  }

  clipboard.set(content, 'text');

  notify('copied to clipboard', asLatin ? 'public/assets/minion-roman.png' : 'public/assets/minion.png');

  var soundIndex = Math.floor(Math.random() * sounds.length);
  var sound = 'public/sounds/' + sounds[soundIndex];
  var audio = new Audio(sound);
  audio.volume = 1;
  audio.play();
}



$(document).ready(function(){
  var $el = $('<iframe src="http://www.minionsipsum.com/" nwdisable nwfaketop seamless style="display: none;"></iframe>');
  $('body').append($el);

  iframe = $el.get(0);

  checkReady();
});
