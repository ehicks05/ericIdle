const Button = ({ className, error, ...rest }) => {
  const hover = error
    ? "bg-red-700"
    : "hover:bg-gray-100 dark:hover:bg-gray-800";
  const border = "border rounded-sm border-gray-300 dark:border-gray-500";
  const disabled = "disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <button
      className={`px-3 py-0.5 ${disabled} ${border} ${hover} ${className}`}
      {...rest}
    ></button>
  );
};

export default Button;
