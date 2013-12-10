chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    if (text.length < 3) {
	  return;
	}
	function makeDesc(tab) {
	  var title = tab.title.replace(new RegExp(text, "g"), "<match>"+text+"</match>");
	  var url = tab.url.replace(new RegExp(text, "g"), "<match>"+text+"</match>");
	  return '<url>'+title+'</url> - <dim>'+url+'</dim>';
	}
    function renderSuggestions(matchingTabs, suggest) {
	  var suggestions = [];
	  matchingTabs.forEach(function(tab, index) {
	    suggestions.push({content: tab.windowId.toString()+":"+tab.id.toString(), description: makeDesc(tab)});
      });
      suggest(suggestions);
	}
	
	chrome.tabs.query({}, function(tabs) {
	  console.log("Query result:");
      console.dir(tabs);
	  var match_re = new RegExp(text, "i");
	  var matchingTabs = [];
      tabs.forEach(function(tab, index) {
	    if (tab.url.match(match_re) || tab.title.match(match_re)) {
		  matchingTabs.push(tab);
		}
      });
	  renderSuggestions(matchingTabs, suggest);
	});
  });

chrome.omnibox.onInputEntered.addListener(
  function(text) {
    var windowAndTabID = (/^(\d+)\:(\d+)$/).exec(text);
    if (windowAndTabID) {
	  console.log("WILLL SWITCH TO "+parseInt(windowAndTabID[2], 10));
	  chrome.tabs.update(parseInt(windowAndTabID[2], 10), {selected: true});
	} else {
	  console.log("Will pop up a results window for "+text);
	}
  });
