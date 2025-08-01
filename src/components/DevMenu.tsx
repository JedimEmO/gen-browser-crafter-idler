import type { JSX } from 'solid-js';
import { gameActions } from '../stores/gameStore';

type Props = {
  setOpen: (v: boolean) => void;
};

export default function DevMenu(props: Props): JSX.Element {
  const grantStarter = () => {
    gameActions.addManyToInventory({
      wood: 50,
      stone: 50,
      iron_ore: 30,
      coal: 20,
      sand: 20,
      clay: 15,
      furnace: 1,
      chest: 2,
    });
    props.setOpen(false);
  };
  return (
    <div class="fixed inset-0 z-[10050] flex items-end justify-end p-4">
      <button class="bg-black/40 absolute inset-0" onClick={() => props.setOpen(false)} />
      <div class="relative z-[10060] w-64 rounded-lg bg-white p-4 shadow-xl">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-semibold">Dev Menu</h3>
          <button aria-label="close-dev" class="text-gray-500 hover:text-black" onClick={() => props.setOpen(false)}>×</button>
        </div>
        <div class="flex gap-2">
          <button class="btn btn-primary px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={grantStarter}>
            Grant starter pack
          </button>
          <button class="btn px-3 py-1 rounded border border-gray-300 hover:bg-gray-100" onClick={() => props.setOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
