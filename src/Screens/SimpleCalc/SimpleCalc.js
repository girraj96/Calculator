import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

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


 class SimpleCalc extends Component {

  componentDidMount() { //set initial state in tab routes
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
      else {
        actions.displayValues(`${displayValue}${value}`);
        this.showTotal(value);
      }
    }


    handleOperators = (value) => {
      const { displayValue } = this.props;
      let lastInsertedValue = displayValue.substring(displayValue.length - 1);
      console.log(lastInsertedValue, value)
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
      let newEditedValue = editedValue.replace(/x/gi, "*").replace(/÷/gi, "/");
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
    const {displayValue,finalOutcome}=this.props;
    return (
      <WrapperContainer statusBarColor={colors.transparent} barStyle={'dark-content'} >
        <View style={styles.calcEnteredTxtView}>
          <Text style={styles.enteredTxt}>{displayValue}</Text>
          {!!finalOutcome && <Text style={styles.finalOutcome}>{finalOutcome}</Text>}
        </View>
        <View style={styles.calcTouchPadView}>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle={strings.ALL_CLEAR} titleColor={colors.themeColor} _onBtn={this._onAllClear} />
            <BtnComp btnTitle={"%"} titleColor={colors.themeColor} _onBtn={this._onPercentBtn} />
            <BtnWithIcon btnTitle={imagePath.ic_backspace} _onBtn={this._onBackSpace} />
            <BtnComp btnTitle={"÷"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "÷")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle="7" _onBtn={() => this._onBtn("number", "7")} />
            <BtnComp btnTitle="8" _onBtn={() => this._onBtn("number", "8")} />
            <BtnComp btnTitle="9" _onBtn={() => this._onBtn("number", "9")} />
            <BtnComp btnTitle={"×"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "x")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle="4" _onBtn={() => this._onBtn("number", "4")} />
            <BtnComp btnTitle="5" _onBtn={() => this._onBtn("number", "5")} />
            <BtnComp btnTitle="6" _onBtn={() => this._onBtn("number", "6")} />
            <BtnComp btnTitle={"-"} titleColor={colors.themeColor} titleFontSize={40} _onBtn={() => this._onBtn("operator", "-")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle="1" _onBtn={() => this._onBtn("number", "1")} />
            <BtnComp btnTitle="2" _onBtn={() => this._onBtn("number", "2")} />
            <BtnComp btnTitle="3" _onBtn={() => this._onBtn("number", "3")} />
            <BtnComp btnTitle={"+"} titleColor={colors.themeColor} titleFontSize={30} _onBtn={() => this._onBtn("operator", "+")} />
          </View>
          <View style={styles.calcBtnsView}>
            <BtnComp btnTitle="0" _onBtn={() => this._onBtn("number", "0")} />
            <BtnComp btnTitle="00" _onBtn={() => this._onBtn("number", "00")} />
            <BtnComp btnTitle="." _onBtn={() => this._onBtn("number", ".")} />
            <BtnComp btnTitle={"="} titleColor={colors.themeColor} titleFontSize={30} _onBtn={this._onEqual} />
          </View>

        </View>
      </WrapperContainer>

    )
  }
}

const mapStateToProps=(state)=>{
  return {
    displayValue:state.simpleCalc.displayValue,
    finalOutcome:state.simpleCalc.finalOutcome,
  }
}

export default connect(mapStateToProps)(SimpleCalc);

const styles = StyleSheet.create({
  enteredTxt: {
    fontSize: 32,
    fontWeight: "700",
    position: "absolute",
    bottom: 35,
    alignSelf: "flex-end",
  },
  finalOutcome:{
    fontSize: 27,
    position: "absolute",
    bottom: 5,
    color:colors.lightGrey,
    alignSelf: "flex-end",
  },
  calcEnteredTxtView: {
    flex: 0.45,
    marginRight: 30
  },
  calcTouchPadView: {
    flex: 0.55,
    justifyContent: "space-between"
  },
  calcBtnsView: {
    flexDirection: "row",
    height: 50,
    justifyContent: "space-around"
  }
})

