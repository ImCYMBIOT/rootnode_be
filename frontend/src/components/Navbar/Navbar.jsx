import logo from "../../assets/logo.svg";
import Hamburger from "hamburger-react";
import { useState, useEffect } from "react";
import Logo from "../../Logo/Logo";
import Button from "../Button/Button";
import Navlink from "./Navlink";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const navigate = useNavigate();
	const [isOpen, setOpen] = useState(false);
	const [userName, setUserName] = useState(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);

	useEffect(() => {
		// Get user info from localStorage
		const user = JSON.parse(localStorage.getItem("user"));
		if (user?.name) {
			setUserName(user.name);
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("user");
		setUserName(null);
		navigate("/login");
	};

	const handleLogin = () => {
		navigate("/login");
	};

	return (
		<nav className="relative flex items-center justify-between bg-background px-4 py-3">
			<Logo
				logo={logo}
				logoOnly={false}
				x="w-14"
				y="h-14"
				fontSize="text-xl"
				fontWeight="font-bold"
			/>
			<div className="hidden md:block">
				<ul className="items-center justify-between gap-5 md:flex">
					<Navlink text="Streams" route="/stream" />
					<Navlink text="Archives" route="/archives" />
					<Navlink text="Sandbox" route="/sandbox" />
					<Navlink text="Learn" route="/learn" />
					<Navlink text="Devs" route="/devs" />
					{userName ? (
						<div className="relative">
							<button
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="ml-4 rounded-lg bg-light-purple px-4 py-2 font-bold text-white hover:bg-bright-purple"
							>
								{userName}
							</button>
							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-32 rounded-lg bg-white shadow-lg">
									<button
										onClick={handleLogout}
										className="block w-full px-4 py-2 text-left text-gunmetal hover:bg-light-purple hover:text-white"
									>
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<Button text="Login" onClick={handleLogin} />
					)}
				</ul>
			</div>
			<div className="md:hidden">
				<Hamburger
					color="#EBEBEB"
					easing="ease-in-out"
					distance="sm"
					size={32}
					toggled={isOpen}
					toggle={setOpen}
				/>
			</div>
		</nav>
	);
};

export default Navbar;
