
var SlidesView = Backbone.View.extend({

    initialize: function() {
        this.app = this.options.app;
        this.$slides = $('.slide');
        this.$navigator = $('.navigator');
        this.showSlide(1);
    },

    events: {
        'click .next': 'nextSlide',
        'click .previous': 'previousSlide',
        'keydown': 'keyDown'
    },

    nextSlide: function(){
        this.navigateToSlide(this.slideNumber+1);
    },

    previousSlide: function(){
        this.navigateToSlide(this.slideNumber-1);
    },

    navigateToSlide: function(slideNumber) {
        this.showSlide(slideNumber);
        this.app.navigate("/" + this.slideNumber);
    },

    showSlide: function(slideNumber) {
        this.slideNumber = this.checkSlideNumber(slideNumber);
        this.$slides.hide();
        $(this.$slides.get(this.slideNumber-1)).show();
        this.$navigator.toggleClass('first-page', slideNumber === 1);
    },

    checkSlideNumber: function(slideNumber) {
        if (slideNumber > this.$slides.length) {
            return 1;
        } else if (slideNumber < 1) {
            return this.$slides.length;
        }
        return slideNumber;
    },

    keyDown: function(e) {
        if (e.metaKey) {
            if (e.keyCode === 40) {
                e.preventDefault();
                this.nextSlide();
            } else if (e.keyCode === 38) {
                e.preventDefault();
                this.previousSlide();
            }
        }
    }
});

var App = Backbone.Router.extend({

    routes: {
        ":slide": "showSlide",
        "": "showSlide"
    },

    showSlide: function(slide) {
        if (!slide) {
            slide = 1;
        } else {
            slide = parseInt(slide, 10);
        }
        this.mainView.showSlide(slide);
    },

    initialize: function() {
        this.mainView = new SlidesView({el: $('body'), app: this});
        Backbone.history.start({pushState: true, root: "/slides"});
    }

});

function example(selector, fun) {
    $(document).ready(function(){
        fun(function(s) {
            return $(selector).find(s);
        });
    })
}

function buildCodeMap(text, codeMap) {
    text = text.trim();
    if (text === "") {
        return codeMap;
    }
    var lines = text.split(/\r?\n/);
    var ignoring = false;
    var started = false;
    var buffer = "";
    var codeName = "";
    var spaces = "";
    for (var i = 0; i < lines.length; i++) {
        var s = lines[i];
        var trimmed = s.trim();
        if (trimmed.indexOf('//--start') == 0) {
            spaces = s.slice(0, s.indexOf('//--start'));
            codeName = trimmed.replace('//--start', '').trim();
            buffer = "";
            started = true;
            ignoring = false;
        } else if (trimmed.indexOf('//--end') == 0) {
            started = false;
            codeMap[codeName] = buffer;
        } else if (trimmed.indexOf('//--!') == 0) {
            ignoring = !ignoring;
        } else if (started && !ignoring) {
            if (s.indexOf(spaces) == 0) {
                s = s.substring(spaces.length, s.length);
            }
            buffer += s + '\n';
        }
    }
    return codeMap;
}

function moveCodeInPlace(codeMap) {
    $('[data-code]').each(function(){
        var $this = $(this);
        var codeName = $this.data('code');
        var code = codeMap[codeName];
        if (code) {
            $this.html('<code class="javascript">' + code + '</code>');
            hljs.highlightBlock($this[0]);
        } else {
            $this.text('Code for ' + codeName + ' not found');
        }
    });
}

function classNavigation(text) {
    //return text.replace(/class="([\w\s-]+)"/, '<span class="class-navigation" data-$&>$&</span>');
    return text.replace(/&lt;.+class="([\w\s-]+)".*&gt;/, '<span class="class-navigation" data-nav="$1">$&</span>');
}

function getEncoded(html) {
    var text = $('<div/>').text(html).html();
    var lines = text.split(/\r?\n/);
    var line = '';
    var i = 0;
    var firstNonWhite = 10000;
    for (i = 0; i < lines.length; i++) {
        line = lines[i];
        if (line.trim() === ''){
            continue;
        }

        var tmp = line.search(/\S/);
        if (tmp < firstNonWhite) {
            firstNonWhite = tmp;
        }
    }
    var result = '';
    for (i = 0; i < lines.length; i++) {
        line = lines[i];
        result += classNavigation(line.substring(firstNonWhite)) + '\n';
    }
    return result.trim();
}

var app = null;

$(document).ready(function(){
    var codeMap = {};
    $('script').each(function(){
        buildCodeMap($(this).html(), codeMap);
    });
    $('.html-map').each(function(){
        var $this = $(this);
        codeMap[$this.data('name')] = getEncoded($this.html());
    });
    $('[data-placeholder=examples]').each(function(){
        $(this).attr('placeholder', '<- Start with examples by clicking to the buttons');
    });

    moveCodeInPlace(codeMap);

    $('.class-navigation').each(function(){
        var $this = $(this);
        var cssClass = $this.data('nav');
        if (cssClass.indexOf(' ') > -1) {
            cssClass = cssClass.split(' ')[0];
        }
        var $target = $this.closest('.slide').find('.' + cssClass);
        $this.on('mouseenter', function(){
            $target.addClass('navigation-selected');
        });
        $this.on('mouseleave', function(){
            $target.removeClass('navigation-selected');
        });
    });
    app = new App();
});