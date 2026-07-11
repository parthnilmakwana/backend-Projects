function Button({ children = "Click me", className = "", ...props }) {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
