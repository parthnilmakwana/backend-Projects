import React from "react";

function Button({ children, type = "button", onClick, disabled, variant = "primary", className = "", ...props }) {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 outline-none";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900",
    danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 focus:ring-2 focus:ring-offset-2 focus:ring-red-500",
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer active:scale-95";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
