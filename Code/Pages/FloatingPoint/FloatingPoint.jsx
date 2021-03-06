import React from "react"
import MathJax from 'react-mathjax-preview'

import {toBinaryStyle} from "../../Helpers/Binary"
import SimpleInput from "../../Components/SimpleInput"
import Style from "./FloatingPoint.css"

export default class FloatingPoint extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            Decimal: "",
            Sign: "0",
            Mantissa: "100 0000 0000 0000 0000 0000",
            Exponent: "1000 0000",
            isDecimalUp: true,
        }
    }


    ConvertFromNormalBinary(text) {
        text = toBinaryStyle(text)

        let complement1 =  text.split("").map(e => {
                    if (e !== "0" && e !== "1") return e 
                    if (e === "0") return  "1" 
                    if (e === "1") return  "0" 
                })
                .join("")

        this.setState({
            NormalBinary: text,
            Complement1: complement1,
        })
    }

    GetFullMantisa(sign, exponent, mantissa) {
        return exponent == "0000 0000"? "0." + mantissa : "1." + mantissa
    }

    CalculateDecimal(sign, exponent, mantissa) {

        if (exponent.replace(/ /g, "") == "11111111") {
            if (mantissa.replace(/ /g, "").replace(/0/g, "") == "") return `${(sign === "1")? "-" : "+"}∞` 
            else return "NaN"
        }

        let Mantissa = this.GetFullMantisa(sign, exponent, mantissa).replace(/ /g, "")

        let Decimal = 0.0
        Mantissa.split("").forEach((e, index) => {
            const realIndex = (index > 1)? index - 1: index
            if (index != 1 && e == "1") Decimal += 2.0**(-1 * realIndex)
        })


        if (exponent.replace(/ /g, "").replace(/0/g, "") == "")
            Decimal *= 2**((-126))
        else 
            Decimal *= 2**(parseInt(exponent.replace(/ /g, ""), 2) - (2**7 - 1) )

        return `${(sign === "1")? "-" : "+"}${Decimal}`
    }

    render () {
        return (
            <React.Fragment>
                <div className="row" style={{display: "grid", gridTemplateColumns: "5% 90% 5%"}}>
                    <div ></div>
                    <div className="col s12 m10 l8 offset-m1 offset-l2">
                        
                        <div className="row">
                            <h3 style={{fontWeight: 200}}> <b>Floating</b> Point </h3>

                            <br />

                            <h5>Definition</h5>
                            <p>
                                Floating point representation is based on scientific notation,
                                so, lets be x the number to store in floating point.

                                Then we have:
                                <MathJax math={`
                                $$
                                x := -1^{Sign} \\; Mantissa \\times 2^{Exponent}
                                $$`} />
                                <br />

                                There are other authors that generalize it more and say 
                                <MathJax math={`
                                $x \\in F(base, precision, minExp, maxExp)$`} />
                            </p>

                            <h5>Hidden bit</h5>
                            <p>
                                Something awesome of the binary and base-2 is that
                                any number that is not zero, when we express it in
                                scientific notation are of the form:
                                <MathJax math={` $\\pm 1.xxxx \\times 2^E$`} />
                                
                                So... We do not need to store
                                the first bit, that why it is called
                                the hidden bit.
                            </p>

                            <h5>Subnormal</h5>
                            <p>
                                To store the zero and many small numbers we have the idea
                                that when the exponent is composed of all zeros

                                We are talking of the number:
                                <MathJax math={` $\\pm 0.xxxx \\times 2^{minExp}$`} />
                            </p>

                            <h5>Infinity and NaN</h5>
                            <p>
                                To store the infinity and NaN we have the idea
                                that when the exponent is composed of all ones
                                and the mantissa is all zeros we are talking
                                about infinity.

                                Any other mantissa will represent a NaN (not a number)
                            </p>
                            
                        </div>
                        <br />

                        <div className="row">
                            
                            <div>
                                <MathJax 
                                    math={
                                        this.state.Exponent === "1111 1111"?
                                            (
                                                (this.state.Mantissa.replace(/ /g, "").replace(/0/g, "") === "")?
                                                    `$$ ${this.state.Sign === "1"? "-":"+"} \\infty$$`: `NaN`
                                            ):
                                            `$$
                                                ${this.state.Sign === "1"? "-":"+"}
                                                ${this.state.Exponent == "0000 0000"? "0.": "1."}
                                                ${this.state.Mantissa}
                                                \\times 2
                                                ^
                                                {
                                                    ${this.state.Exponent == "0000 0000"?
                                                    "-126":
                                                    parseInt(this.state.Exponent.replace(/ /g, ""), 2) - (2**7-1)
                                                    }
                                                }
                                            $$`
                                    } 
                                />
                            </div>

                            <div className={Style.Wrapper}>
                                
                                <div className={Style.SignText}>
                                    S
                                </div>
                                <div className={Style.ExponentText}>
                                    Exponent
                                </div>
                                <div className={Style.MantissaText}>
                                    Mantissa
                                </div>
                                <div style={{height: "1rem"}} className="white-text">
                                    a
                                </div>

                                <div className={Style.Sign}>
                                    <input 
                                        style={{
                                            borderBottom: "2px solid #FFFFFF",
                                            fontFamily: 'Courier New',
                                            fontSize: "1.5rem",
                                            fontWeight: "600",
                                            color: "white"
                                        }}
                                        maxLength={1}
                                        value={this.state.Sign}
                                        onChange={
                                            e => {
                                                const newValue = e.target.value
                                                this.setState( (preState) => {
                                                    return {
                                                        Sign: toBinaryStyle(newValue),
                                                        Decimal: this.CalculateDecimal(newValue, preState.Exponent, preState.Mantissa)
                                                    }
                                                })
                                            }
                                        }
                                    />
                                </div>
                                <div className={Style.Exponent}>
                                    <input 
                                        style={{
                                            borderBottom: "2px solid #FFFFFF",
                                            fontFamily: 'Courier New',
                                            fontSize: "1.5rem",
                                            fontWeight: "600",
                                            color: "white"
                                        }}
                                        maxLength={9}
                                        value={this.state.Exponent}
                                        onChange={
                                            e => {
                                                const newValue = e.target.value
                                                this.setState( (preState) => {
                                                    return {
                                                        Exponent: toBinaryStyle(newValue),
                                                        Decimal: this.CalculateDecimal(preState.Sign, newValue, preState.Mantissa)
                                                    }
                                                })
                                            }
                                        }
                                        
                                    />
                                </div>
                                <div className={Style.Mantissa}>
                                    <input 
                                        style={{
                                            borderBottom: "2px solid #FFFFFF",
                                            fontFamily: 'Courier New',
                                            fontSize: "1.5rem",
                                            fontWeight: "600",
                                            color: "white"
                                        }}
                                        maxLength={28}
                                        value={this.state.Mantissa}
                                        onChange={
                                            e => {
                                                const newValue = e.target.value
                                                this.setState( (preState) => {
                                                    return {
                                                        Mantissa: toBinaryStyle(newValue),
                                                        Decimal: this.CalculateDecimal(preState.Sign, preState.Exponent, newValue)
                                                    }
                                                })
                                            }
                                        }

                                    />
                                </div>
                                <div style={{height: "1rem"}} className="white-text">
                                    a
                                </div>

                            </div>

                            <br />
                            <br />

                            <SimpleInput 
                                title={"Decimal Input"}
                                materializeCSSColorText = "blue-grey-text text-darken-1"
                                readOnly = {true}
                                value={this.state.Decimal}
                                onChange={() => {}}
                            />
                            <br />
                            <br />

                        </div>
                    </div>
                    <div ></div>
                </div>
            </React.Fragment>
        )
    }
}