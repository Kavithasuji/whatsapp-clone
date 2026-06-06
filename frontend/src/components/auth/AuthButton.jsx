export default function AuthButton({
  text,
  disabled = false,
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        w-full
        h-14
        rounded-2xl
        text-white
        font-semibold
        transition
        ${
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : `
              bg-gradient-to-r
              from-[#25D366]
              to-[#128C7E]
              hover:opacity-90
            `
        }
      `}
    >
      {text}
    </button>
  );
}