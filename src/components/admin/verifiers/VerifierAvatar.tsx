"use client";

interface VerifierAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export default function VerifierAvatar({ name, size = "md" }: VerifierAvatarProps) {
  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(name)}`}
    >
      {getInitials(name)}
    </div>
  );
}
