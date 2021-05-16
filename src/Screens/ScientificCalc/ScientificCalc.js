import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { countBy } from 'lodash'
import mathExp from "math-expression-evaluator";

//components
import BtnComp from '../../Components/BtnComp'
import BtnWithIcon from '../../Components/BtnWithIcon'
import InverseBtnComp from '../../Components/InverseBtnComp'
import WrapperContainer from '../../Components/WrapperContainer'

//constants
import imagePath from '../../constants/imagePath'
import strings from '../../constants/lang'
import colors from '../../styles/colors'
import { connect } from 'react-redux';
import actions from '../../redux/actions';


class ScientificCalc extends Component {

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
    const { displayValue } = this.props;
    if (type === "number") {
      this.checkInitialValue(value, type);
    }
    else if (type === "operator") {
      switch (value) {
        case "+":
          this._onCheckOperators(value, "+", "-", "x", "÷")
          break;
        case "-":
          this._onCheckOperators(value, "-", "+", "x", "÷")

          break;
        case "x":
          this._onCheckOperators(value, "x", "+", "-", "÷")
          break;
        case "÷":
          this._onCheckOperators(value, "÷", "+", "-", "x")
          break;
        case "(":
          this.checkInitialValue(value, type)
          break;
        case ")":
          this.checkInitialValue(value, type)
          break;
        default:
          alert("please check operator")
          break;
      }
    }
    this.showTotal(value);
  }

  showTotal=(value)=>{
    const {displayValue}=this.props;


    let newCurrentValue = `${displayValue}${value}`.replace(/x/gi, "*").replace(/÷/gi, "/").replace(/√/gi,"root");
    if (!newCurrentValue.includes("+") && !newCurrentValue.includes("-") &&
      !newCurrentValue.includes("*") && !newCurrentValue.includes("/") && !newCurrentValue.includes("root")) {
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

  checkInitialValue = (value, type) => {
    const {displayValue}=this.props;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(value);

    }
    else if (value === "(") {

      let numbers = /^[-+]?[0-9]+$/;
      if (numbers.test(lastInsertedValue)) {
        if (type === "operator") {
          actions.displayValues(`${displayValue}x${value}`);
        }
        else {
          actions.displayValues(`${displayValue}${value}`);
        }
      }
      else {
        actions.displayValues(`${displayValue}${value}`);
      }
    }
    else if (value === ")") {
      let countOpenBrackets = countBy(displayValue)["("];
      let countCloseBrackets = countBy(displayValue)[")"];
      if (countOpenBrackets === countCloseBrackets) {
        return;
      }
      actions.displayValues(`${displayValue}${value}`);

    }
    else {
      if (lastInsertedValue === ")") {
        if (type === "number") {
          actions.displayValues(`${displayValue}x${value}`);
        }
        else {
          return;
        }
      }
      else {
        actions.displayValues(`${displayValue}${value}`);
      }
    }
  }


  _onCheckOperators = (value, pressedOperator, checkOperator1, checkOperator2, checkOperator3) => {
    const { displayValue } = this.props;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (lastInsertedValue !== pressedOperator) {
      if (lastInsertedValue === checkOperator1 || lastInsertedValue === checkOperator2 || lastInsertedValue === checkOperator3) {
        let newDisplayValue = displayValue.substring(0, displayValue.length - 1)
          + pressedOperator
          + displayValue.substring(displayValue.length);
        actions.displayValues(newDisplayValue);
      }
      else {
        actions.displayValues(`${displayValue}${value}`);
      }
    }
  }

  _onEqual = () => {
    const { finalOutcome } = this.props
    actions.displayValues(finalOutcome);
    actions.finalOutcome(null);
  }

  _onAllClear = () => {
    const { displayValue } = this.props;
    if (displayValue !== "0") {
      actions.displayValues("0");
      actions.finalOutcome(null);

    }
    else {
      return;
    }
  }

  _onBackSpace = () => {
    const { displayValue } = this.props;
    if (displayValue === "0") {
      return;
    }
    else {
      let editedValue = displayValue.toString().slice(0, -1);
      if (editedValue.length === 0) {
        actions.displayValues("0");
      }
      else {
        actions.displayValues(editedValue);
      }
    }
  }

  _onPercentBtn = () => {
    const { displayValue } = this.props;
    if (displayValue === "0") {
      return;
    }
    else if (displayValue.includes("+") || displayValue.includes("-") ||
      displayValue.includes("x") || displayValue.includes("÷")) {
      return;
    }
    else {
      let percentValue = eval(displayValue / 100)
      actions.finalOutcome(percentValue);
    }
  }

  _onSqrt=(type, value)=>{
    const {displayValue}=this.props
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (displayValue === "0" || displayValue == "00") {
      actions.displayValues(`${value}(`);
    }
    else{
      let numbers = /^[-+]?[0-9]+$/;
      if (numbers.test(lastInsertedValue)) {
        if (type === "operator") {
          actions.displayValues(`${displayValue}x${value}(`);
        }
        else {
          actions.displayValues(`${displayValue}${value}`);
        }
      }
      else {
        actions.displayValues(`${displayValue}${value}(`);
      }
    }
    this.showTotal(value);


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
            <BtnComp btnTitle={"in"} _onBtn={() => this._onBtn("number", "4")} />
            <BtnComp btnTitle={"log"} _onBtn={() => this._onBtn("number", "5")} />
            <BtnComp btnTitle={"e"} _onBtn={() => this._onBtn("number", "6")} />
            <BtnComp btnTitle={"("} _onBtn={() => this._onBtn("operator", "(")} />
            <BtnComp btnTitle={")"} _onBtn={() => this._onBtn("operator", ")")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"√"} _onBtn={() => this._onSqrt("operator","√")} />
            <BtnComp btnTitle={"π"} _onBtn={() => this._onBtn("number", "5")} />
            <BtnComp btnTitle={"sin"} _onBtn={() => this._onBtn("number", "6")} />
            <BtnComp btnTitle={"cos"} _onBtn={() => this._onBtn("operator", "x")} />
            <BtnComp btnTitle={"tan"} _onBtn={() => this._onBtn("operator", "÷")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={"x²"} _onBtn={() => this._onBtn("number", "4")} />
            <BtnComp btnTitle={"|x|"} _onBtn={() => this._onBtn("number", "5")} />
            <InverseBtnComp btnTitle={"sin"} _onBtn={this._onBackSpace} />
            <InverseBtnComp btnTitle={"cos"} _onBtn={this._onBackSpace} />
            <InverseBtnComp btnTitle={"tan"} _onBtn={this._onBackSpace} />
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
  }
})
