import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'

import { Colors } from '../Themes'
import styles from './Styles/ChapterScrollBarStyles'

const ChapterScrollBar = ({chapters, handleClick, selectedChap}) => {
  return (
    <View style={styles.scrollContainer}>
      <ScrollView
        style={{height: 50, }}
        centerContent={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {
          chapters.map((chapter,i) => {
            let buttonStyle = getBackgroundStyle(chapter, selectedChap)
            return (
              <TouchableOpacity
                key={i}
                onPress={() => handleClick(chapter.id)}
                disabled={!chapter.enabled}
              >
                <View style={[styles.chapterButton, buttonStyle]}>
                  <Text style={{color: getTextColor(chapter)}}>{chapter.id}</Text>
                </View>
              </TouchableOpacity>
            )})
        }
      </ScrollView>
    </View>
  )
}


const getBackgroundStyle = (chapter, selectedChap) => {
  if(chapter.id === selectedChap) {
    return {
      borderColor: '#16a916',
      borderColor: Colors.fire,
      backgroundColor: Colors.buttonActive
    }
  }
  else if (!chapter.enabled) {
    return {
      backgroundColor: 'lightgray',
      borderColor: 'lightgray'
    }
  }
  else {
    let background = chapter.status === 'Complete'
    ? {
      borderColor: 'green',
      backgroundColor: 'white'//'lightgreen'
    }
    : {
      borderColor: Colors.fire,
      backgroundColor: 'white'
    }
    return background

  }
}

const getTextColor = (chapter) => {
  if(!chapter.enabled) {
    return 'gray'
  }
  // if(chapter.status === 'Complete') {
  //   return 'green'
  // }
  return Colors.text;
}

export default ChapterScrollBar
