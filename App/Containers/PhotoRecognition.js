import React from 'react'
import firebaseApp from '../Firebase'
import { View, Text, StyleSheet } from 'react-native'
import Camera from 'react-native-camera'

// upload image
import RNFetchBlob from 'react-native-fetch-blob'

// vision
import vision from '../Vision'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

class PhotoRecognition extends React.Component {
  constructor () {
    super ()
    
    this.uid = firebaseApp.auth().currentUser.uid
    this.takePicture = this.takePicture.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
  }
  
  uploadImage (uri, imageRef, mime = 'image/jpgs') { // application/octet-stream
    return new Promise((resolve, reject) => {
      // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
      const sessionId = new Date().getTime()
      let uploadBlob = null

      RNFetchBlob.fs.readFile(uri, 'base64')
        .then((data) => {
          console.log('data in readFile 1', data)
          return Blob.build(data, { type: `${mime};BASE64` })
        })
        .then((blob) => {
          console.log('data in readFile 2', blob)
          uploadBlob = blob
          return imageRef.put(blob, { contentType: mime })
        })
        .then(() => {
          console.log('data closing in readFile 3')
          uploadBlob.close()
          return imageRef.getDownloadURL()
        })
        .then((url) => {
          console.log('this guy is readFIle 4', url)
          return url
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  takePicture() {
    const uid = this.uid
    const mime = 'image/jpg'
    const options = {};

    const Blob = RNFetchBlob.polyfill.Blob
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
    window.Blob = Blob

    //options.location = ...
    this.camera.capture({metadata: options})
      .then(data => {
        // path/mediaUri: assets-library://asset/asset.JPG?id=C071D9B5-3410-43AB-9B00-2528C9E57FEF&ext=JPG
        console.log('takePicture', data)
        console.log('save to google storage')
        const imageRef = firebaseApp.storage().ref('/journey/' + uid)
        return this.uploadImage(data.path, imageRef)
      })
      .catch(err => console.error('Taking Picture in PhotoRecog failed', err));
  }
  
  render () {
    
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text 
            style={styles.capture}
            onPress={() => this.takePicture()}
          >[CAPTURE]</Text>
        </Camera>
      </View>
    )
  }
}

export default PhotoRecognition