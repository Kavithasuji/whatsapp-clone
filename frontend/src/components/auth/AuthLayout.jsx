export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      <div className="auth-header"></div>

      <div className="auth-wrapper">
        {children}
      </div>
    </div>
  );
}