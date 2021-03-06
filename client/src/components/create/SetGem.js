import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import axios from "axios";
import React, { Component } from "react";
import ReactMapGL, {
  Marker,
  NavigationControl
} from "react-map-gl";

import Geocoder from "react-mapbox-gl-geocoder";
import SuggestGem from "./SuggestGem";

export class SetGem extends Component {
  state = {
    viewport: {
      width: "100%",
      height: "95vh",
      latitude: 52.520008,
      longitude: 13.404954,
      zoom: 1,
      bearing: 0,
      pitch: 0
    },
    marker: {
      markerClicked: false,
      latitude: 52.520008,
      longitude: 13.404954
    }
  };

  // here we lift up the state to CreateGem and update longitude, latitude and locationname
  onSubmit = event => {
    event.preventDefault();
    let locationName = "";
    axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.marker.longitude},${this.state.marker.latitude}.json?access_token=` +
          process.env.REACT_APP_MAPBOX_TOKEN
      )
      .then(response => {
        console.log(response);
        locationName = response.data.features[0].place_name;
        this.props.fetchGemInfo({
          latitude: this.state.marker.latitude,
          longitude: this.state.marker.longitude,
          locationName: locationName
        });
        this.props.setStage("SuggestGem");
      })
      .catch(err => console.log("Error in getting the locationname" + err));
  };

  handleViewportChange = viewport => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  };

  onSelected = (viewport, item) => {
    this.setState({
      viewport: viewport,
      marker: {
        longitude: viewport.longitude,
        latitude: viewport.latitude
      }
    });
  };

  render() {
    console.log(this.state.marker);
    console.log(this.state.viewport);
    return (
      <>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={viewport =>
            this.setState({
              viewport: viewport,
              marker: {
                longitude: viewport.longitude,
                latitude: viewport.latitude
              }
            })
          }
          mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/iouri/ck1kx1czi1r971cpj0s2ngu2q"
          captureDoubleClick={false}
          doubleClickZoom={false}
          onDblClick={event => {
            this.setState({
              /* viewport: {
                longitude: event.lngLat[0],
                latitude: event.lngLat[1]
              }, */
              marker: {
                longitude: event.lngLat[0],
                latitude: event.lngLat[1]
              }
            });
            // console.log("onclickevent", event.lngLat);
          }}
        >
          <Marker
            latitude={this.state.marker.latitude}
            longitude={this.state.marker.longitude}
            offsetTop={-50}
            offsetLeft={-25}
            captureClick={false}
            draggable={true}
            onDragEnd={event =>
              this.setState({
                marker: {
                  longitude: event.lngLat[0],
                  latitude: event.lngLat[1]
                }
              })
            }
          >
            <div className="gem-marker gem-marker-set">
              <img src="/images/diamond-icon-green.png" alt="gem"/>
            </div>
          </Marker>
          <div style={{ position: "absolute", right: "2vw", top: "10vh" }}>
            <NavigationControl
              onViewportChange={viewport => this.setState({ viewport })}
            />
          </div>
          {/* <div style={{ position: "absolute", right: "2vw", top: "4vh" }}>
            <GeolocateControl
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />
          </div> */}
          <div>
            <Geocoder
              mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
              onSelected={this.onSelected}
              viewport={this.state.viewport}
              hideOnSelect={true}
            />
          </div>
          <div className="setGem">
            <button className="btn btn-primary generalBtn" onClick={this.onSubmit}>
              Create Gem
            </button>
          </div>
        </ReactMapGL>
      </>
    );
  }
}
export default SetGem;
