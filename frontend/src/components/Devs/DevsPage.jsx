import React from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

export default function DevsPage() {
	const teamMembers = [
		{
			name: "Ishan Jaiswal",
			role: "Team Lead / Full Stack Developer",
			image: "/team/member1.jpg",
			college: "VIT Bhopal University",
			email: "alex.johnson@example.com",
			phone: "+1 (555) 123-4567",
			github: "https://github.com/alexjohnson",
			linkedin: "https://linkedin.com/in/alexjohnson",
			skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
			bio: "Full stack developer with 5 years of experience building scalable web applications. Passionate about clean code and user-centric design.",
		},
		{
			name: "Agnivesh Kumar",
			role: "Backend Engineer",
			image: "/team/member2.jpg",
			college: "VIT Bhopal University",
			email: "priya.sharma@example.com",
			phone: "+1 (555) 234-5678",
			github: "https://github.com/priyasharma",
			linkedin: "https://linkedin.com/in/priyasharma",
			skills: [
				"Figma",
				"Adobe XD",
				"UI Design",
				"User Research",
				"Prototyping",
			],
			bio: "Creative designer focused on crafting intuitive and beautiful user experiences. Combines aesthetic sensibility with practical usability principles.",
		},
		{
			name: "Harshit Gupta",
			role: "Frontend Developer",
			image: "/team/member3.jpg",
			college: "VIT Bhopal University",
			email: "guptaharshit0921@gmail.com",
			phone: "+91 9997011103",
			github: "https://github.com/Harshitcld92",
			linkedin: "https://linkedin.com/in/harshitcld92",
			skills: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"],
			bio: "Frontend developer with a knack for crafting responsive and visually appealing interfaces. Enjoys turning complex problems into simple, beautiful designs.",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
			{teamMembers.map((member, index) => (
				<div
					key={index}
					className="overflow-hidden rounded-lg bg-white shadow-md"
				>
					<img
						src={member.image}
						alt={member.name}
						className="h-64 w-full object-cover"
					/>
					<div className="p-4">
						<h2 className="text-xl font-semibold">{member.name}</h2>
						<p className="text-gray-600 text-sm">{member.role}</p>
						<p className="mt-1 text-sm">{member.college}</p>
						<p className="text-gray-700 mt-2 text-sm">
							{member.bio}
						</p>
						<div className="mt-2 flex flex-wrap gap-2">
							{member.skills.map((skill, i) => (
								<span
									key={i}
									className="bg-blue-100 text-blue-800 rounded px-2.5 py-0.5 text-xs font-medium"
								>
									{skill}
								</span>
							))}
						</div>
						<div className="text-gray-600 mt-4 flex gap-4">
							<a href={`mailto:${member.email}`}>
								<Mail />
							</a>
							<a href={`tel:${member.phone}`}>
								<Phone />
							</a>
							<a
								href={member.github}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github />
							</a>
							<a
								href={member.linkedin}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Linkedin />
							</a>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
