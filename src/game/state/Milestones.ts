export interface Milestone {
    fraction: number;
    kind: 'money' | 'dynamite';
    amount: number;
    label: string;
}

/** Cash rewards never contribute to earnings or advance subsequent milestones. */
export function milestonesFor(target: number, level: number): readonly Milestone[] {
    const first = Math.round(target * 0.1 / 5) * 5;
    const second = Math.round(target * 0.2 / 5) * 5;
    const dynamite = target >= 7000 ? 3 : level >= 16 ? 2 : 1;
    return [
        { fraction: 1.5, kind: 'money', amount: first, label: `+$${first}` },
        { fraction: 1.75, kind: 'money', amount: second, label: `+$${second}` },
        { fraction: 2, kind: 'dynamite', amount: dynamite, label: `+${dynamite} DYNAMITE` }
    ];
}
