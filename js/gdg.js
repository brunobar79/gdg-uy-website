var Config = (function(){
    var config = {
        'name' : 'GDG Fresno',
        'id' : '114769570436363155784',
        'api': 'AIzaSyAUVhaIWz50KQ4j-wzkZm3ZJPhvND2GAqk'
    }
    return {get : function(a) { return config[a]}}
})();


$('.brand').html('<strong>'+Config.get('name')+'</strong>');
$('li#googleplus').click(function(){window.open('https://plus.google.com/'+Config.get('id'))});

//google+ page info
$.get('https://www.googleapis.com/plus/v1/people/'+Config.get('id')+'?fields=aboutMe%2Ccover%2FcoverPhoto%2CdisplayName%2Cimage%2CplusOneCount&key='+Config.get('api'), function(data){
    $('#about').next().next().html(data.aboutMe);
})


var dates=[];
//gdg dev site events feed
$.get("http://gdgfresno.com/gdgfeed.php?id="+Config.get('id'),function(data){
    for(var i=data.length-1;i>=0;i--){
        var start = new Date(data[i].start);dates.push(start);
        
        var format = start.format("longDate")
        format += ' '+start.format("shortTime")
        
        var html = '<div class="media">';
        html+= data[i].iconUrl != undefined ? '<a class="pull-left" href="https://developers.google.com'+data[i].link+'" target="_blank"><img class="media-object" src="https://developers.google.com'+data[i].iconUrl+'"></a>' : '';
        html+='<div class="media-body">' +
                            '<h4 class="media-heading"><a href="https://developers.google.com'+data[i].link+'" target="_blank">'+data[i].title+'</a></h4>' +
                            '<h5>'+data[i].location+'<br/>'+format+'</h5>' +
                            data[i].description +
                        '</div>' +
                    '</div>';
        
        $('#events').next().next().append(html);
    }
},'json');

//google+ photos
var parsePWA = function(d){
    var p = d.feed.entry;
    for(var x in p){
        var url = p[x].content.src+'?sz=260';
        var html = '<li class="span3"><a href="'+p[x].link[1].href+'" class="thumbnail" target="_blank"><img src="'+ url + '" alt="'+p[x].title.$t+'" title="'+p[x].summary.$t+'"></a></li>'
        $('#photo_container').append(html);
    }
};

$.get('https://picasaweb.google.com/data/feed/api/user/'+Config.get('id')+'/?alt=json-in-script&callback=parsePWA&max-results=24&kind=photo');