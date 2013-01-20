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

$(document).ready(function(){
    moveCodeInPlace();
});