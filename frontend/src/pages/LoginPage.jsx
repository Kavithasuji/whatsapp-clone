import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../components/auth/AuthLayout";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";

import { loginUser } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] =
    useState(false);

  const validate = () => {
    const newErrors = {};

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      newErrors.email =
        "Email is required";
    } else if (
      !emailRegex.test(formData.email)
    ) {
      newErrors.email =
        "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
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
      const response =
        await loginUser({
          email: formData.email,
          password: formData.password,
        });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.user
        )
      );

      toast.success(
        "Login Successful"
      );

      navigate("/chat");

    } catch (error) {

      toast.error(
        error?.response?.data
          ?.message ||
          "Login failed"
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
          Welcome Back
        </h1>

        <p className="auth-subtitle">
          Sign in to continue to WhatsApp
        </p>

        <form
          onSubmit={handleSubmit}
        >

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
            placeholder="Enter your password"
            error={errors.password}
          />

          <div className="text-right mb-6">

            <a
              href="#"
              className="text-[#128C7E] font-medium"
            >
              Forgot Password
            </a>

          </div>

          <AuthButton
            text={
              loading
                ? "Logging in..."
                : "Login"
            }
            disabled={loading}
          />

        </form>

        <div className="auth-footer">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="auth-link"
          >
            Create Account
          </Link>

        </div>

      </div>
    </AuthLayout>
  );
}
