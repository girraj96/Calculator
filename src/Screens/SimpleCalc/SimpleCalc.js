import React, { Component } from 'react'
import { Image, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'

// third party libraries
import { connect } from 'react-redux'
import mathExp from "math-expression-evaluator";
import { showError } from '../../utils/helperFunctions';
import _ from 'lodash';


//components
import BtnComp from '../../Components/BtnComp'
import BtnWithIcon from '../../Components/BtnWithIcon'
import WrapperContainer from '../../Components/WrapperContainer'

//constants
import imagePath from '../../constants/imagePath'
import strings from '../../constants/lang'
import actions from '../../redux/actions'
import colors from '../../styles/colors'
import { getItem, removeItem } from '../../utils/utils';
import fontFamily from '../../styles/fontFamily';


class SimpleCalc extends Component {

  state = {
    isHistoryViewOpen: false,
    historyData: []
  }

  componentDidMount() { //set initial state to zero while switching tabs
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      actions.setInitialState();
    });
    getItem("calculationHistory").then(res => {
      if (res != null) {
        actions.saveEquation(res)
      }
    }
    ).catch(err => showError(err))
  }

  componentWillUnmount() {
    this._unsubscribe();
  }


  _onModalClose = () => {
    this.setState({
      isModalVisible: false
    })
  }

  _onBtn = (type, value) => {
    return _.isEqual(type, "number") ? this.handleNumbers(value, type)
      : this.operatorSwitching(value);
  }
  operatorSwitching = (value) => {
    switch (value) {
      case "+":
        this.handleOperators(value)
        break;
      case "-":
        this.handleOperators(value)
        break;
      case "x":
        this.handleOperators(value)
        break;
      case "÷":
        this.handleOperators(value)
        break;
      default:
        showError("please enter valid operator");
        break;
    }
  }

  handleNumbers = (value) => {
    const { displayValue } = this.props;
    if (_.isEqual("0", displayValue) || _.isEqual("00", displayValue)) {
      // to change 0 and 00 to pressed number
      actions.displayValues(value);
    }
    else {
      actions.displayValues(`${displayValue}${value}`);
      this.showTotal(value);
    }
  }


  handleOperators = (value) => {
    const { displayValue } = this.props;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (_.includes(["+", "-", "x", "÷",], lastInsertedValue)) {
      if (_.isEqual(lastInsertedValue, value)) {
        return;
      }
      else {
        let newDisplayValue = displayValue.substring(0, displayValue.length - 1)
          + value
          + displayValue.substring(displayValue.length);
        actions.displayValues(newDisplayValue);
      }
    }
    else {
      actions.displayValues(`${displayValue}${value}`);
    }
  }

  showTotal = (value) => {
    const { displayValue } = this.props;
    let newCurrentValue = `${displayValue}${value}`.replace(/x/gi, "*").replace(/÷/gi, "/");
    if (!newCurrentValue.includes("+") && !newCurrentValue.includes("-") &&
      !newCurrentValue.includes("*") && !newCurrentValue.includes("/")) {
      return;
    }
    else {
      try {
        let total = mathExp.eval(newCurrentValue).toString();
        actions.finalOutcome(total);
      } catch (error) {
        return;
      }
    }
  }

  _onPercentBtn = () => {
    const { displayValue } = this.props;
    if (displayValue === "0") {
      return;
    }
    else {
      try {
        let percentValue = mathExp.eval(`${displayValue}/100`).toString();
        actions.finalOutcome(percentValue);
      } catch (error) {
        return;
      }
    }
  }


  _onEqual = () => {
    const { finalOutcome, displayValue, historyData } = this.props
    if (finalOutcome === null) {
      showError("please enter valid expression")
    }
    else {
      let keyValues = {};
      keyValues["displayValue"] = displayValue;
      keyValues["total"] = finalOutcome;
      let demoHistoryData = [...historyData];
      demoHistoryData.splice(historyData.length, 0, keyValues);
      actions.saveEquation(demoHistoryData)
      actions.displayValues(finalOutcome);
      actions.finalOutcome(null);
    }
  }

  _onAllClear = () => {
    actions.displayValues("0");
    actions.finalOutcome(null);
  }

  _onBackSpace = () => {
    const { displayValue } = this.props;
    if (displayValue === "0" || displayValue === "00") {
      return;
    }
    else {
      let editedValue = `${displayValue}`.slice(0, -1);
      if (editedValue.length === 0) {
        actions.displayValues("0");
        actions.finalOutcome(null)
      }
      else {
        actions.displayValues(editedValue);
        // let checkOperators=/|"+"|"-"|"x"|"÷"|/
        if (editedValue.includes("+") || editedValue.includes("-") || editedValue.includes("x") || editedValue.includes("÷")) {
          // if(checkOperators.test(editedValue)){
          let newEditedValue = editedValue.replace(/x/gi, "*").replace(/÷/gi, "/");
          try {
            let newTotal = mathExp.eval(newEditedValue).toString();
            actions.finalOutcome(newTotal);
          } catch (error) {
            return;
          }
        }
        else {
          actions.finalOutcome(null)
        }
      }
    }
  }

  _openHistoryView = () => {
    this.setState({ isHistoryViewOpen: true });
  }

  _onClearHistoryData = () => {
    removeItem("calculationHistory");
    actions.clearHistory();
  }

  render() {
    const { displayValue, finalOutcome, historyData } = this.props;
    const { isHistoryViewOpen } = this.state;
    return (
      <WrapperContainer statusBarColor={colors.transparent} barStyle={'dark-content'} >
        <View style={styles.calcEnteredTxtView}>
          <Text style={styles.enteredTxt}>{displayValue}</Text>
          {!!finalOutcome && <Text style={styles.finalOutcome}>{finalOutcome}</Text>}
        </View>
        {isHistoryViewOpen ? <View style={styles.touchPadView}>
          <View style={styles.expressionHistoryView}>
            <FlatList
              data={historyData}
              keyExtractor={(v, i) => i.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return (
                  <View style={styles.historyExpressionsView}>
                    <Text style={styles.historyExpressionTxt}>{item.displayValue}</Text>
                    <Text style={styles.historyTotal}>{item.total}</Text>
                  </View>
                )}
              }
            />
          </View>
          <View style={styles.continueClearView}>
            <TouchableOpacity onPress={() => this.setState({ isHistoryViewOpen: false })} style={styles.upArrowTouch}>
              <Image source={imagePath.ic_up_arrow} style={styles.upArrowImg} />
              <Text style={styles.continueClearTxt}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._onClearHistoryData()} style={styles.deleteTouch}>
              <Image source={imagePath.ic_trash} style={styles.upArrowImg} />
              <Text style={styles.continueClearTxt}>Clear</Text>
            </TouchableOpacity>
          </View>
        </View>
          :
          <View style={styles.touchPadView}>
            <TouchableOpacity style={styles.downArrowTouch} onPress={this._openHistoryView}>
              <Image source={imagePath.ic_down_arrow} style={styles.downArrowImg} />
            </TouchableOpacity>

            <View style={styles.calcTouchPadView}>
              <View style={styles.calcBtnsView}>
                <BtnComp btnTitle={strings.ALL_CLEAR} titleColor={colors.themeColor} _onBtn={this._onAllClear} />
                <BtnComp btnTitle={"%"} titleColor={colors.themeColor} _onBtn={this._onPercentBtn} />
                <BtnWithIcon btnTitle={imagePath.ic_backspace} _onBtn={this._onBackSpace} />
                <BtnComp btnTitle={"/"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "÷")} />
              </View>
              <View style={styles.calcBtnsView}>
                <BtnComp btnTitle={"7"} _onBtn={() => this._onBtn("number", "7")} />
                <BtnComp btnTitle={"8"} _onBtn={() => this._onBtn("number", "8")} />
                <BtnComp btnTitle={"9"} _onBtn={() => this._onBtn("number", "9")} />
                <BtnComp btnTitle={"×"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "x")} />
              </View>
              <View style={styles.calcBtnsView}>
                <BtnComp btnTitle={"4"} _onBtn={() => this._onBtn("number", "4")} />
                <BtnComp btnTitle={"5"} _onBtn={() => this._onBtn("number", "5")} />
                <BtnComp btnTitle={"6"} _onBtn={() => this._onBtn("number", "6")} />
                <BtnComp btnTitle={"-"} titleColor={colors.themeColor} titleFontSize={40} _onBtn={() => this._onBtn("operator", "-")} />
              </View>
              <View style={styles.calcBtnsView}>
                <BtnComp btnTitle={"1"} _onBtn={() => this._onBtn("number", "1")} />
                <BtnComp btnTitle={"2"} _onBtn={() => this._onBtn("number", "2")} />
                <BtnComp btnTitle={"3"} _onBtn={() => this._onBtn("number", "3")} />
                <BtnComp btnTitle={"+"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "+")} />
              </View>
              <View style={styles.calcBtnsView}>
                <BtnComp btnTitle={"0"} _onBtn={() => this._onBtn("number", "0")} />
                <BtnComp btnTitle={"00"} _onBtn={() => this._onBtn("number", "00")} />
                <BtnComp btnTitle={"."} _onBtn={() => this._onBtn("number", ".")} />
                <BtnComp btnTitle={"="} titleColor={colors.themeColor} titleFontSize={30} _onBtn={this._onEqual} />
              </View>
            </View>
          </View>}
      </WrapperContainer>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    displayValue: state.simpleCalc.displayValue,
    finalOutcome: state.simpleCalc.finalOutcome,
    historyData: state.simpleCalc.historyData,
  }
}

export default connect(mapStateToProps)(SimpleCalc);

const styles = StyleSheet.create({
  enteredTxt: {
    fontSize: 35,
    position: "absolute",
    bottom: 35,
    alignSelf: "flex-end",
    fontFamily: fontFamily.bold
  },
  finalOutcome: {
    fontSize: 27,
    position: "absolute",
    bottom: 5,
    alignSelf: "flex-end",
    fontFamily: fontFamily.extra_light
  },
  calcEnteredTxtView: {
    flex: 0.35,
    marginRight: 30
  },
  touchPadView: {
    flex: 0.65,
  },
  calcTouchPadView: {
    justifyContent: "space-between",
    flex: 0.92,
  },
  calcBtnsView: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-around",
  },
  downArrowImg: {
    height: 20,
    width: 20,
    alignSelf: "center",
    tintColor: colors.extraLightGrey,
    resizeMode: "contain",
  },
  downArrowTouch: {
    flex: 0.08,
    justifyContent: "center"
  },
  expressionHistoryView: {
    flex: 0.93,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGrey,
  },
  upArrowImg: {
    height: 15,
    width: 15,
    tintColor: colors.extraLightGrey,
    resizeMode: "contain",
  },
  continueClearView: {
    flex: 0.07,
    borderTopWidth: 0.5,
    borderTopColor: colors.lightGrey,
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-around",

  },
  upArrowTouch: {
    alignItems: "center"
  },
  deleteTouch: {
    alignItems: "center",
  },
  continueClearTxt: {
    fontFamily: fontFamily.regular,
    color: colors.extraLightGrey,
    fontSize: 12
  },
  historyExpressionsView: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginHorizontal: 30

  },
  historyExpressionTxt: {
    fontSize: 18,
    fontFamily: fontFamily.extra_light,
    marginTop: 10
  },
  historyTotal: {
    fontSize: 24,
    fontFamily: fontFamily.bold,
    marginBottom: 7,
    marginTop: -7
  }
})

