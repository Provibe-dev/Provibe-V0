"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Square, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"

interface AudioRecorderProps {
  onTranscription: (text: string) => void
}

export function AudioRecorder({ onTranscription }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        transcribeAudio(audioBlob)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use this feature.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true)
    try {
      // In a real app, this would be an API call to a transcription service
      // For demo purposes, we'll simulate a transcription after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulated transcription result
      const transcriptionText =
        "This is a simulated transcription of the recorded audio. In a real application, this would be the actual transcribed text from your speech."

      onTranscription(transcriptionText)

      toast({
        title: "Audio transcribed",
        description: "Your speech has been converted to text.",
      })
    } catch (error) {
      console.error("Error transcribing audio:", error)
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsTranscribing(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="rounded-md border p-4 bg-muted/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isRecording ? "bg-red-500 animate-pulse" : "bg-slate-400"}`} />
          <span className="text-sm font-medium">
            {isRecording ? `Recording: ${formatTime(recordingTime)}` : "Ready to record"}
          </span>
        </div>
        <div>
          {isRecording ? (
            <Button type="button" size="sm" variant="destructive" onClick={stopRecording} disabled={isTranscribing}>
              <Square className="h-4 w-4 mr-1" /> Stop
            </Button>
          ) : (
            <Button type="button" size="sm" variant="default" onClick={startRecording} disabled={isTranscribing}>
              <Mic className="h-4 w-4 mr-1" /> Start
            </Button>
          )}
        </div>
      </div>

      {isTranscribing && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Transcribing audio...</span>
          </div>
          <Progress value={45} className="h-2" />
        </div>
      )}
    </div>
  )
}
