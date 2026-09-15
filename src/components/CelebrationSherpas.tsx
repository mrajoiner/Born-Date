import React from "react";

interface CharacterProps {
  signText?: string;
  className?: string;
  size?: number; // height in px, default 220
  flipped?: boolean;
}

/**
 * Miles (Guy):
 * - Detailed expressive face: short stylish wavy hair, warm eyes with smile lines, cheerful grin, small angled party hat.
 * - Stick figure limbs: only stick arms and stick legs (no torso shading/clothing).
 * - Stick hands holding a prominent wooden signboard with custom 1-2 word text.
 */
export const MilesFigure: React.FC<CharacterProps> = ({
  signText = "STEP 1",
  className = "",
  size = 220,
  flipped = false,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 200 240"
        width={size * 0.83}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible filter drop-shadow-xs"
      >
        {/* --- MILES DETAILED HEAD --- */}
        {/* Party Hat */}
        <g id="miles-hat">
          <path
            d="M 94 48 L 108 12 L 122 46 Z"
            fill="#FFE600"
            stroke="#090909"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Hat stripes */}
          <path d="M 99 35 L 117 34" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 103 23 L 113 22" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
          {/* Pom pom at tip */}
          <circle cx="108" cy="10" r="4.5" fill="#090909" />
        </g>

        {/* Hair - back curls */}
        <path
          d="M 68 76 C 62 60 75 42 92 40 C 112 38 132 44 136 62 C 140 78 136 94 135 98"
          fill="#090909"
        />

        {/* Head outline */}
        <ellipse
          cx="102"
          cy="74"
          rx="32"
          ry="34"
          fill="#FCF7E5"
          stroke="#090909"
          strokeWidth="3.5"
        />

        {/* Front stylish textured hair / curls */}
        <path
          d="M 72 65 C 75 50 88 44 100 44 C 116 44 130 52 133 66 C 126 62 118 64 112 60 C 104 56 94 62 88 60 C 80 60 76 64 72 65 Z"
          fill="#090909"
        />
        <path
          d="M 70 70 C 66 64 68 56 74 54 C 77 60 76 66 70 70 Z"
          fill="#090909"
        />

        {/* Ears */}
        <path
          d="M 70 76 C 67 73 66 82 70 85"
          stroke="#090909"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 134 76 C 137 73 138 82 134 85"
          stroke="#090909"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Eyebrows */}
        <path
          d="M 83 66 Q 90 62 96 66"
          stroke="#090909"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 108 66 Q 114 62 121 66"
          stroke="#090909"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Eyes (detailed with highlight) */}
        <g id="miles-eyes">
          {/* Left eye */}
          <ellipse cx="89" cy="74" rx="4.5" ry="5.5" fill="#090909" />
          <circle cx="90.5" cy="72.5" r="1.8" fill="#FFFFFF" />
          {/* Right eye */}
          <ellipse cx="115" cy="74" rx="4.5" ry="5.5" fill="#090909" />
          <circle cx="116.5" cy="72.5" r="1.8" fill="#FFFFFF" />

          {/* Cheerful smile lines / crow's feet */}
          <path d="M 79 73 Q 81 75 79 77" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
          <path d="M 125 73 Q 123 75 125 77" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Nose */}
        <path
          d="M 102 74 Q 104 81 100 83"
          stroke="#090909"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Big genuine smile with rosy cheek lines */}
        <path
          d="M 87 88 Q 102 102 117 88"
          stroke="#090909"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Dimple accents */}
        <path d="M 84 87 L 85 91" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
        <path d="M 120 87 L 119 91" stroke="#090909" strokeWidth="2" strokeLinecap="round" />
        {/* Light stubble dots for guy character */}
        <circle cx="98" cy="98" r="1" fill="#090909" />
        <circle cx="102" cy="100" r="1" fill="#090909" />
        <circle cx="106" cy="98" r="1" fill="#090909" />

        {/* --- STICK FIGURE LIMBS ONLY (Face -> Arms & Legs) --- */}
        {/* Central stick neck connection */}
        <path d="M 102 108 L 102 145" stroke="#090909" strokeWidth="4" strokeLinecap="round" />

        {/* Stick Legs */}
        <g id="miles-legs">
          {/* Left leg */}
          <path d="M 102 145 L 86 210" stroke="#090909" strokeWidth="4" strokeLinecap="round" />
          {/* Left shoe */}
          <path
            d="M 86 210 L 74 214 C 71 215 72 220 76 220 L 92 220 C 94 220 94 216 90 213 Z"
            fill="#090909"
          />

          {/* Right leg */}
          <path d="M 102 145 L 118 210" stroke="#090909" strokeWidth="4" strokeLinecap="round" />
          {/* Right shoe */}
          <path
            d="M 118 210 L 130 214 C 133 215 132 220 128 220 L 112 220 C 110 220 110 216 114 213 Z"
            fill="#090909"
          />
        </g>

        {/* Signboard Post & Sign held in front */}
        <g id="miles-sign">
          {/* Wooden pole */}
          <path d="M 102 110 L 102 165" stroke="#090909" strokeWidth="4" strokeLinecap="round" />

          {/* The Sign Plaque */}
          <rect
            x="32"
            y="114"
            width="136"
            height="46"
            rx="8"
            fill="#FFFFFF"
            stroke="#090909"
            strokeWidth="3.5"
          />
          {/* Sign board inner accent border */}
          <rect
            x="36"
            y="118"
            width="128"
            height="38"
            rx="5"
            fill="#FFE600"
            stroke="#090909"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Corner nail dots */}
          <circle cx="41" cy="123" r="1.5" fill="#090909" />
          <circle cx="159" cy="123" r="1.5" fill="#090909" />
          <circle cx="41" cy="151" r="1.5" fill="#090909" />
          <circle cx="159" cy="151" r="1.5" fill="#090909" />

          {/* Text on Sign (crisp typography) */}
          <text
            x="100"
            y="142"
            textAnchor="middle"
            fill="#090909"
            fontSize="15"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.08em"
          >
            {signText.toUpperCase()}
          </text>
        </g>

        {/* Stick Arms holding the sign board */}
        <g id="miles-arms">
          {/* Left stick arm reaching out to hold left of sign */}
          <path
            d="M 102 115 L 45 125 L 34 135"
            stroke="#090909"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left hand fingers wrapping edge */}
          <path d="M 30 133 C 28 138 36 142 36 135" stroke="#090909" strokeWidth="3" fill="#FCF7E5" />

          {/* Right stick arm reaching out to hold right of sign */}
          <path
            d="M 102 115 L 155 125 L 166 135"
            stroke="#090909"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right hand fingers wrapping edge */}
          <path d="M 170 133 C 172 138 164 142 164 135" stroke="#090909" strokeWidth="3" fill="#FCF7E5" />
        </g>
      </svg>
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#090909] mt-0.5">
        Miles
      </span>
    </div>
  );
};

/**
 * Arlo (Girl):
 * - Detailed expressive face: chic bob with bangs, long eyelashes, bright open-mouth smile, cute hair-bow or star clip.
 * - Stick figure limbs: stick arms and stick legs only.
 * - Stick hands holding a prominent celebration sign with 1-2 words.
 */
export const ArloFigure: React.FC<CharacterProps> = ({
  signText = "START",
  className = "",
  size = 220,
  flipped = false,
}) => {
  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      style={{ transform: flipped ? "scaleX(-1)" : undefined }}
    >
      <svg
        viewBox="0 0 200 240"
        width={size * 0.83}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible filter drop-shadow-xs"
      >
        {/* --- ARLO DETAILED HEAD --- */}
        {/* Hair Bow / Celebration clip */}
        <g id="arlo-clip">
          <path
            d="M 120 38 L 132 30 L 126 42 Z"
            fill="#FFE600"
            stroke="#090909"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle cx="120" cy="38" r="3.5" fill="#090909" />
          {/* Party sparkle stars above hair */}
          <path d="M 72 25 L 75 33 L 83 36 L 75 39 L 72 47 L 69 39 L 61 36 L 69 33 Z" fill="#FFE600" stroke="#090909" strokeWidth="1.5" />
        </g>

        {/* Back of Bob hair */}
        <path
          d="M 64 72 C 58 54 70 38 98 38 C 126 38 138 52 138 72 C 142 92 138 104 132 108 C 128 102 126 98 126 92 C 126 60 74 60 74 92 C 74 98 72 102 68 108 C 62 104 58 90 64 72 Z"
          fill="#090909"
        />

        {/* Face oval */}
        <ellipse
          cx="100"
          cy="74"
          rx="30"
          ry="32"
          fill="#FCF7E5"
          stroke="#090909"
          strokeWidth="3.5"
        />

        {/* Front Bob Hair with soft fringe/bangs */}
        <path
          d="M 70 65 C 72 48 85 42 100 42 C 116 42 128 48 130 65 C 124 58 116 54 104 56 C 96 58 88 54 80 58 C 76 60 72 63 70 65 Z"
          fill="#090909"
        />
        {/* Side swept strands */}
        <path d="M 68 66 C 68 84 72 96 74 100" stroke="#090909" strokeWidth="4" strokeLinecap="round" />
        <path d="M 132 66 C 132 84 128 96 126 100" stroke="#090909" strokeWidth="4" strokeLinecap="round" />

        {/* Eyebrows */}
        <path
          d="M 82 65 Q 89 60 95 65"
          stroke="#090909"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 106 65 Q 112 60 119 65"
          stroke="#090909"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Eyes (big, detailed with eyelashes) */}
        <g id="arlo-eyes">
          {/* Left eye */}
          <ellipse cx="88" cy="73" rx="4.5" ry="5.5" fill="#090909" />
          <circle cx="89.5" cy="71.5" r="1.8" fill="#FFFFFF" />
          {/* Left lashes */}
          <path d="M 84 68 L 81 65" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 88 66 L 88 62" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />

          {/* Right eye */}
          <ellipse cx="113" cy="73" rx="4.5" ry="5.5" fill="#090909" />
          <circle cx="114.5" cy="71.5" r="1.8" fill="#FFFFFF" />
          {/* Right lashes */}
          <path d="M 117 68 L 120 65" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 113 66 L 113 62" stroke="#090909" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Small cute button nose */}
        <path
          d="M 100 75 Q 102 79 99 80"
          stroke="#090909"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Beaming celebratory smile with teeth & blush marks */}
        <path
          d="M 86 86 Q 100 102 115 86 Z"
          fill="#FFFFFF"
          stroke="#090909"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M 91 87 Q 100 95 110 87" stroke="#090909" strokeWidth="2" fill="#FFE600" />

        {/* Rosy blush lines */}
        <path d="M 76 81 L 80 84" stroke="#090909" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 79 80 L 83 83" stroke="#090909" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 120 81 L 124 84" stroke="#090909" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M 123 80 L 127 83" stroke="#090909" strokeWidth="1.5" strokeLinecap="round" />

        {/* --- STICK FIGURE LIMBS ONLY --- */}
        {/* Stick neck connecting head to hips */}
        <path d="M 100 106 L 100 145" stroke="#090909" strokeWidth="4" strokeLinecap="round" />

        {/* Stick Legs */}
        <g id="arlo-legs">
          {/* Left leg (slight dynamic angle) */}
          <path d="M 100 145 L 82 210" stroke="#090909" strokeWidth="4" strokeLinecap="round" />
          {/* Left shoe */}
          <path
            d="M 82 210 L 68 214 C 65 215 66 220 70 220 L 86 220 C 89 220 89 216 85 213 Z"
            fill="#090909"
          />

          {/* Right leg */}
          <path d="M 100 145 L 118 210" stroke="#090909" strokeWidth="4" strokeLinecap="round" />
          {/* Right shoe */}
          <path
            d="M 118 210 L 132 214 C 135 215 134 220 130 220 L 114 220 C 111 220 111 216 115 213 Z"
            fill="#090909"
          />
        </g>

        {/* Signboard Post & Sign */}
        <g id="arlo-sign">
          {/* Center pole */}
          <path d="M 100 110 L 100 165" stroke="#090909" strokeWidth="4" strokeLinecap="round" />

          {/* The Sign Plaque */}
          <rect
            x="32"
            y="114"
            width="136"
            height="46"
            rx="8"
            fill="#FFFFFF"
            stroke="#090909"
            strokeWidth="3.5"
          />
          {/* Sign board inner accent border */}
          <rect
            x="36"
            y="118"
            width="128"
            height="38"
            rx="5"
            fill="#FFE600"
            stroke="#090909"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />
          {/* Corner rivets */}
          <circle cx="41" cy="123" r="1.5" fill="#090909" />
          <circle cx="159" cy="123" r="1.5" fill="#090909" />
          <circle cx="41" cy="151" r="1.5" fill="#090909" />
          <circle cx="159" cy="151" r="1.5" fill="#090909" />

          {/* Text on Sign */}
          <text
            x="100"
            y="142"
            textAnchor="middle"
            fill="#090909"
            fontSize="15"
            fontWeight="900"
            fontFamily="system-ui, -apple-system, sans-serif"
            letterSpacing="0.08em"
          >
            {signText.toUpperCase()}
          </text>
        </g>

        {/* Stick Arms holding sign */}
        <g id="arlo-arms">
          {/* Left stick arm */}
          <path
            d="M 100 115 L 45 125 L 34 135"
            stroke="#090909"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 30 133 C 28 138 36 142 36 135" stroke="#090909" strokeWidth="3" fill="#FCF7E5" />

          {/* Right stick arm */}
          <path
            d="M 100 115 L 155 125 L 166 135"
            stroke="#090909"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M 170 133 C 172 138 164 142 164 135" stroke="#090909" strokeWidth="3" fill="#FCF7E5" />
        </g>
      </svg>
      <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#090909] mt-0.5">
        Arlo
      </span>
    </div>
  );
};

/**
 * First Screen Duo: Miles and Arlo side-by-side!
 * Big, frameless, holding their signs.
 */
export const DuoGuide: React.FC<{
  speechText?: string;
  className?: string;
}> = ({
  speechText = "Yo, we are throwing out the rulebook and building a birthday that you will never, ever forget.",
  className = "",
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center my-2 select-none ${className}`}
    >
      {/* Both characters stand together freely - NO BOX, NO FRAME! */}
      <div className="flex items-end justify-center gap-6 sm:gap-12 pb-2">
        <MilesFigure signText="STEP 1" size={230} />
        <ArloFigure signText="START" size={230} />
      </div>

      {/* Shared conversational line below them (unboxed speech banner) */}
      {speechText && (
        <div className="max-w-xl text-center px-4 mt-2">
          <p className="text-sm font-semibold text-[#090909] bg-white/80 border border-[#090909] px-4 py-2 rounded-full shadow-2xs inline-block">
            {speechText}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Solo Guide with Character & Speech
 * Can be Miles or Arlo, frameless and much bigger!
 */
export const SoloGuide: React.FC<{
  character: "miles" | "arlo";
  signText: string;
  speechText: string;
  title?: string;
  className?: string;
}> = ({ character, signText, speechText, title, className = "" }) => {
  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center sm:items-center justify-center gap-6 my-2 ${className}`}
    >
      {/* Big character drawing - NO BOX OR FRAME */}
      <div className="flex-shrink-0">
        {character === "miles" ? (
          <MilesFigure signText={signText} size={220} />
        ) : (
          <ArloFigure signText={signText} size={220} />
        )}
      </div>

      {/* Natural speech bubble without confining the character */}
      <div className="max-w-lg bg-white border-2 border-[#090909] rounded-3xl p-5 shadow-xs relative">
        <div className="hidden sm:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-[#090909] -rotate-45" />
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FFE600] px-2 py-0.5 rounded-full border border-[#090909]">
            {character === "miles" ? "Miles" : "Arlo"} • Birthday Guide
          </span>
          {title && (
            <span className="text-xs font-bold text-[#090909]">
              {title}
            </span>
          )}
        </div>
        <p className="text-sm text-[#090909] leading-relaxed">
          {speechText}
        </p>
      </div>
    </div>
  );
};
