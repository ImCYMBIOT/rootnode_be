import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const res = await axios.post("http://localhost:3000/auth/register", {
				name,
				email,
				password,
			});

			const { uuid, name: returnedName } = res.data;

			localStorage.setItem("user", JSON.stringify({ uuid, name: returnedName }));
			navigate("/");
		} catch (err) {
			setError(err.response?.data?.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<div className="absolute left-5 top-5 h-40 w-40 rounded-full bg-light-purple opacity-20"></div>
			<div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-light-purple opacity-10"></div>

			<div className="relative z-10 w-full max-w-md rounded-br-[120px] rounded-tl-[120px] bg-gunmetal p-8 shadow-xl">
				<h2 className="mb-6 text-center text-4xl font-bold text-white">Join Us!</h2>
				<p className="mb-8 text-center text-white">
					Ready to start your coding journey? Create your account and begin your adventure with us today!
				</p>

				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full rounded-lg bg-white p-4 text-gunmetal placeholder-gunmetal focus:outline-none focus:ring-4 focus:ring-white"
						placeholder="Enter your name"
					/>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded-lg bg-white p-4 text-gunmetal placeholder-gunmetal focus:outline-none focus:ring-4 focus:ring-white"
						placeholder="Enter your email"
						required
					/>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded-lg bg-white p-4 text-gunmetal placeholder-gunmetal focus:outline-none focus:ring-4 focus:ring-white"
						placeholder="Enter your password"
						required
					/>

					{error && (
						<p className="text-center rounded-md bg-red-500 px-4 py-2 text-white font-semibold">
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={loading}
						className="mt-4 w-full rounded-lg bg-bright-purple py-3 font-bold text-white shadow-md transition duration-300 hover:bg-light-purple disabled:opacity-60"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>

				<p className="mt-6 text-center text-white">
					Already have an account?{" "}
					<span
						onClick={() => navigate("/login")}
						className="cursor-pointer font-bold text-light-purple hover:underline"
					>
						Login
					</span>
				</p>
			</div>
		</div>
	);
};

export default Register;
