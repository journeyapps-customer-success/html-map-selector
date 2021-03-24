import './sass/main.scss'

let mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');
let JourneyIFrameClient = require("journey-iframe-client");
let client = new JourneyIFrameClient();

declare global {
    export interface Window {
        map: any
    }
}

let marker: any;

init();

function init() {
    window.addEventListener('DOMContentLoaded', (event: any) => {
        console.log("MAP SELECTER Main.TS: DOMContet Loaded - Calling loaded function");
        loaded();
    });

    window.map.on('click', (e: any) => {
        if (!marker) {
            marker = new mapboxgl.Marker({
                color: "#4ec45f",
                draggable: true
            }).setLngLat(e.lngLat)
                .addTo(window.map);

            marker.on("dragend", function (e) {
                postLocation(e.target._lngLat);
            });
            postLocation(e.lngLat);
        }
    });
}

(window as any).init = init;

function loaded() {
    console.log("SCHEDULER: loaded. Registering listeners");
    registerListeners(window);
    console.log("SCHEDULER: posting 'loaded' to JourneyApps")
    client.post('loaded', true);
}

function postLocation(lngLat: any) {
    let location = {
        latitude: lngLat.lat,
        longitude: lngLat.lng
    }
    console.log(`In HTML: posting ${JSON.stringify(location)}`);
    client.post('postLocation', location);
}

function registerListeners(window: any) {
    client.on('setCenter', function (location) {
        console.log(`In HTML 'setCenter'. Received: ${JSON.stringify(location)}`)
        window.map.jumpTo({
            center: [location.longitude, location.latitude],
            zoom: 11
        });
    });

    client.on('loadMap', (options: any) => {
        console.log(`In HTML 'setCenter'. Received: ${JSON.stringify(options)}`)
        let centerLocation = options.center
        window.map.jumpTo({
            center: [centerLocation.longitude, centerLocation.latitude],
            zoom: 11
        });

        marker = new mapboxgl.Marker({
            color: "#4ec45f",
            draggable: true
        }).setLngLat([centerLocation.longitude, centerLocation.latitude])
            .addTo(window.map);

        marker.on("dragend", (e: any) => {
            postLocation(e.target._lngLat);
        });
    });

    client.on('clearSelection', () => {
        console.log("In HTML 'clearSection");
        if (marker) {
            marker.remove();
            marker = null;
        }
    });

    client.on('getSelection', () => {
        console.log("In HTML 'getSection");
        let selection = {
            end: marker ? marker.lngLat : false,
        }
        return selection;
    });

    client.on('setToken', (accessToken: string) => {
        mapboxgl.accessToken = accessToken;
        window.map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-96, 37.8],
            zoom: 3
        });
    });
}   