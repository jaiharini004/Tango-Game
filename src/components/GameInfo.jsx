import React from 'react';

const GameInfo = ({ isGameWon, progress = { rows: 0, cols: 0 } }) => {
    return (
        <div className="hidden lg:flex flex-col gap-6 w-64 p-6 bg-white border border-gray-200 rounded-xl shadow-sm h-fit">
            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Rules</h3>
                <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                    <li>Get 3 Suns & 3 Moons in each row/column.</li>
                    <li>No more than 2 of the same symbol adjacent.</li>
                    <li>Cells separated by <strong>=</strong> must be equal.</li>
                    <li>Cells separated by <strong>x</strong> must be opposite.</li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Progress</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Rows Balanced</span>
                            <span className="font-mono font-bold text-gray-900">{progress.rows}/6</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-sun h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(progress.rows / 6) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Cols Balanced</span>
                            <span className="font-mono font-bold text-gray-900">{progress.cols}/6</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-moon h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(progress.cols / 6) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameInfo;
