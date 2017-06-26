import React from 'react'
import { View, Text, Button, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import TreasureHunt from '../Components/TreasureHunt'
import Tracker from '../Components/Tracker'
import ChapterDetails from '../Containers/ChapterDetails'
import ChapterScrollBar from '../Components/ChapterScrollBar'
import RoundedButton from '../Components/Button/RoundedButton'
import { ApplicationStyles } from '../Themes'
import geolib from 'geolib'
import BackgroundGeolocation from "react-native-background-geolocation";

// Styles
import styles from './Styles/ChapterStyles'

class Chapter extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      insideRange: false,
      longitude: null,
      latitude: null,
      selectedChap: 1,
    }
    this.onLocation = this.onLocation.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillMount() {
    // console.log('listener added for location changes')
    BackgroundGeolocation.on('location', this.onLocation)
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 0,
      distanceFilter: 0,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
      locationAuthorizationRequest: 'Always',
      // HTTP / SQLite config
      // url: 'http://yourserver.com/locations',
      // batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
      // autoSync: true,         // <-- [Default: true] Set true to sync each location to server as it arrives.
      // headers: {              // <-- Optional HTTP headers
      //   "X-FOO": "bar"
      // },
      // params: {               // <-- Optional HTTP params
      //   "auth_token": "maybe_your_server_authenticates_via_token_YES?"
      // }
    }, function(state) {
      // console.log("- BackgroundGeolocation is configured and ready: ", state.enabled);

      if (!state.enabled) {
        BackgroundGeolocation.start(function() {
          // console.log("- Start success");
        });
      }
    });
  }

  componentDidMount() {
    // console.log('componentDidMount in Chapter')
    let polygon = [
      { latitude: 41.89, longitude: -87.66 },
      { latitude: 41.89, longitude: -87.68},
      { latitude: 41.92, longitude:  -87.68},
      { latitude: 41.92, longitude:  -87.66},
      { latitude: 41.89, longitude: -87.66 } // last point has to be same as first point
    ]

    navigator.geolocation.getCurrentPosition((position) => {
      var crd = position.coords;
      let point = {
        latitude: crd.latitude,
        longitude: crd.longitude,
      }
      // console.log('long lat being set: ', point)

      this.setState({
        latitude: crd.latitude,
        longitude: crd.longitude,
        insideRange: geolib.isPointInside(point, polygon),
      })
    })
  }
  // You must remove listeners when your component unmounts
  componentWillUnmount() {
    // Remove BackgroundGeolocation listeners
    // console.log('Unmounting listeners in Chapter')
    BackgroundGeolocation.un('location', this.onLocation);
  }

  onLocation(location) {
    //My location passing: 41.90, -87.67
    //My location failing 41.88, -87.67
    let polygon = [
      { latitude: 41.89, longitude: -87.66 },
      { latitude: 41.89, longitude: -87.68},
      { latitude: 41.92, longitude:  -87.68},
      { latitude: 41.92, longitude:  -87.66},
      { latitude: 41.89, longitude: -87.66 } // last point has to be same as first point
    ]

    let point = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }

    // console.log('- [js]location: ', JSON.stringify(location));
    this.setState({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
      insideRange: geolib.isPointInside(point, polygon),
    })
  }

  handleClick(e) {
    // console.log('chapter button clicked, ', e)
    this.setState({
      selectedChap: e
    })
  }

  render () {
    const chapters = [
      {id: 1, puzzles: [{id: 1}, {id: 2}]},
      {id: 2, puzzles: [{id: 3}]},
      {id: 3, puzzles: [{id: 4},{id: 5},{id: 6}]},
      {id: 4, puzzles: [{id: 7},{id: 8},{id: 9}, {id: 10}]},
      {id: 5, puzzles: [{id: 11},{id: 12},{id: 13}]},
      {id: 6, puzzles: [{id: 14},{id: 15}]}
    ]
    const selectedChapInfo = chapters[this.state.selectedChap-1]
    // console.log('state in Chapter', this.state)
    return (
      <View style={styles.container}>
        <View style={styles.sectionHeader}>
          <Text style={styles.boldLabel}>Batman - Chapter {this.state.selectedChap}</Text>
        </View>
        <ScrollView style={styles.container}>
          <View>
            <TreasureHunt
              longitude={this.state.longitude}
              latitude={this.state.latitude}
            />
          </View>
          <ChapterScrollBar
            chapters={chapters}
            handleClick={this.handleClick}
            selectedChap={this.state.selectedChap}
          />
          {/*<Tracker />*/}
          <View>
            <Text style={styles.boldLabel}>Location is: {this.state.latitude}, {this.state.longitude}</Text>
            {
              this.state.insideRange
              ? <Text>Inside range? Yes</Text>
              : <Text>Inside range? No</Text>
            }
          </View>
          <ChapterDetails
            screenProps={{rootNavigation: this.props.navigation}}
            selectedChap={this.state.selectedChap}
            chapterInfo={selectedChapInfo}
            storyKey={'artThief'}
          />
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // ...redux state to props here
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chapter)