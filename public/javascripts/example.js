
var SlidesView = Backbone.View.extend({

    initialize: function() {
        this.app = this.options.app;
        this.$slides = $('.slide');
        this.showSlide(0);
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
        if (slideNumber > this.$slides.length) {
            slideNumber = 1;
        } else if (slideNumber < 1) {
            slideNumber = this.$slides.length;
        }

        this.slideNumber = slideNumber;
        this.$slides.hide();
        $(this.$slides.get(slideNumber-1)).show();
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
        ":slide": "goTo"
    },

    goTo: function(slide) {
        this.mainView.showSlide(parseInt(slide, 10));
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

function moveCodeInPlace() {
    $('[data-code]').each(function(){
        var $this = $(this);
        var code = $($this.data('code')).html();
        var start = code.indexOf('//--start') + 10;
        var end = code.indexOf('//--end');
        if (start > -1 && end > -1) {
            code = code.substring(start, end);
        }
        code = code.trimRight();
        $this.html(code);
    });
}

var app = null;

$(document).ready(function(){
    moveCodeInPlace();
    app = new App();
});