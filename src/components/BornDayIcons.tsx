import React from "react";

// Icons designed strictly in the style of The Noun Project collection in the user's screenshot:
// Bold black contours, clean line art, solid black fills, 4-point star sparkles, confetti bits.

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Birthday Cake with Lit Candle and Sparkles (Matches top row & bottom row of screenshot)
export const IconBirthdayCake: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* 4-point star sparkles */}
    <path
      d="M11 12C11 14 10 15 8 15C10 15 11 16 11 18C11 16 12 15 14 15C12 15 11 14 11 12Z"
      fill="#090909"
    />
    <path
      d="M38 10C38 12.5 36.5 14 34 14C36.5 14 38 15.5 38 18C38 15.5 39.5 14 42 14C39.5 14 38 12.5 38 10Z"
      fill="#090909"
    />
    {/* Candle flame */}
    <path
      d="M24 7C22.5 9 22.5 11 24 13C25.5 11 25.5 9 24 7Z"
      fill="#090909"
    />
    {/* Candle wick & stick */}
    <rect x="22.5" y="13" width="3" height="8" rx="1.5" fill="#090909" />
    {/* Cake top layer */}
    <path
      d="M13 22C13 20.9 13.9 20 15 20H33C34.1 20 35 20.9 35 22V27H13V22Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Decorative icing scallops */}
    <path
      d="M13 27C15 29 17 29 19 27C21 29 23 29 25 27C27 29 29 29 31 27C33 29 35 27 35 27"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Cake base layer */}
    <path
      d="M10 29C10 27.9 10.9 27 12 27H36C37.1 27 38 27.9 38 29V37C38 38.1 37.1 39 36 39H12C10.9 39 10 38.1 10 37V29Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Lower icing / filling band */}
    <rect x="10" y="32" width="28" height="3" fill="#090909" />
    {/* Plate / stand */}
    <line x1="7" y1="41" x2="41" y2="41" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 2. Slice of Birthday Cake on Plate (Matches top-left & right of screenshot)
export const IconCakeSlice: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Sparkle */}
    <path
      d="M14 10C14 12 13 13 11 13C13 13 14 14 14 16C14 14 15 13 17 13C15 13 14 12 14 10Z"
      fill="#090909"
    />
    {/* Candle flame */}
    <path
      d="M23 8C21.8 9.8 21.8 11.5 23 13C24.2 11.5 24.2 9.8 23 8Z"
      fill="#090909"
    />
    <rect x="21.75" y="13" width="2.5" height="6" fill="#090909" />
    {/* Slice wedge */}
    <path
      d="M20 19L38 25L14 36V19L20 19Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Cake layer line */}
    <line x1="14" y1="27" x2="31" y2="28" stroke="#090909" strokeWidth="2.5" />
    <path d="M14 31H34V35H14V31Z" fill="#090909" />
    {/* Plate */}
    <line x1="10" y1="40" x2="40" y2="40" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 3. Party Popper with Confetti Streamers (Matches screenshot popper icons)
export const IconPartyPopper: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Popper Cone */}
    <path
      d="M10 38L24 24L16 16L10 38Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <path d="M12 32L19 25L15 21L11 31" fill="#090909" />
    {/* Exploding confetti streamers */}
    <path
      d="M28 14C30 11 32 11 35 14C38 17 40 16 42 13"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M24 8C27 9 29 7 32 8"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M34 22C37 23 39 21 42 22"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Confetti particles */}
    <rect x="23" y="16" width="3" height="3" transform="rotate(25 23 16)" fill="#090909" />
    <rect x="28" y="26" width="3" height="3" transform="rotate(45 28 26)" fill="#090909" />
    <circle cx="34" cy="11" r="1.75" fill="#090909" />
    <circle cx="21" cy="11" r="1.5" fill="#090909" />
    {/* 4-point star confetti */}
    <path
      d="M36 29C36 30.5 35 31.5 33.5 31.5C35 31.5 36 32.5 36 34C36 32.5 37 31.5 38.5 31.5C37 31.5 36 30.5 36 29Z"
      fill="#090909"
    />
  </svg>
);

// 4. Party Cone Hat with Confetti & Pom-pom (Matches middle screenshot icon)
export const IconPartyHat: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Pom-pom */}
    <circle cx="24" cy="10" r="3.5" stroke="#090909" strokeWidth="2.5" fill="#090909" />
    {/* Hat cone */}
    <path
      d="M24 13L11 39C11 39 18 41 24 41C30 41 37 39 37 39L24 13Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Pattern stripe band */}
    <path
      d="M15 31C18 33 21 33 24 33C27 33 30 33 33 31"
      stroke="#090909"
      strokeWidth="2.5"
    />
    <path
      d="M17 26L21 28"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M27 28L31 26"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Floating confetti bits */}
    <path
      d="M7 23C7 24.5 6 25.5 4.5 25.5C6 25.5 7 26.5 7 28C7 26.5 8 25.5 9.5 25.5C8 25.5 7 24.5 7 23Z"
      fill="#090909"
    />
    <path
      d="M40 21C40 22.5 39 23.5 37.5 23.5C39 23.5 40 24.5 40 26C40 24.5 41 23.5 42.5 23.5C41 23.5 40 22.5 40 21Z"
      fill="#090909"
    />
    <rect x="7" y="32" width="3" height="3" transform="rotate(30 7 32)" fill="#090909" />
    <rect x="39" y="33" width="3" height="3" transform="rotate(45 39 33)" fill="#090909" />
  </svg>
);

// 5. Helium Balloons with Ribbons & Star Decor (Matches top & center screenshot icons)
export const IconBalloons: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Left Balloon */}
    <ellipse cx="16" cy="18" rx="8" ry="10" stroke="#090909" strokeWidth="2.5" />
    <path d="M15 28L17 28L16 30L15 28Z" fill="#090909" />
    <path d="M16 30C16 34 19 36 21 42" stroke="#090909" strokeWidth="1.75" strokeLinecap="round" />

    {/* Right Balloon */}
    <ellipse cx="32" cy="20" rx="7.5" ry="9.5" stroke="#090909" strokeWidth="2.5" />
    <path d="M31 29.5L33 29.5L32 31.5L31 29.5Z" fill="#090909" />
    <path d="M32 31.5C32 35 28 37 25 42" stroke="#090909" strokeWidth="1.75" strokeLinecap="round" />

    {/* Center Balloon (Foreground with star) */}
    <ellipse cx="24" cy="15" rx="9" ry="11" fill="white" stroke="#090909" strokeWidth="2.75" />
    {/* Star on center balloon */}
    <path
      d="M24 10L25.5 13.5L29 14L26.5 16.5L27 20L24 18.5L21 20L21.5 16.5L19 14L22.5 13.5L24 10Z"
      fill="#090909"
    />
    <path d="M22.5 26L25.5 26L24 28L22.5 26Z" fill="#090909" />
    <path d="M24 28V43" stroke="#090909" strokeWidth="2" strokeLinecap="round" />

    {/* Sparkle */}
    <path
      d="M40 9C40 10.5 39 11.5 37.5 11.5C39 11.5 40 12.5 40 14C40 12.5 41 11.5 42.5 11.5C41 11.5 40 10.5 40 9Z"
      fill="#090909"
    />
  </svg>
);

// 6. Calendar with Party Horn / Candle (Matches middle-left & bottom-center in screenshot)
export const IconCalendarParty: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Calendar rings */}
    <line x1="15" y1="9" x2="15" y2="15" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
    <line x1="24" y1="9" x2="24" y2="15" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
    <line x1="33" y1="9" x2="33" y2="15" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
    {/* Calendar page */}
    <rect
      x="9"
      y="13"
      width="30"
      height="26"
      rx="4"
      stroke="#090909"
      strokeWidth="2.75"
    />
    <line x1="9" y1="21" x2="39" y2="21" stroke="#090909" strokeWidth="2.5" />
    {/* Candle on calendar date */}
    <path d="M24 24C23.2 25 23.2 26 24 27C24.8 26 24.8 25 24 24Z" fill="#090909" />
    <rect x="23" y="27" width="2" height="6" fill="#090909" />
    {/* Sparkle */}
    <path
      d="M32 25C32 26.2 31.2 27 30 27C31.2 27 32 27.8 32 29C32 27.8 32.8 27 34 27C32.8 27 32 26.2 32 25Z"
      fill="#090909"
    />
  </svg>
);

// 7. Fireworks Burst (Matches bottom row in screenshot)
export const IconFireworks: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Radiating spokes */}
    <circle cx="24" cy="24" r="2.5" fill="#090909" />
    <path d="M24 13V7" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M24 35V41" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M13 24H7" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M35 24H41" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M16 16L11 11" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M32 32L37 37" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M32 16L37 11" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    <path d="M16 32L11 37" stroke="#090909" strokeWidth="2.75" strokeLinecap="round" />
    {/* Teardrop sparks */}
    <circle cx="24" cy="10" r="1.5" fill="#090909" />
    <circle cx="24" cy="38" r="1.5" fill="#090909" />
    <circle cx="10" cy="24" r="1.5" fill="#090909" />
    <circle cx="38" cy="24" r="1.5" fill="#090909" />
  </svg>
);

// 8. Birthday Greeting Card with Cake & Sparkles (Matches bottom-right in screenshot)
export const IconGreetingCard: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Card outline */}
    <rect x="12" y="9" width="24" height="30" rx="3" stroke="#090909" strokeWidth="2.75" />
    <path d="M12 14H36" stroke="#090909" strokeWidth="1.5" />
    {/* Cake glyph inside card */}
    <path d="M24 19C23.2 20 23.2 21 24 22C24.8 21 24.8 20 24 19Z" fill="#090909" />
    <rect x="23.25" y="22" width="1.5" height="4" fill="#090909" />
    <path d="M18 26H30V31H18V26Z" stroke="#090909" strokeWidth="2" />
    <line x1="16" y1="33" x2="32" y2="33" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
    {/* Sparkles around card */}
    <path
      d="M39 12C39 13.5 38 14.5 36.5 14.5C38 14.5 39 15.5 39 17C39 15.5 40 14.5 41.5 14.5C40 14.5 39 13.5 39 12Z"
      fill="#090909"
    />
    <path
      d="M8 30C8 31.2 7.2 32 6 32C7.2 32 8 32.8 8 34C8 32.8 8.8 32 10 32C8.8 32 8 31.2 8 30Z"
      fill="#090909"
    />
  </svg>
);

// 9. Sherpa Trail Compass / Direction (Custom Noun Project style)
export const IconCompass: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="24" cy="24" r="16" stroke="#090909" strokeWidth="2.75" />
    <circle cx="24" cy="8" r="1.5" fill="#090909" />
    <circle cx="24" cy="40" r="1.5" fill="#090909" />
    <circle cx="8" cy="24" r="1.5" fill="#090909" />
    <circle cx="40" cy="24" r="1.5" fill="#090909" />
    {/* Compass needle */}
    <path d="M24 12L28 24L24 22L20 24L24 12Z" fill="#090909" />
    <path d="M24 36L28 24L24 26L20 24L24 36Z" stroke="#090909" strokeWidth="1.5" fill="white" />
    <circle cx="24" cy="24" r="2" fill="#090909" />
  </svg>
);

// 10. Map Pin with Star (Location)
export const IconMapPin: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M24 7C16.8 7 11 12.8 11 20C11 29.5 24 41 24 41C24 41 37 29.5 37 20C37 12.8 31.2 7 24 7Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="20" r="4.5" fill="#090909" />
  </svg>
);

// 11. Dining / Cutlery with Sparkle (Food & Dining)
export const IconDining: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Fork */}
    <path d="M16 9V18C16 20 18 21 19 21V39" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M13 9V16" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
    <path d="M19 9V16" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
    {/* Knife */}
    <path
      d="M32 9C30 11 29 15 29 21V39"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Sparkle */}
    <path
      d="M24 10C24 11.5 23 12.5 21.5 12.5C23 12.5 24 13.5 24 15C24 13.5 25 12.5 26.5 12.5C25 12.5 24 11.5 24 10Z"
      fill="#090909"
    />
  </svg>
);

// 12. Music Notes with Sparkle (Entertainment)
export const IconMusic: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="15" cy="34" r="5" fill="#090909" />
    <circle cx="33" cy="30" r="5" fill="#090909" />
    <path d="M20 34V14L38 10V30" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
    <path d="M20 18L38 14" stroke="#090909" strokeWidth="3" />
    {/* Sparkle */}
    <path
      d="M10 13C10 14.5 9 15.5 7.5 15.5C9 15.5 10 16.5 10 18C10 16.5 11 15.5 12.5 15.5C11 15.5 10 14.5 10 13Z"
      fill="#090909"
    />
  </svg>
);

// 13. Checklist / Clipboard (Preparation)
export const IconChecklist: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Clipboard base */}
    <rect x="10" y="11" width="28" height="30" rx="3" stroke="#090909" strokeWidth="2.75" />
    {/* Clip at top */}
    <rect x="18" y="7" width="12" height="6" rx="2" fill="#090909" />
    {/* Checkmarks */}
    <path d="M16 21L19 24L25 18" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="28" y1="21" x2="33" y2="21" stroke="#090909" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M16 31L19 34L25 28" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="28" y1="31" x2="33" y2="31" stroke="#090909" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

// 14. Budget / Money Tag with Sparkle (Budget Tiers)
export const IconBudget: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M10 24L24 10H38V24L24 38L10 24Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinejoin="round"
    />
    <circle cx="32" cy="16" r="2.5" fill="#090909" />
    {/* Dollar symbol */}
    <path
      d="M24 19C22.5 19 21.5 19.8 21.5 21C21.5 22.5 23 23 24.5 23.5C26 24 27 24.5 27 26C27 27.5 25.5 28.5 24 28.5M24 17V30.5"
      stroke="#090909"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// 15. Umbrella / Weather Backup (Contingency)
export const IconUmbrella: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    {/* Canopy */}
    <path
      d="M9 25C9 16.7 15.7 10 24 10C32.3 10 39 16.7 39 25C34 23 29 26 24 23C19 26 14 23 9 25Z"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinejoin="round"
      fill="white"
    />
    <line x1="24" y1="7" x2="24" y2="10" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
    {/* Handle */}
    <path
      d="M24 23V35C24 37.5 26 39 28 39C30 39 31.5 37.5 31.5 35"
      stroke="#090909"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Raindrops */}
    <path d="M12 30L10 33" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
    <path d="M37 29L35 32" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 16. Birthday Boy or Birthday Girl Silhouette
export const IconCelebrant: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <circle cx="24" cy="16" r="7" stroke="#090909" strokeWidth="2.75" />
    <path
      d="M12 37C12 30.5 17.5 27 24 27C30.5 27 36 30.5 36 37"
      stroke="#090909"
      strokeWidth="2.75"
      strokeLinecap="round"
    />
    {/* Sparkle */}
    <path
      d="M36 10C36 11.5 35 12.5 33.5 12.5C35 12.5 36 13.5 36 15C36 13.5 37 12.5 38.5 12.5C37 12.5 36 11.5 36 10Z"
      fill="#090909"
    />
  </svg>
);

// 17. Sparkle (The iconic 4-point star in Noun Project icons)
export const IconSparkle: React.FC<IconProps> = ({ className = "w-4 h-4", size }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <path
      d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z"
      fill="#090909"
    />
  </svg>
);

// 18. Summit Flag / Milestone Achievement
export const IconSummitFlag: React.FC<IconProps> = ({ className = "w-6 h-6", size }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <line x1="14" y1="8" x2="14" y2="42" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M14 9H34L28 17L34 25H14V9Z"
      fill="#090909"
      stroke="#090909"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <line x1="9" y1="42" x2="21" y2="42" stroke="#090909" strokeWidth="3" strokeLinecap="round" />
  </svg>
);
