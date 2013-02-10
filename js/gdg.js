var Config = (function(){
    var config = {
        //modify these
        'name' : _CHAPTER_NAME_,
        'id' : _CHAPTER_ID_,
        'api': _API_KEY_
    }
    return {get : function(a) { return config[a]}}
})();

$('title').prepend(Config.get('name')+' | ');
$('.brand').html('<strong>'+Config.get('name')+'</strong>');
$('li#googleplus').click(function(){window.open('https://plus.google.com/'+Config.get('id'))});

//google+ page info
$.get('https://www.googleapis.com/plus/v1/people/'+Config.get('id')+'?fields=aboutMe%2Ccover%2FcoverPhoto%2CdisplayName%2Cimage%2CplusOneCount&key='+Config.get('google_api'), function(data){
    $('#about').next().next().html(data.aboutMe);
})


//gdg dev site events feed
$.get("http://gdgfresno.com/gdgfeed.php?id="+Config.get('id'),function(data){
    var now = new Date();
    for(var i=data.length-1;i>=0;i--){
        var start = new Date(data[i].start);
        
        var format = start.format("longDate")
        format += ' '+start.format("shortTime")
        
        var html = '<div class="media">';
        html+= data[i].iconUrl != undefined ? '<a class="pull-left" href="https://developers.google.com'+data[i].link+'" target="_blank"><img class="media-object" src="https://developers.google.com'+data[i].iconUrl+'"></a>' : '';
        html+='<div class="media-body">' +
                            '<h4 class="media-heading"><a href="https://developers.google.com'+data[i].link+'" target="_blank">'+data[i].title+'</a></h4>' +
                            '<h5>'+data[i].location+'<br/>'+format+'</h5>' +
                            data[i].description +
                        '</div>';        
        html +='</div>';
        
	if (start < now){
            $('#past_events').next().next().append(html);
	} else {
            $('#upcoming_events').next().next().prepend(html);
	}
    }
    var past = $('#past_events').next().next().children();
    if(past.length > 5 ){
        $('#past_events').next().next().append('<div id="view_more_events"><a>More...</a></div>');
    }
    for( var i = past.length-1; i>=5; i--){
        past[i].style.display='none';
    }
    $('#view_more_events').click(function(){
        $('#past_events').next().next().children().slideDown();
        this.style.display='none';
    });
},'json');

//google+ photos
var parsePWA = function(d){
    var url, html, p = d.feed.entry, count=0;
    for(var x in p){
        count++;
        if(count == 1){
            html = '<li class="span6"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ p[x].content.src + '?sz=460" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
        }else if(count == 8){
            html = '<li class="span6 pull-right"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ p[x].content.src + '?sz=460" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
        }else{
            html = '<li class="span3"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ p[x].content.src + '?sz=260" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
        }
        $('#photo_container').append(html);
    }
};
$.get('https://picasaweb.google.com/data/feed/api/user/'+Config.get('id')+'/?alt=json-in-script&callback=parsePWA&max-results=22&kind=photo');
