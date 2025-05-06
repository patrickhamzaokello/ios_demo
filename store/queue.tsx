import { create } from 'zustand'
import { useShallow } from 'zustand/shallow'

type QueueStore = {
	activeQueueId: string | null
	setActiveQueueId: (id: string) => void
}

export const useQueueStore = create<QueueStore>()((set) => ({
	activeQueueId: null,
	setActiveQueueId: (id) => set({ activeQueueId: id }),
}))

export const useQueue = () => useQueueStore(useShallow((state) => state))
