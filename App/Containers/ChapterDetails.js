import React from 'react'
import { View, Text, Modal } from 'react-native'
import { connect } from 'react-redux'
import FullButton from '../Components/Button/FullButton'
import PuzzleInfo from '../Containers/PuzzleInfo'
import { setPuzzle } from '../Redux/actions/currentStory'
import firebaseApp from '../Firebase'
import { Colors } from '../Themes'

class ChapterDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: false,
      selectedPuzzle: null,
      chapter: {}
    }
    this.toggleModal = this.toggleModal.bind(this)
    if(this.props.chapterUrl) this.chapterRef = firebaseApp.database().ref(this.props.chapterUrl)
  }

  componentDidMount() {
    if(this.props.chapterUrl) this.listenForChange(this.chapterRef)
  }

  componentWillUnmount () {
    if(this.props.chapterUrl) this.chapterRef.off('value', this.unsubscribe)
  }

  listenForChange(ref) {
    this.unsubscribe = ref.on('value', chapter => {
      console.log('new info', chapter.val())
      this.setState({
        chapter: chapter.val()
      })
    })
  }

  toggleModal(puzzleId) {
    // console.log('New puzzle selected: ', puzzleId)
    this.setState({
      showModal: !this.state.showModal,
      selectedPuzzle: puzzleId
    })
  }

  // openComponents = () => {
  //   this.props.screenProps.rootNavigation.navigate('PuzzleInfo', {test: 'testing'})
  // }

  getButtonStyle(puzzle) {
    if(puzzle.status === 'Complete') {
      return {
        backgroundColor: 'lightgreen',
        borderTopColor: 'green',
        borderBottomColor: 'green',
      }
    }
    return {
      backgroundColor: Colors.ember,
      borderTopColor: Colors.fire,
      borderBottomColor: Colors.bloodOrange,
    }

  }

  render() {
    // console.log('props in ChapterDetails', this.props)
    return (
      <View>
        <View style={{padding: 10, margin: 10, backgroundColor: 'beige', borderRadius: 5,
          /*shadowColor: 'black',
          hadowOffset: {width: 1, height: 1},
          shadowRadius: 1,
          shadowOpacity: 0.5*/
        }}>
          <Text>Showing the chapter details for Chapter {this.state.chapter.id}</Text>
          <Text style={{fontStyle: 'italic'}}>(Chapter Narrrative):
            {
              this.state.chapter.description
              ? this.state.chapter.description
              : 'Description is empty in Firebase.'
            }
          </Text>
        </View>
        <View >
          {
            this.props.chapterInfo
            ? this.props.chapterInfo.puzzles.map((puzzle,i) => (
                <FullButton
                  styles={this.getButtonStyle(puzzle)}
                  key={i}
                  onPress={() => {
                    this.toggleModal(puzzle.id)
                    this.props.setPuzzle(puzzle.id)
                  }}
                  text={`Chapter ${this.props.selectedChap} - Puzzle ${puzzle.id}`}
                />
              ))
            : null
          }
          <Modal
            animationType={"slide"}
            visible={this.state.showModal}
            onRequestClose={this.toggleModal}>
            <PuzzleInfo
              screenProps={{ toggle: this.toggleModal}}
              puzzleInfo={this.state.selectedPuzzle}
              storyKey={this.props.storyKey}
            />
          </Modal>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    chapterUrl: state.currentStory.chapterUrl,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setPuzzle: (puzzleId) => { dispatch(setPuzzle(puzzleId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChapterDetails)

