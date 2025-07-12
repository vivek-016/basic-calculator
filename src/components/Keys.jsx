import React from "react";

const Keys = ({ label, keyClass, onButtonClick, isPressed }) => {
	// styling classes for = key and for highlight when clicked
	const equalClass =
		"text-white col-[span_2] bg-fuchsia-500 border-b-4 border  border-fuchsia-700 font-extrabold hover:bg-white hover:text-fuchsia-500 active:translate-y-1";
	const highlight = isPressed ? "ring-2 ring-fuchsia-500 scale-95" : "";
	return (
    // Each key
		<div
			className={`${
				keyClass
					? equalClass
					: "hover:bg-fuchsia-100 active:translate-y-1"
			}  ${highlight} flex items-center justify-center cursor-pointer p-4 rounded-lg hover:bg-fuchsia-100 shadow-md select-none transition-all duration-150 ease-in-out font-sans`}
			onClick={() => onButtonClick(label)}
		>
			{label}
		</div>
	);
};

export default Keys;
