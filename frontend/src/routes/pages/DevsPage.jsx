import React from "react";

const developers = [
	{
		name: "Ishan Jaiswal",
		email: "ishan@example.com",
		image: "/team/member1.jpg",
	},
	{
		name: "Agnivesh Kumar",
		email: "agnivesh@example.com",
		image: "/team/member2.jpg",
	},
	{
		name: "Naman Shukla",
		email: "namanshukla@example.com",
		image: "/team/member3.jpg",
	},
	{
		name: "Harshit Gupta",
		email: "guptaharshit0921@gmail.com",
		image: "/team/member6.jpg",
	},
	{
		name: "Anchal Devaliya",
		email: "anchal@example.com",
		image: "/team/member5.jpg",
	},
];

export default function DevsPage() {
	return (
		<div className="bg-gray-100 min-h-screen p-10">
			{/* Intro Header */}
			<div className="mb-10 text-center">
				<h1 className="text-gray-800 text-4xl font-bold">
					Meet the Developers
				</h1>
				<p className="text-gray-600 mx-auto mt-2 max-w-xl">
					We’re a passionate team of developers who collaborated to
					bring this project to life. Each member brings unique skills
					and creativity to make everything run smoothly.
				</p>
			</div>

			{/* Developer Cards */}
			<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
				{developers.map((dev, idx) => (
					<div
						key={idx}
						className="transform rounded-2xl bg-white p-8 text-center shadow-lg transition duration-300 hover:scale-105"
					>
						<img
							src={dev.image}
							alt={dev.name}
							className="mx-auto h-40 w-40 rounded-full object-cover"
						/>
						<h3 className="mt-6 text-2xl font-bold">{dev.name}</h3>
						<p className="text-md text-gray-700 mt-2">
							{dev.email}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
