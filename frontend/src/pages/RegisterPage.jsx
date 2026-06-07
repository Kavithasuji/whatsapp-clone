import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
import { registerUser } from "../services/authService";


export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    // username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    // email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain 8+ chars, uppercase, lowercase, number and special character";
    }

    // confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Confirm Password is required";
    } else if (
      formData.password !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const response = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success(response.message);

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
  navigate("/");
}, 1000);

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Registration failed"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthLayout>
      <div className="auth-card">

        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="whatsapp"
          className="auth-logo"
        />

        <h1 className="auth-title">
          Create Your Account
        </h1>

        <p className="auth-subtitle">
          Join WhatsApp today
        </p>

        <form onSubmit={handleSubmit}>

          <AuthInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            error={errors.username}
          />

          <AuthInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
          />

          <AuthInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            error={errors.password}
          />

          <AuthInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            error={errors.confirmPassword}
          />

          <div className="mt-6">
            <AuthButton
              text={
                loading
                  ? "Registering..."
                  : "Register"
              }
              disabled={loading}
            />          </div>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Link
            to="/"
            className="auth-link"
          >
            Login
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
}