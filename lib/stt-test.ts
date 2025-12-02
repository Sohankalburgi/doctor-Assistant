/**
 * STT Integration Test
 * Test cases for Speech-to-Text functionality
 */

import { uploadAudioForTranscription, getSupportedAudioFormats } from "@/lib/stt-client";

/**
 * Test: Get supported audio formats
 */
export function testGetSupportedFormats() {
  const formats = getSupportedAudioFormats();
  console.log("Supported formats:", formats);
  
  const expected = [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/flac",
    "audio/m4a",
    "audio/mp4",
    "audio/webm",
  ];
  
  const allSupported = expected.every((format) => formats.includes(format));
  console.log(`✅ All formats supported: ${allSupported}`);
  
  return allSupported;
}

/**
 * Test: Upload audio file (requires actual audio file)
 */
export async function testUploadAudio(file: File) {
  try {
    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
    
    const result = await uploadAudioForTranscription(file);
    
    console.log("✅ Upload successful!");
    console.log("Transcription:", result.transcription);
    console.log("File details:", {
      fileName: result.fileName,
      fileSize: result.fileSize,
    });
    
    return result;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
}

/**
 * Test: Health check
 */
export async function testHealthCheck() {
  try {
    const response = await fetch("/api/stt");
    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ Health check passed!");
      console.log("API Status:", data);
      return true;
    } else {
      console.error("❌ Health check failed:", data);
      return false;
    }
  } catch (error) {
    console.error("❌ Health check error:", error);
    return false;
  }
}

/**
 * Test: Invalid file type
 */
export async function testInvalidFileType() {
  try {
    const invalidFile = new File(["test content"], "test.txt", {
      type: "text/plain",
    });
    
    await uploadAudioForTranscription(invalidFile);
    console.error("❌ Should have thrown error for invalid file type");
    return false;
  } catch (error) {
    console.log("✅ Correctly rejected invalid file type");
    console.log("Error:", error);
    return true;
  }
}

/**
 * Test: File size validation
 */
export async function testFileSizeValidation() {
  try {
    // Create a file larger than 25MB
    const largeBuffer = new ArrayBuffer(26 * 1024 * 1024); // 26MB
    const largeFile = new File([largeBuffer], "large.wav", {
      type: "audio/wav",
    });
    
    await uploadAudioForTranscription(largeFile);
    console.error("❌ Should have thrown error for large file");
    return false;
  } catch (error) {
    console.log("✅ Correctly rejected oversized file");
    console.log("Error:", error);
    return true;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log("🧪 Running STT Integration Tests...\n");
  
  const results = {
    supportedFormats: false,
    healthCheck: false,
    invalidFileType: false,
    fileSizeValidation: false,
  };
  
  try {
    console.log("Test 1: Supported Formats");
    results.supportedFormats = testGetSupportedFormats();
    console.log("---\n");
    
    console.log("Test 2: Health Check");
    results.healthCheck = await testHealthCheck();
    console.log("---\n");
    
    console.log("Test 3: Invalid File Type");
    results.invalidFileType = await testInvalidFileType();
    console.log("---\n");
    
    console.log("Test 4: File Size Validation");
    results.fileSizeValidation = await testFileSizeValidation();
    console.log("---\n");
    
    // Summary
    console.log("📊 Test Summary:");
    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? "✅" : "❌";
      console.log(`${icon} ${test}: ${passed ? "PASSED" : "FAILED"}`);
    });
    
    const allPassed = Object.values(results).every((result) => result);
    console.log(`\n${allPassed ? "✅" : "❌"} Overall: ${allPassed ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
    
    return allPassed;
  } catch (error) {
    console.error("Test suite error:", error);
    return false;
  }
}

/**
 * Example usage in React component
 */
export async function exampleComponentUsage() {
  // This is how you would use it in a React component
  
  // 1. Import
  // import { uploadAudioForTranscription } from "@/lib/stt-client";
  
  // 2. Handle file upload
  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;
  //   
  //   try {
  //     const result = await uploadAudioForTranscription(file);
  //     console.log("Transcription:", result.transcription);
  //     // Update state with transcription
  //   } catch (error) {
  //     console.error("Error:", error);
  //     // Show error message to user
  //   }
  // };
  
  // 3. In JSX
  // <input
  //   type="file"
  //   accept="audio/*"
  //   onChange={handleFileChange}
  // />
  
  console.log("Example usage documented in function comments");
}
