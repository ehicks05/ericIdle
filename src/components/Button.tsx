/* eslint-disable react/button-has-type */
import React, { FC } from "react";
import { FaSpinner } from "react-icons/fa";

export interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  error?: string;
  children?: React.ReactNode;
}

const Button: FC<IProps> = ({
  loading,
  error,
  className,
  children,
  ...props
}: IProps) => {
  const hover = error
    ? "bg-red-700"
    : "hover:bg-gray-100 dark:hover:bg-gray-800";
  const border = "border rounded-sm border-gray-300 dark:border-gray-500";
  const disabled = "disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <button
      type={props.type || "button"}
      disabled={props.disabled || loading}
      className={`px-3 py-0.5 ${disabled} ${border} ${hover} ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {loading && <FaSpinner className="animate-spin" />}
        {error && <div className="bg-red-900 text-red-600">{error}</div>}
      </div>
    </button>
  );
};

export default Button;
