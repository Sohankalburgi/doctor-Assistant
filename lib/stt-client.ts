/**
 * Speech-to-Text Client Utility
 * Handles recording and uploading audio files to the STT API
 */

interface STTResponse {
  success: boolean;
  transcription: string;
  fileName: string;
  fileSize: number;
}

interface STTError {
  error: string;
  details?: string;
}

/**
 * Upload an audio file to the STT API
 * @param file - The audio file to transcribe
 * @returns Promise with transcription result
 */
export async function uploadAudioForTranscription(file: File): Promise<STTResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/stt", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = (await response.json()) as STTError;
      throw new Error(errorData.details || errorData.error || "Upload failed");
    }

    return (await response.json()) as STTResponse;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to upload audio: ${message}`);
  }
}

/**
 * Record audio from microphone and transcribe it
 * @returns Promise with transcription result
 */
export async function recordAndTranscribe(): Promise<STTResponse> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    return new Promise((resolve, reject) => {
      mediaRecorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: "audio/webm" });
          const file = new File([blob], `recording-${Date.now()}.webm`, {
            type: "audio/webm",
          });

          const result = await uploadAudioForTranscription(file);
          resolve(result);

          // Clean up
          stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          reject(error);
        }
      };

      mediaRecorder.onerror = (error) => {
        reject(new Error(`Recording error: ${error.error}`));
      };

      mediaRecorder.start();

      // Stop recording after 30 seconds
      setTimeout(() => {
        mediaRecorder.stop();
      }, 30000);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to record and transcribe: ${message}`);
  }
}

/**
 * Get supported audio formats
 * @returns Array of supported MIME types
 */
export function getSupportedAudioFormats(): string[] {
  return [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/flac",
    "audio/m4a",
    "audio/mp4",
    "audio/webm",
  ];
}
