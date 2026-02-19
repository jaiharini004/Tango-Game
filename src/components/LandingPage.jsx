import React from 'react';

const LandingPage = ({ onPlay }) => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-cream text-[#0a192f] p-4 text-center">

            {/* Logo Section */}
            <div className="mb-12 animate-[popIn_0.5s_ease-out]">
                <h1 className="text-8xl font-black tracking-[0.2em] mb-2 drop-shadow-sm flex gap-1 justify-center">
                    {/* Alternate text-brand-blue (#316FCF) and text-brand-orange (#F7A028) */}
                    {/* TANGO -> T(Blue) A(Orange) N(Blue) G(Orange) O(Blue) */}
                    <span className="text-[#316FCF]">T</span>
                    <span className="text-[#F7A028]">A</span>
                    <span className="text-[#316FCF]">N</span>
                    <span className="text-[#F7A028]">G</span>
                    <span className="text-[#316FCF]">O</span>
                </h1>
                <p className="text-xl text-gray-500 font-light tracking-widest uppercase">
                    Sun & Moon Puzzle
                </p>
            </div>

            {/* Play Button - Pill Shape */}
            <button
                onClick={onPlay}
                className="group relative px-16 py-6 bg-[#316FCF] text-white text-3xl font-bold rounded-full shadow-2xl hover:scale-110 hover:shadow-blue-500/30 transition-all duration-300 mb-16 tracking-widest"
            >
                PLAY
            </button>

            {/* Simple Footer/Rules Link could go here if removing the big rule block */}

            <footer className="mt-16 text-gray-400 text-xs text-center">
                © {new Date().getFullYear()} Tango Game. Challenge your mind.
            </footer>
        </div>
    );
};

export default LandingPage;
