import { Card } from "./visual-card";

export function GameInstructions() {
  return (
    <Card className="p-6 bg-secondary/50">
      <h3 className="font-semibold mb-2">How to Play</h3>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        <li>Watch the pattern of highlighted squares</li>
        <li>Click the squares in the same order they were shown</li>
        <li>Each level adds one more square to remember</li>
        <li>Make a mistake and the game ends</li>
      </ul>
    </Card>
  );
}