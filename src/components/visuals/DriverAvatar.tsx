import React from 'react';

interface DriverAvatarProps {
  shortCode: string;
  number: number;
  teamColor: string;
  size?: number;
}

export const DriverAvatar: React.FC<DriverAvatarProps> = ({
  shortCode,
  number,
  teamColor,
  size = 44,
}) => {
  return (
    <div
      style={{ width: size, height: size, borderColor: teamColor }}
      className="relative shrink-0 rounded-lg bg-[#161B26] border flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div
        style={{ backgroundColor: teamColor }}
        className="w-full h-1.5 absolute top-0 left-0 opacity-90"
      />
      <span className="font-mono-tabular text-[11px] font-bold text-white leading-none mt-1">
        #{number}
      </span>
      <span className="text-[9px] font-semibold tracking-wider text-slate-400 leading-none mt-0.5">
        {shortCode}
      </span>
    </div>
  );
};
