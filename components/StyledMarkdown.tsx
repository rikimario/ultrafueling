import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Mountain,
  Droplet,
  Flame,
  Snowflake,
  AlertTriangle,
  Sandwich,
} from "lucide-react";

// Utility: choose warm/cool theme based on temperature
function tempTheme(t: number) {
  if (t >= 20) {
    return {
      accent: "from-orange-500 to-red-600",
      iconColor: "text-red-500",
      cardBg: "bg-orange-50/70 dark:bg-orange-900/25",
      border: "border-orange-300 dark:border-orange-700",
    };
  }
  return {
    accent: "from-sky-500 to-blue-600",
    iconColor: "text-blue-500",
    cardBg: "bg-blue-50/70 dark:bg-blue-900/25",
    border: "border-blue-300 dark:border-blue-700",
  };
}

export default function StyledMarkdown({
  children,
  temperature,
}: {
  children: string;
  temperature?: number;
}) {
  const temp = Number(temperature);
  const theme = tempTheme(temp);

  return (
    <div
      className={`
        prose prose-neutral dark:prose-invert max-w-none
        relative p-0
        before:absolute before:inset-0 before:bg-[url('/textures/elevation-lines.svg')]
        before:opacity-10 before:pointer-events-none
      `}
    >
      <ReactMarkdown
        components={{
          h3: ({ children }) => (
            <div className="mt-10 mb-4">
              <div
                className={`
                  flex items-center gap-3 px-1 py-2 rounded-xl shadow 
                  text-white font-bold text-xl
                  bg-gradient-to-r ${theme.accent}
                  animate-fadeIn
                `}
              >
                <Mountain className="w-6 h-6" />
                {children}
              </div>
            </div>
          ),

          ul: ({ children }) => (
            <ul
              className={`
                ${theme.cardBg} ${theme.border}
                rounded-2xl p-4 shadow-sm mt-3 mb-4
                backdrop-blur-sm
                border
              `}
            >
              {children}
            </ul>
          ),

          li: ({ children }) => (
            <li className="flex items-start gap-3 mb-2 pl-1 group">
              <Droplet
                className={`
                  w-4 h-4 mt-1 
                  ${theme.iconColor}
                  group-hover:scale-125 
                  transition-transform
                `}
              />
              <span>{children}</span>
            </li>
          ),

          strong: ({ children }) => (
            <strong className={`${theme.iconColor} font-semibold`}>
              {children}
            </strong>
          ),

          blockquote: ({ children }) => (
            <blockquote
              className={`
                border-l-4 pl-4 py-3 mt-4 
                bg-yellow-50 dark:bg-yellow-900/20 
                border-yellow-500 dark:border-yellow-300
                rounded-md shadow-sm text-yellow-800 dark:text-yellow-300
              `}
            >
              <AlertTriangle className="inline w-5 h-5 mr-2" />
              {children}
            </blockquote>
          ),

          // Bonus: Tip callout
          p: ({ children }) => {
            const text = children?.toString() || "";
            if (text.startsWith("TIP:")) {
              return (
                <div
                  className="
                    mt-4 mb-4 p-4 rounded-xl 
                    bg-green-50 dark:bg-green-900/20 
                    border border-green-300 dark:border-green-700 
                    shadow-sm flex items-start gap-3
                  "
                >
                  <Sandwich className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-green-800 dark:text-green-200">
                    {text.replace("TIP:", "").trim()}
                  </span>
                </div>
              );
            }
            return <p>{children}</p>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
