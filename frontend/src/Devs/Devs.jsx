// src/pages/DevsPage.jsx
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
    name: "Harshit Gupta",
    email: "guptaharshit0921@gmail.com",
    image: "/team/member3.jpg",
  },
];

export default function DevsPage() {
  return (
    <div className="min-h-screen p-10 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {developers.map((dev, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow p-4 text-center">
          <img
            src={dev.image}
            alt={dev.name}
            className="w-32 h-32 rounded-full mx-auto object-cover"
          />
          <h3 className="text-lg font-semibold mt-4">{dev.name}</h3>
          <p className="text-sm text-gray-600">{dev.email}</p>
        </div>
      ))}
    </div>
  );
}
