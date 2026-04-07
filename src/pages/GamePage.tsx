import words from "../assets/words.json";
import forest from "/images/forest.jpg";
import quarry from "/images/quarry.jpg";
import lake from "/images/lake.jpg";

function RandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
export default function GamePage() {
  const images = [forest, quarry, lake];
  const [board] = [{ rows: 10, cols: 10 }];
  console.log(words);

  return <div style={{
    display: "grid",
    gridTemplateColumns: `repeat(${board.cols}, 1fr)`,
    gridTemplateRows: `repeat(${board.rows}, 1fr)`
  }} className="m-2 border-4 rounded-2xl p-3 gap-0.5 game">
    {
      Array.from({ length: board.rows * board.cols }).map((_, i) => (
        <div
          key={i}
          style={{ backgroundImage: `url(${images[RandomInt(images.length)]})` }}
          className="
            aspect-square border
            h-fit
            flex items-center justify-center
            hover:bg-amber-700
            bg-cover
          ">
          <p className="text-xs lg:text-sm font-bold text-white bg-stone-700/80 p-1 rounded-tr-2xl rounded-bl-2xl">
            {words[RandomInt(words.length)].toUpperCase()}
          </p>
        </div>
      ))
    }
  </div >;
}