export type LayoutKind = 'goldPocket' | 'ratTunnels' | 'explosiveCavern' | 'deepMine';
export const LAYOUTS = {
    goldPocket: { name: 'Gold Pocket', hint: 'Gold clusters behind a shelf of rocks.' },
    ratTunnels: { name: 'Rat Tunnels', hint: 'Watch the rats crossing the shallow tunnels.' },
    explosiveCavern: { name: 'Explosive Cavern', hint: 'TNT sits close to the richest deposits. Aim carefully!' },
    deepMine: { name: 'Deep Mine', hint: 'The best rewards lie at the bottom of the shaft.' }
};
export const LAYOUT_ORDER: readonly LayoutKind[] = ['goldPocket', 'explosiveCavern', 'ratTunnels', 'deepMine'];
export const RAT_LANE_Y = 520;
