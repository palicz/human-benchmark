import { Button } from "@/components/ui/button";

interface StroopButtonProps {
  onClick: () => void;
  backgroundColor: string;
  textColor: string;
  children: React.ReactNode;
}

export function StroopButton({ onClick, backgroundColor, textColor, children }: StroopButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="w-full h-16 text-xl font-bold transition-colors/60 duration-200 tracking-widest"
      style={{ 
        backgroundColor: backgroundColor, 
        color: textColor,
      }}
      aria-label={`${children} button`}
    >
      {children}
    </Button>
  );
}

