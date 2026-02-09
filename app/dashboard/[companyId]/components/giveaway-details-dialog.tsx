"use client";

import { Button, Dialog, Text } from "@whop/react/components";
import type { GiveawayWithStats } from "@/lib/data";
import { formatDate, formatDateRange, formatNumber } from "@/lib/data";

interface GiveawayDetailsDialogProps {
	giveaway: GiveawayWithStats;
}

export function GiveawayDetailsDialog({ giveaway }: GiveawayDetailsDialogProps) {
	const remainingWinners = Math.max(giveaway.winner_count - giveaway.winners_count, 0);
	const entriesPerWinner =
		giveaway.winners_count > 0
			? (giveaway.entries_count / giveaway.winners_count).toFixed(1)
			: "-";

	return (
		<Dialog.Root>
			<Dialog.Trigger>
				<Button variant="soft" size="2">Details</Button>
			</Dialog.Trigger>
			<Dialog.Content style={{ maxWidth: 560 }}>
				<Dialog.Title>{giveaway.title}</Dialog.Title>
				<Dialog.Description className="text-gray-10 mb-5">
					Giveaway analytics and campaign details.
				</Dialog.Description>

				<div className="space-y-5">
					<div className="grid grid-cols-2 gap-3">
						<StatCard label="Total Entries" value={formatNumber(giveaway.entries_count)} />
						<StatCard label="Winners Selected" value={`${giveaway.winners_count} / ${giveaway.winner_count}`} />
						<StatCard label="Remaining Winner Slots" value={remainingWinners.toString()} />
						<StatCard label="Entries per Winner" value={entriesPerWinner} />
					</div>

					<div className="rounded-lg border border-gray-a5 p-4 space-y-2 bg-gray-a2">
						<DetailRow label="Status" value={giveaway.status} />
						<DetailRow label="Duration" value={formatDateRange(giveaway.start_date, giveaway.end_date)} />
						<DetailRow label="Created" value={formatDate(giveaway.created_at)} />
						<DetailRow label="Ends" value={formatDate(giveaway.end_date)} />
						<DetailRow label="Prize" value={giveaway.prize_details?.title || "Not set"} />
					</div>

					{giveaway.description && (
						<div className="rounded-lg border border-gray-a5 p-4 bg-gray-a2">
							<Text size="1" className="text-gray-10 uppercase tracking-wide block mb-2">
								Description
							</Text>
							<Text size="2" className="text-gray-12 leading-relaxed block">
								{giveaway.description}
							</Text>
						</div>
					)}
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}

function StatCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-lg border border-gray-a5 p-3 bg-gray-a2">
			<Text size="1" className="text-gray-10 uppercase tracking-wide block">
				{label}
			</Text>
			<Text size="5" weight="semi-bold" className="text-gray-12 mt-1 block">
				{value}
			</Text>
		</div>
	);
}

function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-start justify-between gap-4">
			<Text size="2" className="text-gray-10">
				{label}
			</Text>
			<Text size="2" weight="medium" className="text-gray-12 text-right capitalize">
				{value}
			</Text>
		</div>
	);
}
