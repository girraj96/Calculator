import React, {Fragment, Component} from 'react';
import {StyleSheet, TouchableOpacity, View, Text,Animated, PanResponder} from 'react-native';

class Convertor extends Component {


    
      constructor(props) {
        super(props);
        
    this.state = {
        
        translateValue: new Animated.Value(200),
      };


        this.panResponder = PanResponder.create({
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove: (event, gestureState) => {
            this.state.translateValue.setValue(Math.max(0, 0 + gestureState.dy)); //step 1
          },
          onPanResponderRelease: (e, gesture) => {
            const shouldOpen = gesture.vy <= 0;
            Animated.spring(this.state.translateValue, {
              toValue: shouldOpen ? 0 : 200,
              velocity: gesture.vy,
              tension: 2,
              friction: 8,
            }).start(); //step 2
          },
        });

        
    }
  
    toggleDetails = shouldOpen => {
        let toValue = 0;// if we need to open our subView, we need to animate it to it original hight.
    //To do this, we will use 'transform: translateY(0)' 
        if (!shouldOpen) {
          toValue = 200;
        } // if it's already open and we need to hide it, we will use 'transform: translateY(200)'
        Animated.spring(this.state.translateValue, {
          toValue: toValue,
          velocity: 3,
          tension: 2,
          friction: 8,
        }).start(); // the actual animation
      };
    render() {
      return (
        <Fragment>
          <View style={styles.mainView}>
            <TouchableOpacity
              onPress={() => {
                this.toggleDetails(true);
              }}
              style={styles.openButton}> 
              <Text style={styles.openButtonText}>Open details</Text>
            </TouchableOpacity>
          </View>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[
              styles.subView,
              {transform: [{translateY: this.state.translateValue}]},
            ]}>
            <TouchableOpacity
              style={styles.closeButtonContainer}
              onPress={() => {
                this.toggleDetails(false);
              }}> 
              <View style={styles.closeButton} />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsText}>Some random product details</Text>
            </View>
          </Animated.View>
        </Fragment>
      );
    }
  }
export default Convertor;
const styles = StyleSheet.create({
    mainView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#B5F6F8',
    },
    openButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 100,
      height: 40,
      backgroundColor: '#5B87E5',
      borderRadius: 30,
    },
    openButtonText: {
      fontSize: 12,
      color: 'white',
    },
    subView: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      height: 200,
    },
    closeButtonContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 18,
      paddingBottom: 12,
    },
    closeButton: {
      height: 7,
      width: 62,
      backgroundColor: '#D8D8D8',
      borderRadius: 3.5,
    },
    detailsContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    detailsText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#4A4A4A',
    },
  });