import {observer} from 'mobx-react-lite'
import car from './car.png'
import React, {useEffect, useState, useRef, useCallback} from 'react'
import {store} from './store'
import {DirectionsRenderer, GoogleMap, Marker, useLoadScript} from "@react-google-maps/api";


const LatLng = (lat, lng) => (`${lat}, ${lng}`);



function App() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyBs6_yKxVZQECnfQoWx46VyHsCE3kJNwDs"
    })
    const [zoom, setZoom] = useState(8)
    let [directions, setDirections] = useState(null)
    const [lastElement, setLastElement] = useState({ lat: 41.85, lng: -87.65 })
    const {markers} = store

    useEffect(() => {
        store.getMarkerPosition()

        const intervalId = setInterval(() => {

            store.getMarkerPosition()

        }, 3 * 1000)

        return () => clearInterval(intervalId);
    }, [])

    useEffect(() => {
        if (markers) {

            const waypoints = markers.map((item, index) => {
                if(index !== 0 && index !== markers.length - 1) {
                    return {location: `${item.lat}, ${item.lng}`}
                }
            }).filter(_ => _)

            const google = window.google
            setLastElement(markers[markers.length - 1])
            const DirectionsService = new google.maps.DirectionsService();

            DirectionsService.route({
                origin: LatLng(markers[0].lat, markers[0].lng),
                destination: LatLng(markers[markers.length - 1].lat, markers[markers.length - 1].lng),
                optimizeWaypoints: false,
                waypoints,
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result)
                } else {
                    console.error("error fetching directions", result);
                }
            })
        }
    }, [markers])
    if (loadError) {
        return <div>Map cannot be loaded right now, sorry.</div>
    }
    const onLoad = mapInstance => {
        console.log(mapInstance)
    }

    return (
        <div className="App">
            {isLoaded ? (
                <GoogleMap
                onLoad={onLoad}
                center={lastElement}
                zoom={zoom}
                mapContainerStyle={{
                width: '100%',
                height: '100vh'
            }}
                >
            {markers && <Marker icon={car} position={{ lat: lastElement.lat, lng: lastElement.lng }} />}
            {directions && <DirectionsRenderer directions={directions} options={{suppressMarkers: true}} />}
                </GoogleMap>
                ) : "Loading..."}
        </div>
    );
}


export default observer(App);
