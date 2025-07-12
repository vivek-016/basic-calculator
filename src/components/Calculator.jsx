import React, { useEffect, useState } from "react";
import Keys from "./Keys";

const Calculator = () => {
  // Keys that we are gonna use in UI
	const keys = [
		"AC",
		"C",
		"%",
		"/",
		"7",
		"8",
		"9",
		"*",
		"4",
		"5",
		"6",
		"-",
		"1",
		"2",
		"3",
		"+",
		"0",
		".",
		"=",
	];

  // Initializing dynamic variables for interaction
	const [showResult, setShowResult] = useState(false);
	const [display, setDisplay] = useState("");
	const [pressedKey, setPressedKey] = useState(null);

  // function for evaluating
	function evaluateResult(expr) {

    // validating input
		const tokens = expr.match(/(\d+(\.\d+)?%?|[+\-*/])/g);

		if (!tokens || tokens.length === 0) return "Error";

    // processing the percentage operation
		let processedTokens = [];

		for (let i = 0; i < tokens.length; i++) {
			const current = tokens[i];
			const next = tokens[i + 1];
      // changing a% to a/100
			if (current.includes("%")) {
				const value = parseFloat(current) / 100;
				processedTokens.push(value.toString());
        // if there is a next char and it is a number
				if (next && /^[\d.]+$/.test(next)) {
					processedTokens.push("*");
				}
			} else {
				processedTokens.push(current);
			}
		}

    // handling '*' and '/'
		let stack = [];
		let i = 0;
		while (i < processedTokens.length) {
			const token = processedTokens[i];
			if (token === "*" || token === "/") {
				const prev = parseFloat(stack.pop());
				const next = parseFloat(processedTokens[i + 1]);
        // handling the x/0 mathematical error
				if (token === "/" && next === 0)
					throw new Error("Error");
        // applying arithmetic operations
				const result = token === "*" ? prev * next : prev / next;
        // adding the result to stack as string
				stack.push(result.toString());
				i += 2;
			} else {
				stack.push(token);
				i++;
			}
		}

    // handling '+' and '-'
		let result = parseFloat(stack[0]);
		i = 1;
		while (i < stack.length) {
			const operator = stack[i];
			const next = parseFloat(stack[i + 1]);
      // applying arithmatic operation
			if (operator === "+") result += next;
			if (operator === "-") result -= next;
			i += 2;
		}

		return result;
	}

  // function for initializing calculation
	function calculateResult() {
    // avoiding empty calculations and recalculations
		if (display.length !== 0 && !showResult) {
			try {
        // using the evaluateResult to calculate
				let calcResult = evaluateResult(display);
        // rounding off to 3 digits
				calcResult = parseFloat(calcResult.toFixed(3));
        // display
				setDisplay(calcResult);
        // applying Result styling to display
				setShowResult(true);
			} catch (error) {
				setDisplay('Error');
			}
		}
	}

  // Using useEffect for interactive effects and it applies every time the display is changed
	useEffect(() => {
    // event function when we use the keyboard keys
		const handleKeyDown = (e) => {
			const key = e.key;
      // assigning keys and their values and calling handleButton function
			if (key === "Enter") handleButton("=");
			else if (key === "Backspace") handleButton("C");
			else if (key === "Escape") handleButton("AC");
			else if (/[\d.+\-*/%]/.test(key)) {
				handleButton(key);
			}
		};

    // adding event listeners to interact
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [display]);

  // function for handleButton
	function handleButton(value) {
    // for the key down animation
    setPressedKey(value);

    setTimeout(()=>setPressedKey(null),150);
    // when a button is clicked the showResult will be false to show equation styling in display
		setShowResult(false);
    // restting display when AC is clicked
		if (value === "AC") setDisplay("");
    // applying cancel option
		else if (value === "C") {
			if (showResult || display === "Error") {
				// Start fresh if it's a result or error
				setDisplay("");
				setShowResult(false);
			} else {
				setDisplay(display.slice(0, -1));
			}
		} 
    // if the value is operator, add operator
    else if (isOperator(value)) {
			if (display == "" || isOperator(display[display.length - 1]))
				return;
			setDisplay(display + value);
		} 
    // if the key is =, call evaluate function
    else if (value === "=") calculateResult();
    // if we click a button when display is error, then it starts a new display
		else if (display === "Error") setDisplay(value);
		else setDisplay(display + value);
	}

  // function to check if the char is an operator
	function isOperator(char) {
		return ["*", "/", "%", "+", "-"].includes(char);
	}

  // styling for the operations and result styling
	const operationClass =
		"text-[1.2rem] tracking-[2px] flex items-center gap-[5px] text-slate-500";
	const resultClass = "text-[1.7rem]";

	return (
    // Calculator
		<div className="min-w-[300px] max-w-[400px] w-full flex flex-col bg-white/70 backdrop-blur-md gap-4 p-4 rounded-2xl border border-slate-200">
			{/* display */}
      <div className="bg-slate-50 p-4 rounded-xl min-h-[100px] flex flex-col items-end justify-end shadow-inner">
				<div className={`${showResult ? resultClass : operationClass}`}>
					{display}
				</div>
			</div>
      {/* Keys */}
			<div className="grid grid-cols-[repeat(4,1fr)] gap-[0.3rem] p-4">
				{keys.map((item, index) => (
					<Keys
						label={item}
						key={index}
						keyClass={item === "="}
            isPressed={pressedKey === item}
						onButtonClick={handleButton}
					/>
				))}
			</div>
		</div>
	);
};

export default Calculator;
