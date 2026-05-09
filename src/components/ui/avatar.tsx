import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ src, alt, fallback, size = "md", className, ...props }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-primary/10 items-center justify-center",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt || fallback}
          className="aspect-square h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span className="font-semibold text-primary">{fallback}</span>
      )}
    </div>
  );
}
