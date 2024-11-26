import { motion } from "framer-motion";

interface ExplosionProps {
    position: { x: number; y: number };
    onComplete: () => void;
}

const Explosion: React.FC<ExplosionProps> = ({ position, onComplete }) => {
    return (
        <motion.div
            className="absolute rounded-full bg-yellow-500 opacity-75"
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                width: '75px',
                height: '75px',
                borderRadius: '50%',
                pointerEvents: 'none',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1, opacity: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={onComplete}
        />
    );
};

export default Explosion;