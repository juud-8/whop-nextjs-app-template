"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button, Dialog, Text } from "@whop/react/components";
import { toast } from "sonner";
import {
	updateGiveaway,
	type UpdateGiveawayInput,
} from "@/lib/actions/giveaway-actions";
import type { GiveawayWithStats } from "@/lib/data";

interface EditGiveawayDialogProps {
	companyId: string;
	giveaway: GiveawayWithStats;
}

interface FormErrors {
	title?: string;
	prize_title?: string;
	end_date?: string;
	prize_image_url?: string;
}

export function EditGiveawayDialog({ companyId, giveaway }: EditGiveawayDialogProps) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [errors, setErrors] = useState<FormErrors>({});
	const [title, setTitle] = useState(giveaway.title);
	const [description, setDescription] = useState(giveaway.description || "");
	const [prizeTitle, setPrizeTitle] = useState(giveaway.prize_details?.title || "");
	const [prizeImageUrl, setPrizeImageUrl] = useState(giveaway.prize_details?.image_url || "");
	const [endDate, setEndDate] = useState(formatForDateTimeLocal(giveaway.end_date));

	const validateForm = (): boolean => {
		const newErrors: FormErrors = {};

		if (!title.trim()) {
			newErrors.title = "Title is required";
		} else if (title.length > 100) {
			newErrors.title = "Title must be less than 100 characters";
		}

		if (!prizeTitle.trim()) {
			newErrors.prize_title = "Prize title is required";
		}

		if (!endDate) {
			newErrors.end_date = "End date is required";
		} else {
			const selectedDate = new Date(endDate);
			const now = new Date();
			if (selectedDate <= now) {
				newErrors.end_date = "End date must be in the future";
			}
		}

		if (prizeImageUrl && !isValidUrl(prizeImageUrl)) {
			newErrors.prize_image_url = "Must be a valid URL";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const isValidUrl = (url: string) => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		startTransition(async () => {
			const input: UpdateGiveawayInput = {
				title: title.trim(),
				description: description.trim() || undefined,
				prize_title: prizeTitle.trim(),
				prize_image_url: prizeImageUrl.trim() || undefined,
				end_date: endDate,
			};

			const result = await updateGiveaway(giveaway.id, companyId, input);

			if (!result.success) {
				toast.error(result.error || "Failed to update giveaway");
				return;
			}

			toast.success("Giveaway updated", {
				description: "Your giveaway changes are now live.",
			});
			setOpen(false);
			router.refresh();
		});
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger>
				<Button variant="soft" size="2">Edit</Button>
			</Dialog.Trigger>
			<Dialog.Content style={{ maxWidth: 520 }}>
				<Dialog.Title>Edit Giveaway</Dialog.Title>
				<Dialog.Description className="text-gray-10 mb-6">
					Update your giveaway details and keep your campaign fresh.
				</Dialog.Description>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<label htmlFor={`title-${giveaway.id}`} className="text-sm font-medium text-gray-12">
							Title <span className="text-red-9">*</span>
						</label>
						<input id={`title-${giveaway.id}`} type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg bg-gray-a3 border ${errors.title ? "border-red-9" : "border-gray-a6"} text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9`} />
						{errors.title && <Text size="1" className="text-red-9">{errors.title}</Text>}
					</div>

					<div className="space-y-2">
						<label htmlFor={`desc-${giveaway.id}`} className="text-sm font-medium text-gray-12">Description</label>
						<textarea id={`desc-${giveaway.id}`} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 rounded-lg bg-gray-a3 border border-gray-a6 text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9 resize-none" />
					</div>

					<div className="space-y-2">
						<label htmlFor={`prize-${giveaway.id}`} className="text-sm font-medium text-gray-12">
							Prize Title <span className="text-red-9">*</span>
						</label>
						<input id={`prize-${giveaway.id}`} type="text" value={prizeTitle} onChange={(e) => setPrizeTitle(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg bg-gray-a3 border ${errors.prize_title ? "border-red-9" : "border-gray-a6"} text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9`} />
						{errors.prize_title && <Text size="1" className="text-red-9">{errors.prize_title}</Text>}
					</div>

					<div className="space-y-2">
						<label htmlFor={`img-${giveaway.id}`} className="text-sm font-medium text-gray-12">Prize Image URL</label>
						<input id={`img-${giveaway.id}`} type="url" value={prizeImageUrl} onChange={(e) => setPrizeImageUrl(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg bg-gray-a3 border ${errors.prize_image_url ? "border-red-9" : "border-gray-a6"} text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9`} />
						{errors.prize_image_url && <Text size="1" className="text-red-9">{errors.prize_image_url}</Text>}
					</div>

					<div className="space-y-2">
						<label htmlFor={`end-${giveaway.id}`} className="text-sm font-medium text-gray-12">
							End Date <span className="text-red-9">*</span>
						</label>
						<input id={`end-${giveaway.id}`} type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={`w-full px-4 py-2.5 rounded-lg bg-gray-a3 border ${errors.end_date ? "border-red-9" : "border-gray-a6"} text-gray-12 focus:outline-none focus:ring-2 focus:ring-blue-9`} />
						{errors.end_date && <Text size="1" className="text-red-9">{errors.end_date}</Text>}
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<Dialog.Close>
							<Button variant="soft" type="button">Cancel</Button>
						</Dialog.Close>
						<Button variant="classic" type="submit" disabled={isPending}>
							{isPending ? "Saving..." : "Save changes"}
						</Button>
					</div>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	);
}

function formatForDateTimeLocal(date: string): string {
	const parsed = new Date(date);
	if (Number.isNaN(parsed.getTime())) {
		return "";
	}

	const local = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
	return local.toISOString().slice(0, 16);
}
