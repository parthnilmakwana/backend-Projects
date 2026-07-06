

function Button({ text = 'Click Me',
    className = '',
    ...props
}) {
  return (
    <div>
      <button className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer ${className}`} {...props}>
        {text}
      </button>
    </div>
  )
}

export default Button
