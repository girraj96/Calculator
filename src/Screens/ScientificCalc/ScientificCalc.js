import React, { Component } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

//third party libraries
import mathExp from "math-expression-evaluator";
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import _ from 'lodash';
import { showError } from '../../utils/helperFunctions';



//components
import BtnComp from '../../Components/BtnComp'
import BtnWithIcon from '../../Components/BtnWithIcon'
import InverseBtnComp from '../../Components/InverseBtnComp'
import WrapperContainer from '../../Components/WrapperContainer'

//constants
import imagePath from '../../constants/imagePath'
import strings from '../../constants/lang'
import colors from '../../styles/colors'



class ScientificCalc extends Component {

  state = {
    demoValue: "0"
  }

  componentDidMount() {
    const { navigation } = this.props
    this._unsubscribe = navigation.addListener('focus', () => {
      actions.setInitialState();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
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
      case "^":
        this.handleOperators(value)
        break;
      case "(":
        this.handleOpenBracket(value)
        break;
      case ")":
        this.handleCloseBracket(value)
        break;
      default:
        showError("please enter valid operator");
        break;
    }
  }

  handleNumbers = (value) => {
    const { displayValue } = this.props;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (_.isEqual("0", displayValue) || _.isEqual("00", displayValue)) {
      // to change 0 and 00 to pressed number
      actions.displayValues(value);
    }
    else if (_.includes([")", "π", "!", 'e'], lastInsertedValue)) {
      actions.displayValues(`${displayValue}x${value}`);
      this.showTotal(`*${value}`);
    }
    else {
      actions.displayValues(`${displayValue}${value}`);
      this.showTotal(value);
    }
  }

  handleOperators = (value) => {
    const { displayValue } = this.props;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    console.log(lastInsertedValue, value)
    if (_.includes(["+", "-", "x", "÷", "^"], lastInsertedValue)) {
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
    let newCurrentValue = `${displayValue}${value}`.replace(/x/gi, "*").replace(/÷/gi, "/").replace(/√/gi, "root")
      .replace(/π/g, "3.1415");
    if (!newCurrentValue.includes("+") && !newCurrentValue.includes("-") &&
      !newCurrentValue.includes("*") && !newCurrentValue.includes("/") &&
      !newCurrentValue.includes("root") && !newCurrentValue.includes("^") &&
      !newCurrentValue.includes("!") && !newCurrentValue.includes("log") &&
      !newCurrentValue.includes("ln") && !newCurrentValue.includes("sin") &&
      !newCurrentValue.includes("cos") && !newCurrentValue.includes("tan")) {
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

  handleOpenBracket = (value) => {
    const { displayValue } = this.props;
    let numbers = /^[-+]?[0-9]+$/;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (numbers.test(lastInsertedValue) || _.includes(['!', 'e'], lastInsertedValue)) {
      actions.displayValues(`${displayValue}x${value}`);
    }
    else {
      actions.displayValues(`${displayValue}${value}`);
    }
  }

  handleCloseBracket = (value) => {
    const { displayValue } = this.props;
    if (_.countBy(displayValue)["("] === _.countBy(displayValue)[")"] /* count the number of brackets */) {
      return;
    }
    actions.displayValues(`${displayValue}${value}`);
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

  _onSqrt = (value) => {
    const { displayValue } = this.props
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(`${value}(`);
    }
    else {
      let numbers = /^[-+]?[0-9]+$/;
      if (numbers.test(lastInsertedValue)) {
        actions.displayValues(`${displayValue}x${value}(`);
        this.showTotal(`*${value}`);
      }
      else if (_.includes(['+', '-', 'x', '÷', '^'], lastInsertedValue)) {
        actions.displayValues(`${displayValue}${value}(`);
      }
      else {
        actions.displayValues(`${displayValue}x${value}(`);
      }
    }
  }

  _onPie = (value) => {
    const { displayValue } = this.props
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(value);
      this.showTotal(`+${value}`)
    }
    else {
      let numbers = /^[-+]?[0-9]+$/;
      if (numbers.test(lastInsertedValue)) {
        actions.displayValues(`${displayValue}x${value}`);
        this.showTotal(`*${value}`)
      }
      else if (_.includes(['+', '-', 'x', '÷', '(', '^'], lastInsertedValue)) {
        actions.displayValues(`${displayValue}${value}`);
        this.showTotal(value)
      }
      else {
        actions.displayValues(`${displayValue}x${value}`);
        this.showTotal(`*${value}`)
      }
    }
  }

  _onFactorial = (value) => {
    const { displayValue } = this.props
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(`${displayValue}${value}`);
      this.showTotal(value)
    }
    else {
      actions.displayValues(`${displayValue}${value}`);
      this.showTotal(value)
    }
  }
  _onConstantE = (value) => {
    const { displayValue } = this.props
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(value);
      this.showTotal(`+${value}`)
    }
    else if (_.includes(['+', '-', 'x', '÷', '(', '^'], lastInsertedValue)) {
      actions.displayValues(`${displayValue}${value}`);
      this.showTotal(value)
    }
    else {
      actions.displayValues(`${displayValue}x${value}`);
      this.showTotal(`*${value}`)
    }
  }

  _onLogAndTrigonomatric = (value) => {
    const { displayValue } = this.props
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(`${value}(`);
    }
    else if (_.includes(['+', '-', 'x', '÷', '(', '^'], lastInsertedValue)) {
      actions.displayValues(`${displayValue}${value}(`);
      this.showTotal(value)
    }
    else {

      actions.displayValues(`${displayValue}x${value}(`);
      this.showTotal(`*${value}`)
    }
  }


  _onEqual = () => {
    const { finalOutcome } = this.props
    if (finalOutcome === null) {
      showError("please enter valid expression")
    }
    else {
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
    if (displayValue === "0" || displayValue==="00") {
      return;
    }
    else {
      let editedValue = displayValue.toString().slice(0, -1);
      if (editedValue.length === 0) {
        actions.displayValues("0");
        actions.finalOutcome(null)
      }
      else {
        actions.displayValues(editedValue);
        let newEditedValue = editedValue.replace(/x/gi, "*").replace(/÷/gi, "/").replace(/√/gi, "root")
          .replace(/π/g, "3.1415");
        console.log("edited value====>", newEditedValue)
        try {
          let newTotal = mathExp.eval(newEditedValue).toString();
          actions.finalOutcome(newTotal)
        } catch (error) {
          return;
        }
      }
    }
  }

  render() {
    const { displayValue, finalOutcome } = this.props
    return (
      <WrapperContainer statusBarColor={colors.transparent} barStyle={'dark-content'} >
        <View style={styles.calcEnteredTxtView}>
          <Text style={styles.enteredTxt}>{displayValue.toLocaleString()}</Text>
          {!!finalOutcome && <Text style={styles.finalOutcome}>{finalOutcome}</Text>}
        </View>
        <View style={styles.calcTouchPadView}>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"ln"} _onBtn={() => this._onLogAndTrigonomatric("ln")} />
            <BtnComp btnTitle={"log"} _onBtn={() => this._onLogAndTrigonomatric("log")} />
            <BtnComp btnTitle={"e"} _onBtn={() => this._onConstantE("e")} />
            <BtnComp btnTitle={"("} _onBtn={() => this._onBtn("operator", "(")} />
            <BtnComp btnTitle={")"} _onBtn={() => this._onBtn("operator", ")")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"√"} _onBtn={() => this._onSqrt("√")} />
            <BtnComp btnTitle={"π"} _onBtn={() => this._onPie("π")} />
            <BtnComp btnTitle={"sin"} _onBtn={() => this._onLogAndTrigonomatric("sin")} />
            <BtnComp btnTitle={"cos"} _onBtn={() => this._onLogAndTrigonomatric("cos")} />
            <BtnComp btnTitle={"tan"} _onBtn={() => this._onLogAndTrigonomatric("tan")} />
          </View>
          <View style={styles.calcBtnsView}>
            <TouchableOpacity style={styles.btnView} onPress={() => this._onBtn("operator", "^")}>
              <Text style={styles.btnName}>x</Text>
              <Text style={styles.inverseTxt}>n</Text>
            </TouchableOpacity>
            <BtnComp btnTitle={"x!"} _onBtn={() => this._onFactorial("!")} />
            <InverseBtnComp btnTitle={"sin"} _onBtn={() => this._onLogAndTrigonomatric("asin")} />
            <InverseBtnComp btnTitle={"cos"} _onBtn={() => this._onLogAndTrigonomatric("acos")} />
            <InverseBtnComp btnTitle={"tan"} _onBtn={() => this._onLogAndTrigonomatric("atan")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"7"} _onBtn={() => this._onBtn("number", "7")} />
            <BtnComp btnTitle={"8"} _onBtn={() => this._onBtn("number", "8")} />
            <BtnComp btnTitle={"9"} _onBtn={() => this._onBtn("number", "9")} />
            <BtnComp btnTitle={strings.ALL_CLEAR} titleColor={colors.themeColor} _onBtn={this._onAllClear} />
            <BtnWithIcon btnTitle={imagePath.ic_backspace} _onBtn={this._onBackSpace} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"4"} _onBtn={() => this._onBtn("number", "4")} />
            <BtnComp btnTitle={"5"} _onBtn={() => this._onBtn("number", "5")} />
            <BtnComp btnTitle={"6"} _onBtn={() => this._onBtn("number", "6")} />
            <BtnComp btnTitle={"×"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "x")} />
            <BtnComp btnTitle={"÷"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "÷")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"1"} _onBtn={() => this._onBtn("number", "1")} />
            <BtnComp btnTitle={"2"} _onBtn={() => this._onBtn("number", "2")} />
            <BtnComp btnTitle={"3"} _onBtn={() => this._onBtn("number", "3")} />
            <BtnComp btnTitle={"+"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "+")} />
            <BtnComp btnTitle={"-"} titleColor={colors.themeColor} titleFontSize={40} _onBtn={() => this._onBtn("operator", "-")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"0"} _onBtn={() => this._onBtn("number", "0")} />
            <BtnComp btnTitle={"00"} _onBtn={() => this._onBtn("number", "00")} />
            <BtnComp btnTitle={"."} _onBtn={() => this._onBtn("number", ".")} />
            <BtnComp btnTitle={"%"} titleColor={colors.themeColor} _onBtn={this._onPercentBtn} />
            <BtnComp btnTitle={"="} titleColor={colors.themeColor} titleFontSize={30} _onBtn={this._onEqual} />
          </View>

        </View>
      </WrapperContainer>

    )
  }
}
const mapStatToProps = (state) => {
  return {
    displayValue: state.simpleCalc.displayValue,
    finalOutcome: state.simpleCalc.finalOutcome,
  }
}

export default connect(mapStatToProps)(ScientificCalc);

const styles = StyleSheet.create({
  enteredTxt: {
    fontSize: 32,
    fontWeight: "700",
    position: "absolute",
    bottom: 35,
    alignSelf: "flex-end",
  },
  finalOutcome: {
    fontSize: 27,
    position: "absolute",
    bottom: 5,
    color: colors.lightGrey,
    alignSelf: "flex-end",
  },
  calcEnteredTxtView: {
    flex: 0.30,
    marginRight: 30
  },
  calcTouchPadView: {
    flex: 0.70,
    justifyContent: "space-between",
    marginBottom: 10
  },
  calcBtnsView: {
    flexDirection: "row",
    height: 30,
    justifyContent: "space-around"
  },
  btnView: {
    height: "100%",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  btnName: {
    position: "relative",
    fontSize: 20
  },
  inverseTxt: {
    position: "absolute",
    left: 47,
    top: 0
  }
})
