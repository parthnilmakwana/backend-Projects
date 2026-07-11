import React from "react";

function Input({ type = "text", name, value, onChange, placeholder, required = false, className = "", ...props }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors ${className}`}
      {...props}
    />
  );
}

export default Input;
