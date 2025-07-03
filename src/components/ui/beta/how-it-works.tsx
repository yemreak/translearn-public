import { cn } from "@/app/lib/utils"
import { TtsResponse } from "@/app/types/ai"
import { MicrophoneIcon, SparklesIcon } from "@/components/icons"
import { useTts } from "@/hooks/ai"
import { useRecorder } from "@/hooks/recorder"
import { useTtsPlayer } from "@/hooks/tts-player"
import { motion } from "framer-motion"
import { useState } from "react"
import { ClickableText } from "../clickable-text"
import { TtsPlayer } from "../tts-player"

type HowItWorksProps = {
	showHowItWorks: boolean
	onClose: () => void
}

export function HowItWorks({ showHowItWorks, onClose }: HowItWorksProps) {
	const [state, setState] = useState<
		"initial" | "recording" | "processing" | "done"
	>("initial")
	const [result, setResult] = useState<{
		tts?: TtsResponse
	}>({})
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [fileDurations, setFileDurations] = useState<{
		[key: string]: number
	}>({})

	const FIXED_TEXT =
		"I can speak English. I love learning new things. This is my voice, my journey. I feel amazing!"

	const recorder = useRecorder()
	const { mutateAsync: tts } = useTts()
	const ttsPlayer = useTtsPlayer(
		result.tts?.audio_base64 && result.tts?.alignment
			? {
					audio_base64: result.tts.audio_base64,
					alignment: result.tts.alignment,
			  }
			: undefined
	)

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = Math.floor(seconds % 60)
		return `${mins}:${secs.toString().padStart(2, "0")}`
	}

	const getAudioDuration = (file: File): Promise<number> => {
		return new Promise(resolve => {
			const audio = new Audio()
			audio.src = URL.createObjectURL(file)
			audio.addEventListener("loadedmetadata", () => {
				URL.revokeObjectURL(audio.src)
				resolve(audio.duration)
			})
		})
	}

	const handleStartRecording = async () => {
		setState("recording")
		await recorder.start()
	}

	const handleStopRecording = async () => {
		const result = await recorder.stop()
		if (!result) throw new Error("Failed to stop recording")

		const recordingFile = new File(
			[result.blob],
			`Kayıt ${new Date().toLocaleTimeString()}.wav`,
			{
				type: result.blob.type,
			}
		)

		const duration = await getAudioDuration(recordingFile)
		setFileDurations(prev => ({ ...prev, [recordingFile.name]: duration }))
		setSelectedFiles(prev => [...prev, recordingFile])
		setState("initial")
	}

	const handleCancelRecording = async () => {
		await recorder.stop()
		setState("initial")
	}

	const handleProcessFiles = async () => {
		setState("processing")

		// Combine all audio files into a single blob
		const audioContext = new AudioContext()
		const audioBuffers = await Promise.all(
			selectedFiles.map(async file => {
				const arrayBuffer = await file.arrayBuffer()
				return audioContext.decodeAudioData(arrayBuffer)
			})
		)

		// Calculate total duration and create a buffer
		const totalDuration = audioBuffers.reduce(
			(acc, buffer) => acc + buffer.duration,
			0
		)
		const combinedBuffer = audioContext.createBuffer(
			1, // mono
			audioContext.sampleRate * totalDuration,
			audioContext.sampleRate
		)

		// Copy each buffer into the combined buffer
		let offset = 0
		audioBuffers.forEach(buffer => {
			const channelData = buffer.getChannelData(0)
			combinedBuffer.copyToChannel(channelData, 0, offset)
			offset += buffer.length
		})

		// Convert combined buffer to blob
		// const combinedBlob = await new Promise<Blob>(resolve => {
		// 	const source = audioContext.createBufferSource()
		// 	source.buffer = combinedBuffer
		// 	const destination = audioContext.createMediaStreamDestination()
		// 	source.connect(destination)
		// 	source.start()

		// 	const mediaRecorder = new MediaRecorder(destination.stream)
		// 	const chunks: BlobPart[] = []

		// 	mediaRecorder.ondataavailable = e => chunks.push(e.data)
		// 	mediaRecorder.onstop = () =>
		// 		resolve(new Blob(chunks, { type: "audio/wav" }))

		// 	mediaRecorder.start()
		// 	setTimeout(() => mediaRecorder.stop(), totalDuration * 1000 + 100)
		// })

		// Create a combined file
		// const combinedFile = new File(
		// 	[combinedBlob],
		// 	`combined_recording_${new Date().toISOString()}.wav`,
		// 	{
		// 		type: "audio/wav",
		// 	}
		// )

		// Send the combined file to TTS
		const ttsResult = await tts({
			text: FIXED_TEXT,
			// voice: {
			// 	speech: combinedFile,
			// 	language: "tr",
			// 	name: new Date().toISOString(),
			// },
		})
		setResult({ tts: ttsResult })
		setSelectedFiles([])
		setState("done")
	}

	const handleRetry = () => {
		setResult({})
		setState("initial")
	}

	if (!showHowItWorks) return null

	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			className="overflow-hidden">
			<div className="p-6 rounded-xl bg-white/5 border border-white/10 space-y-6">
				<div className="flex items-center justify-between">
					<h3 className="text-2xl font-medium text-white flex items-center gap-3">
						<SparklesIcon className="w-6 h-6" />
						Nasıl Çalışıyor?
					</h3>
					<button
						onClick={onClose}
						className="p-2 rounded-lg hover:bg-white/10 transition-colors">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5 text-white/50">
							<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
						</svg>
					</button>
				</div>

				<div className="space-y-6">
					<div
						className={cn(
							"flex items-start gap-4",
							state === "recording" &&
								"bg-gradient-to-r from-blue-500/20 to-transparent p-4 rounded-xl"
						)}>
						<motion.div
							animate={state === "recording" ? { scale: [1, 1.1, 1] } : {}}
							transition={{ repeat: Infinity, duration: 1.5 }}
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
								state === "recording"
									? "bg-gradient-to-r from-blue-500 to-blue-600 ring-2 ring-blue-500/50 ring-offset-2 ring-offset-black/50"
									: "bg-blue-500/20"
							)}>
							<span
								className={cn(
									"font-medium",
									state === "recording" ? "text-white" : "text-blue-400"
								)}>
								1
							</span>
						</motion.div>
						<div className="space-y-1">
							<p
								className={cn(
									"text-lg font-medium",
									state === "recording" ? "text-blue-200" : "text-white"
								)}>
								Düşünceni Paylaş
							</p>
							<p
								className={cn(
									state === "recording" ? "text-blue-100" : "text-white/70"
								)}>
								Aklından geçenleri kendi dilinle anlat
							</p>
						</div>
					</div>
					<div
						className={cn(
							"flex items-start gap-4",
							state === "processing" &&
								"bg-gradient-to-r from-purple-500/20 to-transparent p-4 rounded-xl"
						)}>
						<motion.div
							animate={state === "processing" ? { scale: [1, 1.1, 1] } : {}}
							transition={{ repeat: Infinity, duration: 1.5 }}
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
								state === "processing"
									? "bg-gradient-to-r from-purple-500 to-purple-600 ring-2 ring-purple-500/50 ring-offset-2 ring-offset-black/50"
									: "bg-purple-500/20"
							)}>
							<span
								className={cn(
									"font-medium",
									state === "processing" ? "text-white" : "text-purple-400"
								)}>
								2
							</span>
						</motion.div>
						<div className="space-y-1">
							<p
								className={cn(
									"text-lg font-medium",
									state === "processing" ? "text-purple-200" : "text-white"
								)}>
								İngilizce&apos;ye Dönüşüm
							</p>
							<p
								className={cn(
									state === "processing"
										? "text-purple-100"
										: "text-white/70"
								)}>
								Yapay zeka İngilizce sesini oluşturur
							</p>
						</div>
					</div>
					<div
						className={cn(
							"flex items-start gap-4",
							state === "done" &&
								"bg-gradient-to-r from-yellow-500/20 to-transparent p-4 rounded-xl"
						)}>
						<motion.div
							animate={state === "done" ? { scale: [1, 1.1, 1] } : {}}
							transition={{ repeat: Infinity, duration: 1.5 }}
							className={cn(
								"w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
								state === "done"
									? "bg-gradient-to-r from-yellow-500 to-yellow-600 ring-2 ring-yellow-500/50 ring-offset-2 ring-offset-black/50"
									: "bg-yellow-500/20"
							)}>
							<span
								className={cn(
									"font-medium",
									state === "done" ? "text-white" : "text-yellow-400"
								)}>
								3
							</span>
						</motion.div>
						<div className="space-y-1">
							<p
								className={cn(
									"text-lg font-medium",
									state === "done" ? "text-yellow-200" : "text-white"
								)}>
								Kendi Sesini Dinle
							</p>
							<p
								className={cn(
									state === "done" ? "text-yellow-100" : "text-white/70"
								)}>
								İngilizce düşünceni kendi sesinden dinle
							</p>
						</div>
					</div>
				</div>

				{!recorder.isRecording && state === "initial" && (
					<div className="space-y-4">
						<button
							onClick={handleStartRecording}
							className={cn(
								"w-full flex items-center justify-center gap-3",
								"px-8 py-4 rounded-xl text-lg font-medium",
								"bg-blue-500 hover:bg-blue-600",
								"text-white",
								"transition-colors"
							)}>
							<MicrophoneIcon className="w-6 h-6" />
							<span>Hemen Kayda Başla</span>
						</button>

						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-white/10" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-black px-2 text-white/50">veya</span>
							</div>
						</div>

						<label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
							<div className="flex flex-col items-center justify-center pt-5 pb-6">
								<svg
									className="w-8 h-8 mb-3 text-white/50"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
									/>
								</svg>
								<p className="mb-2 text-sm text-white/70">
									<span>Ses Dosyalarını Yükle</span>
								</p>
								<p className="text-xs text-white/50">
									MP3, WAV veya M4A (Max. 10MB / Dosya)
								</p>
							</div>
							<input
								type="file"
								className="hidden"
								accept="audio/*"
								multiple
								onChange={async e => {
									const files = Array.from(e.target.files || [])
									if (!files.length) return

									for (const file of files) {
										if (file.size > 10 * 1024 * 1024) {
											alert(`${file.name} dosyası 10MB'dan küçük olmalı`)
											return
										}
									}

									const durations: { [key: string]: number } = {}
									for (const file of files) {
										durations[file.name] = await getAudioDuration(file)
									}

									setFileDurations(durations)
									setSelectedFiles(files)
								}}
							/>
						</label>

						{selectedFiles.length > 0 && (
							<div className="space-y-4">
								<div className="p-4 rounded-xl bg-white/5 space-y-2">
									<div className="flex items-center justify-between text-white/70">
										<span>Seçilen Dosyalar</span>
										<div className="flex items-center gap-2">
											<span>{selectedFiles.length} dosya</span>
											<span className="text-white/30">
												(
												{formatTime(
													Object.values(fileDurations).reduce(
														(a, b) => a + b,
														0
													)
												)}
												)
											</span>
										</div>
									</div>
									<div className="space-y-2">
										{selectedFiles.map((file, i) => (
											<div
												key={i}
												className="flex items-center justify-between text-sm group">
												<div className="flex items-center gap-2 flex-1 min-w-0">
													<button
														onClick={() => {
															const newFiles = selectedFiles.filter(
																(_, index) => index !== i
															)
															setSelectedFiles(newFiles)

															const newDurations = {
																...fileDurations,
															}
															delete newDurations[file.name]
															setFileDurations(newDurations)
														}}
														className="p-1 rounded-lg hover:bg-white/10 transition-colors">
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 20 20"
															fill="currentColor"
															className="w-4 h-4 text-white/50">
															<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
														</svg>
													</button>
													<span className="text-white/50 truncate">
														{file.name}
													</span>
												</div>
												<div className="flex items-center gap-3 text-white/30">
													<span>
														{formatTime(fileDurations[file.name] || 0)}
													</span>
													<span>
														{(file.size / 1024 / 1024).toFixed(1)}MB
													</span>
												</div>
											</div>
										))}
									</div>
								</div>

								<div className="flex items-center justify-between gap-3">
									<button
										onClick={handleStartRecording}
										className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:bg-white/20 transition-colors">
										<div className="flex items-center gap-2">
											<MicrophoneIcon className="w-5 h-5" />
											<span>Yeni Kayıt</span>
										</div>
									</button>
									<div className="flex items-center gap-3">
										<button
											onClick={() => {
												setSelectedFiles([])
												setFileDurations({})
											}}
											className="px-6 py-3 rounded-xl text-base font-medium bg-white/10 hover:bg-white/20 transition-colors">
											Vazgeç
										</button>
										<button
											onClick={handleProcessFiles}
											className="px-6 py-3 rounded-xl text-base font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors">
											Başlat
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				{recorder.isRecording && state === "recording" && (
					<div className="space-y-4 text-center">
						<div className="flex items-center justify-center gap-4">
							<button
								onClick={handleCancelRecording}
								className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="w-6 h-6 text-white/70">
									<path
										fillRule="evenodd"
										d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
							<button
								onClick={handleStopRecording}
								className="h-10 px-6 rounded-xl bg-red-500 flex items-center justify-center gap-3 hover:bg-red-600 transition-colors">
								<MicrophoneIcon className="w-6 h-6 text-white" />
								<span className="text-white font-medium">
									Share Your Thoughts
								</span>
							</button>
						</div>
						<div className="space-y-2">
							<p className="text-white/50 text-sm">
								{formatTime(recorder.duration)}
							</p>
						</div>
					</div>
				)}

				{(state === "initial" || state === "recording") && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-4 text-center">
						<p className="text-white/70 text-lg">
							Yavaş ve akıcı bir şekilde konuşarak, düşüncelerini paylaş
						</p>
						<div className="flex items-center justify-center gap-2 text-white/50">
							<SparklesIcon className="w-5 h-5" />
							<p className="text-sm">
								Toplam en az 30 saniye konuşmanı öneriyoruz
							</p>
						</div>
					</motion.div>
				)}

				{recorder.isLoading && state === "processing" && (
					<div className="animate-pulse space-y-4">
						<div className="h-24 bg-white/5 rounded-lg flex items-center justify-center">
							<div className="space-y-2 text-center">
								<p className="text-white/70 text-lg">Ses işleniyor...</p>
								<p className="text-white/50 text-sm">Lütfen bekle</p>
							</div>
						</div>
					</div>
				)}

				{state === "done" && result.tts?.audio_base64 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="space-y-8">
						<div className="space-y-4">
							<div className="space-y-2">
								<ClickableText
									text={FIXED_TEXT}
									segments={[
										{
											start: 0,
											end: FIXED_TEXT.length,
											text: FIXED_TEXT,
										},
									]}
									highlightIndex={
										ttsPlayer.state.currentTime > 0 && result.tts?.alignment
											? Math.floor(
													result.tts.alignment.character_start_times_seconds.findIndex(
														start => start > ttsPlayer.state.currentTime
													)
											  )
											: undefined
									}
									className="text-xl font-medium text-white"
									onClick={({ charIndex }) => {
										if (
											result.tts?.alignment?.character_start_times_seconds
										) {
											ttsPlayer.controls.seek(
												result.tts.alignment.character_start_times_seconds[
													charIndex
												]
											)
											ttsPlayer.controls.play()
										}
									}}
								/>
							</div>

							{result.tts?.audio_base64 && (
								<TtsPlayer
									isPlaying={ttsPlayer.state.isPlaying}
									currentTime={ttsPlayer.state.currentTime}
									duration={ttsPlayer.state.duration}
									speed={ttsPlayer.state.speed}
									onPlayPause={
										ttsPlayer.state.isPlaying
											? ttsPlayer.controls.pause
											: ttsPlayer.controls.play
									}
									onSeek={time => ttsPlayer.controls.seek(time)}
									onSpeedChange={speed =>
										ttsPlayer.controls.setSpeed(speed)
									}
									speeds={[0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2]}
									seekStep={0.7}
								/>
							)}

							<div className="space-y-4 text-center">
								<p className="text-2xl font-medium text-white">
									Senin sesin, senin İngilizce&apos;n
								</p>
								<p className="text-lg text-white/70">
									Bilinçaltın çalışmaya başladı bile
								</p>
							</div>

							<motion.div className="flex items-center justify-center gap-4">
								<motion.button
									onClick={handleRetry}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className="text-white/70 hover:text-white flex items-center gap-2 transition-colors">
									<MicrophoneIcon className="w-5 h-5" />
									<span>Tekrar dene</span>
								</motion.button>
							</motion.div>
						</div>
					</motion.div>
				)}
			</div>
		</motion.div>
	)
}
