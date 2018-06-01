var redditP_manager = (function() {
    window.onload = function() {
        //init the cache
        LScache.init({compression_type: DISABLE});

        _element_merge_add_button    = document.getElementById('merge_add_button');
        _element_view_redditP_button = document.getElementById('view_redditP_button');
        _element_merge_add_input     = document.getElementById('merge_add_input');
        _element_items_table         = document.getElementById('items');


        _element_merge_add_button.addEventListener('click', _event_merge_add_button, false);

        //load chache
        var cache = LScache.get('my_subreddits');
        if (cache != false)
            _my_subreddits = cache;

        _reprint_table([]);
        console.log(_my_subreddits);
    };


    ////////////////////////////////////////////////////////////////////////////
    /// LOCAL STUFF                                                          ///
    ////////////////////////////////////////////////////////////////////////////

    var _my_subreddits = [];

    var _event_merge_add_button = function() {
        var text = _element_merge_add_input.value;
        if (text == '') return; //input is empty

        var new_subreddits = [];

        //decide if the new url has to be merged or added
        if (text.indexOf('reddit.com') != -1) { //add
            var short = text.split('reddit.com/r/')[1];
            new_subreddits.push(short.split('/')[0]);
        } else if (text.indexOf('redditp.com') != -1) { //merge
            var short = text.split('redditp.com/r/')[1];
            new_subreddits = short.split('+');
        } else { //somehing else

        }

        var new_subreddits_filtered = [];
        for (var i = 0; i < new_subreddits.length; i++) {
            if (_my_subreddits.indexOf(new_subreddits[i]) == -1) {
                new_subreddits_filtered.push(new_subreddits[i]);
            }
        }

        _my_subreddits = _my_subreddits.concat(new_subreddits_filtered);
        _my_subreddits.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        LScache.add('my_subreddits', _my_subreddits);
        LScache.update('my_subreddits', _my_subreddits);

        _element_merge_add_input.value = '';

        _reprint_table(new_subreddits_filtered);

        console.log(_my_subreddits);
    };

    var _remove_elem = function(data) {
        var index = _my_subreddits.indexOf(data.id);
        if (index != undefined && index > -1) {
            _my_subreddits.splice(index, 1);
        }

        LScache.add('my_subreddits', _my_subreddits);
        LScache.update('my_subreddits', _my_subreddits);

        _reprint_table([]);
    };

    var _reprint_table = function(new_subreddits) {
        _element_view_redditP_button.href =  'https://redditp.com/r/';
        _element_view_redditP_button.href += _my_subreddits[0];

        for (var i = 1; i < _my_subreddits.length; i++) {
            _element_view_redditP_button.href += '+';
            _element_view_redditP_button.href += _my_subreddits[i];
        }

        _element_items_table.innerHTML = '';

        for (var i = 0; i < _my_subreddits.length; i++) {
            if (new_subreddits.indexOf(_my_subreddits[i]) == -1) {
                _element_items_table.innerHTML += '<tr><td><a href="https://www.reddit.com/r/' + _my_subreddits[i] + '/" target="_blank"><div class="button">' + _my_subreddits[i] + '</div></a></td><td><div class="button" onclick="redditP_manager.remove(this);" id="' + _my_subreddits[i] + '">Remove</div></td></tr>';
            } else {
                _element_items_table.innerHTML += '<tr><td><a href="https://www.reddit.com/r/' + _my_subreddits[i] + '/" target="_blank"><div class="button" style="background-color: rgb(230,245,230);">' + _my_subreddits[i] + '</div></a></td><td><div class="button" style="background-color: rgb(230,245,230);" onclick="redditP_manager.remove(this);" id="' + _my_subreddits[i] + '">Remove</div></td></tr>';
            }
        }

    };

    ////////////////////////////////////////////////////////////////////////////
    /// GLOBAL STUFF                                                         ///
    ////////////////////////////////////////////////////////////////////////////

    var redditP_manager = {
        remove : _remove_elem
	};


	return redditP_manager;
})();
