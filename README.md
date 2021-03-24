# html-map-selector

This is the source code for a HTML iFrame which allows you select a location on a map and send the coordinates to the JourneyApps application.

## Prerequisites

- Install Node.js on your local machine
- Install Yarn package manager on your local machinee

## Development

1. Clone this repo

2. Install all the dependancies

```
> yarn install
```

## Build 

1. Run the following command

```
> yarn build
```

This compiles the iFrame and generates a directory `dist` and the `map_selector.html` file in the directory.

The name of the html file is set in the `config.yml` file as the `outputFileName` key. 

## Import and Use

1. Run the build command mentioned above

2. Upload the `map_selector.html` to the `html` assets on Oxide

3. Add the following to your `view.xml`

```
<var name="location" type="location" />
<var name="latitude" type="number" />
<var name="longitude" type="number" />

<html id="map_selector" src="html/map_selector.html" show-fullscreen-button="true" height="400"/>
```

We add a `location` variable which we use as our current location. We send this to the iFrame to display the current user location. We'll use the longitude and latitude variables to store the location details based on where the user clicks on the map.

4. Add the following to your `view.js` 

```
// Get a free tiere access token from MAPBOX
// https://www.mapbox.com/pricing/#maploads
var MAPBOX_ACCESS_TOKEN = "Your MAPBOX Access Token";

function init() {
    // This event fires when the iFrame loads
    component.html({id: "map_selector"}).on("loaded", function (loaded) {
        if(loaded) {
            // First we send the mapbox access token 
            component.html({id: "map_selector"}).post("setToken", MAPBOX_ACCESS_TOKEN);
            // Send the intial user location
            component.html({id: "map_selector"}).post("loadMap", {
                center: {
                    longitude: view.location.longitude,
                    latitude: view.location.latitude
                }
            });
        }
    });
    // This event fires when the user drags and or selects location on the map
    component.html({id: "map_selector"}).on("postLocation", function (coordinates) {
        if(coordinates.latitude && coordinates.longitude) {
            // Set the variables based on the selected location
            view.latitude = coordinates.latitude;
            view.longitude = coordinates.longitude;
        }
    });
}
```

