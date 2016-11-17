var initialMarkers = [
{
    position : {lat: 25.777164, lng: -80.13256679999999},
    address: '700 Collins Ave, Miami Beach, FL 33139, USA',
    title : 'Puerto Sagua',
},
{
    position : {lat: 25.7794108, lng: -80.13117059999999},
    address: '900 Ocean Dr, Miami Beach, FL 33139, USA',
    title : "Mango's Tropical Cafe",
},
{
    position : {lat: 25.7779468, lng: -80.1311887},
    address: 'Ocean Dr, Miami Beach, FL 33139, USA',
    title : 'Ocean Drive',
},
{
    position: {lat: 25.7810824, lng: -80.1305127},
    address: 'Lummus Park, Ocean Dr, Miami Beach, FL 33139, USA',
    title: 'Lummus Park'
},
{
    position: {lat: 25.7734539, lng: -80.1325135},
    address: '400 Ocean Dr, Miami Beach, FL 33139, EE. UU.',
    title: 'The Local House'
},
{
    position: {lat: 25.7742803, lng: -80.1323338},
    address: '458 Ocean Dr, Miami Beach, FL 33139, EE. UU.',
    title: 'Gelato-Go'
},
{
    position: {lat: 25.7749586, lng: -80.13213429999999},
    address: '510 Ocean Dr, Miami Beach, FL 33139, EE. UU.',
    title: 'Bentley Hotel South Beach'
},
{
    position: {lat: 25.7750586, lng : -80.1332417},
    address: '540 Collins Ave Miami Beach, FL 33139',
    title: 'Aroma Espresso Bar'
},
{
    position: {lat: 25.7737439, lng: -80.13171989999999},
    address: '425 Ocean Dr, Miami Beach, FL 33139, EE. UU.',
    title: "The Savoy Hotel"
},
{
    position: {lat: 25.7712453, lng: -80.13210459999999},
    address: 'Marjory Stoneman Douglas Park, Ocean Dr, Miami Beach, FL 33139, EE. UU.',
    title: 'Marjory Stoneman Douglas Park Park'
}
];

function PlaceModel(data) {
    var self = this;
    this.position = data.position;
    this.address = data.address;
    this.title = data.title;
}

var map;

function ViewModel() {

    var self = this;

    self.markersList = ko.observableArray(initialMarkers);
    self.filter = ko.observable('');
    self.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        if (!filter) {
            //code to show all map markers
            for (var i = 0; i < self.markersList().length; i++) {
                //if self.markersList.marker is defined, i.e. map has loaded
                if (self.markersList()[i].marker) {
                    self.markersList()[i].marker.setVisible(true);
                }
            }
            return self.markersList();
        } else {
            return ko.utils.arrayFilter(self.markersList(), function(location) {

                if (location.title.toLowerCase().indexOf(filter) > -1) {
                    //code to show markers when search filter used
                    location.marker.setVisible(true);
                    return true; //show list item
                } else {
                    location.marker.setVisible(false); //hides markers
                    return false; //hide list item
                }
            });
        }
    });

    self.toggleSidebar = function(){
        $('#container').toggleClass('toggleSidebar')
    };

    var mapOptions = {
        zoom: 15,
        center: {lat: 25.7737439, lng: -80.13171989999999},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var infowindow= new google.maps.InfoWindow();

    initialMarkers.forEach(function(place) {
        var marker = new google.maps.Marker(place);
        place.marker = marker;
        var content;

        var wikiUrl = "http://en.wikipedia.org/w/api.php?action=opensearch&search=" +
        place.title + "&format=json&callback=wikiCallback";

        google.maps.event.addListener(marker, 'click', function(){
            $.ajax( {
                url: wikiUrl,
                dataType: 'jsonp'
            }).done(function(response) {
                    var articleList = response[1];
                    if(articleList != '') {
                        for (var i = 0; i < articleList.length; i++) {
                            articleStr = articleList[i];
                                var urlwiki = 'http://en.wikipedia.org/wiki/' + articleStr;
                                content = ('<h4>'+ marker.title +'</h4>'+
                                '<p>'+ marker.address +'</p>' + '<li><a href="'+
                                 urlwiki +'">' + articleStr + '</a></li>');
                        }
                    } else {
                        content = ('<h4>'+ marker.title +'</h4>'+
                        '<p>'+ marker.address +'</p>'+"<p>Wikipedia data is not available</p>");
                    }
                infowindow.setContent(content);

            }).fail(function(jqXHR, textStatus){
                content = ('<h4>'+ marker.title +'</h4>'+
            '<p>'+ marker.address +'</p>'+"<li>wikipedia links are down</li>");
                infowindow.setContent(content);
            });

            infowindow.close();
            marker.setAnimation(google.maps.Animation.BOUNCE);
            infowindow.open(map, marker);
            setTimeout(function(){
                marker.setAnimation(null);
            }, 1400)
        });

        google.maps.event.addListener(infowindow, 'closeclick', function() {
            marker.setAnimation(null);
        });

        map.addListener('click', function(){
            marker.setAnimation(null);
            infowindow.close();
        });

        marker.setMap(map);

        self.openInfoWindow = function(place) {
            google.maps.event.trigger(place.marker, 'click');
        }
    });
}

function googleError() {
    alert("Error Map not Found")
}

function initMap () {
    ko.applyBindings(new ViewModel());
}

