import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'
import mathExp from "math-expression-evaluator";

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
    const { displayValue } = this.props;
    if (type === "number") {
      if (displayValue === "0" || displayValue == "00") {
        // set first number in place of zeros
        actions.displayValues(value);
      }
      else {
        //set mathematical expression to display
        actions.displayValues(`${displayValue}${value}`);
      }
    }
    else if (type === "operator") {
      switch (value) {
        case "+":
          this._onCheckOperators(value,"+","-","x","÷")
          break;
        case "-":
          this._onCheckOperators(value,"-","+","x","÷")

          break;
        case "x":
          this._onCheckOperators(value,"x","+","-","÷")
          break;
          case "÷":
            this._onCheckOperators(value,"÷","+","-","x")
          break;
          default:
          alert("please check operator")
          break;
      }
    }
   let newCurrentValue = `${displayValue}${value}`.replace(/x/gi, "*").replace(/÷/gi, "/");
      if(!newCurrentValue.includes("+") && !newCurrentValue.includes("-") && 
       !newCurrentValue.includes("*") && !newCurrentValue.includes("/") ){ 
        return;
      } 
      else{
        try {
          let total = mathExp.eval(newCurrentValue).toString();
          actions.finalOutcome(total)
        } catch (error) {
          return;
        }
      }
  }

  _onCheckOperators=(value,pressedOperator,checkOperator1,checkOperator2,checkOperator3 )=>{
    const {displayValue}=this.props;
    let lastInsertedValue = displayValue.substring(displayValue.length - 1);
    if (lastInsertedValue !== pressedOperator) {
      if (lastInsertedValue === checkOperator1 || lastInsertedValue === checkOperator2 || lastInsertedValue ===checkOperator3) {
        let newDisplayValue = displayValue.substring(0, displayValue.length - 1)
          + pressedOperator
          + displayValue.substring(displayValue.length);
        actions.displayValues(newDisplayValue)
      }
      else {
        actions.displayValues(`${displayValue}${value}`)
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

   _onPercentBtn=()=>{
     const {displayValue}=this.props;
     if(displayValue==="0"){
       return;
     }
     else if(displayValue.includes("+") || displayValue.includes("-") ||
     displayValue.includes("x") || displayValue.includes("÷")){
       return;
     }
     else{
     let percentValue=eval(displayValue/100)
     actions.finalOutcome(percentValue);
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

