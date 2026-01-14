"use client";

interface UserAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// Get avatar background color based on name
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-cyan-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export default function UserAvatar({ name, size = "md" }: UserAvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(name)}`}
    >
      {getInitials(name)}
    </div>
  );
}
