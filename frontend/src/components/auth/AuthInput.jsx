import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function AuthInput({
  label,
  type = "text",
  placeholder,
  name,
  value,
  onChange,
  error,
}) {
  const [showPassword, setShowPassword] =
    useState(false);

  const isPassword =
    type === "password";

  const inputType =
    isPassword
      ? (showPassword ? "text" : "password")
      : type;

  return (
    <div className="mb-5">

      <label className="block mb-2 font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full
            h-14
            px-4
            ${isPassword ? "pr-12" : ""}
            border-2
            rounded-2xl
            outline-none
            transition-all
            ${
              error
                ? "border-red-500"
                : "border-gray-200 focus:border-green-500"
            }
          `}
        />

        {isPassword && (
          <button
            type="button"
            aria-label={
              showPassword
                ? "Hide password"
                : "Show password"
            }
            onClick={() =>
              setShowPassword((prev) => !prev)
            }
            className="
              absolute
              right-4
              top-1/2
              -translate-y-1/2
              text-gray-500
              hover:text-gray-700
            "
          >
            {showPassword ? (
              <FiEyeOff size={20} />
            ) : (
              <FiEye size={20} />
            )}
          </button>
        )}

      </div>

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}

    </div>
  );
}
