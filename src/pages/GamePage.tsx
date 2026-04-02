import words from "../assets/words.json";
export default function GamePage() {

  const [board] = [{ rows: 10, cols: 10 }];
  console.log(words);

  return <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${board.cols}, 1fr)`,
    gridTemplateRows: `repeat(${board.rows}, 1fr)`
  }} className="m-2 border-4 rounded-2xl p-3 game">
    {
      Array.from({ length: board.rows * board.cols }).map((_, i) => (
        <div
          key={i}
          className="
          aspect-square border
          h-fit
          flex items-center justify-center
          hover:bg-amber-700
          text-xs
          ">
          {words[i]}
        </div>
      ))
    }
  </div >;
}