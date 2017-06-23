import { StackNavigator } from 'react-navigation'
import TextablesScreen from '../Containers/TextablesScreen'
import LaunchScreen from '../Containers/LaunchScreen'
import LoginScreen from '../Containers/LoginScreen'
import StoryScreen from '../Containers/StoryScreen'
import StoryPreview from '../Containers/StoryPreview'
import Friends from '../Containers/Friends'
import TeamScreen from '../Containers/TeamScreen'
import MapScreen from '../Containers/MapScreen'
import PuzzleInfo from '../Containers/PuzzleInfo'
import CameraScreen from '../Containers/CameraScreen'
import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  TextablesScreen: { screen: TextablesScreen },

  LaunchScreen: { screen: LaunchScreen },
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: { title: 'Login' }
  },
  StoryScreen: { screen: StoryScreen },
  StoryPreview: { screen: StoryPreview },
  Friends: { screen: Friends },
  TeamScreen: { screen: TeamScreen },
  
  MapScreen: {screen: MapScreen},
  PuzzleInfo: {screen: PuzzleInfo},
  CameraScreen: { screen: CameraScreen},
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
