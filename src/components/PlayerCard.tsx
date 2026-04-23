import Player from "../interfaces/Player";
import { cardBase, labelSmall, playerBorders, playerColors } from "../utils/TailwindStyles";
import { Check, X } from "lucide-react";


export default function PlayerCard({ index, player, isMe, sessionID, showReady }: { index: number; player: Player; isMe: boolean; sessionID?: string; showReady: boolean; }) {
  async function ToggleReady() {
    await fetch(`/api/players?url=${sessionID}&id=${localStorage.getItem("playerID")}`,
      { method: "PUT" }
    );
  }

  return (
    <div
      key={player?.id}
      className={`
              ${cardBase}
              ${isMe ? "border-slate-500" : playerBorders[index % 4]}
              ${isMe ? "shadow-[0_0_15px_rgba(100,116,139,0.15)]" : ""}
              `}
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${playerColors[index % 4]} shrink-0`} />

      <div className="flex flex-col flex-1">
        <span className="text-white font-semibold">{player?.userName}</span>
        <div className="flex gap-2">
          {player?.isHost && <span className={`${labelSmall} text-slate-400`}>Host</span>}
          {isMe && <span className={`${labelSmall} text-emerald-400`}>You</span>}
        </div>
      </div>

      {showReady ?
        (isMe ? (
          <button
            onClick={ToggleReady}
            className={`
                    flex items-center gap-1 text-sm font-semibold
                    px-3 py-1 rounded-lg
                    transition-all hover:scale-105
                    ${player?.ready
                ? "text-emerald-400 hover:bg-emerald-500/10"
                : "text-red-400 hover:bg-red-500/10"
              }
                  `}
          >
            {player?.ready
              ? <><Check className="w-4 h-4" /> Ready</>
              : <><X className="w-4 h-4" /> Not Ready</>
            }
          </button>
        ) : (
          <span className={`flex items-center gap-1 text-sm font-semibold ${player?.ready ? "text-emerald-400" : "text-red-400"}`}>
            {player?.ready
              ? <><Check className="w-4 h-4" /> Ready</>
              : <><X className="w-4 h-4" /> Not Ready</>
            }
          </span>
        )) :
        <div>

        </div>
      }
    </div>
  );
}