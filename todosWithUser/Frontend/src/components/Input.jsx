function Input({ placeholder = "Enter text...", className = "", type = "text", ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  )
}

export default Input;
