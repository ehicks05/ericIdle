const Button = ({ className, ...rest }) => {
  return (
    <button
      className={`px-3 py-0.5 border rounded-sm border-gray-500 hover:bg-gray-800 disabled:opacity-50 ${className}`}
      {...rest}
    ></button>
  );
};

export default Button;
