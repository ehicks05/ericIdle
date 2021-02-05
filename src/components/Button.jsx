const Button = ({ className, ...rest }) => {
  return (
    <button
      className={`px-3 py-0.5 border rounded-sm border-gray-300 dark:border-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    ></button>
  );
};

export default Button;
