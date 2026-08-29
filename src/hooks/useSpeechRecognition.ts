import { useState, useEffect, useRef, useCallback } from 'react';
import {
  SpeechRecognitionState,
  SpeechErrorCode,
  getSpeechLanguageCode,
  isSpeechRecognitionSupported,
  createSpeechRecognition,
  parseVoiceQuery,
  ParsedVoiceQuery,
} from '../services/speechRecognitionService';
import { LanguageCode } from '../i18n/config';

interface UseSpeechRecognitionOptions {
  language: LanguageCode;
  onResult?: (parsed: ParsedVoiceQuery) => void;
  onError?: (error: SpeechErrorCode) => void;
}

export interface UseSpeechRecognitionReturn {
  state: SpeechRecognitionState;
  transcript: string;
  interimTranscript: string;
  parsedQuery: ParsedVoiceQuery | null;
  error: SpeechErrorCode | null;
  errorMessage: string | null;
  isSupported: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  reset: () => void;
  setTranscriptManual: (text: string) => void;
}

export const useSpeechRecognition = ({
  language,
  onResult,
  onError,
}: UseSpeechRecognitionOptions): UseSpeechRecognitionReturn => {
  const [state, setState] = useState<SpeechRecognitionState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [parsedQuery, setParsedQuery] = useState<ParsedVoiceQuery | null>(null);
  const [error, setError] = useState<SpeechErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isSupported = isSpeechRecognitionSupported();

  const getHumanErrorMessage = (code: SpeechErrorCode): string => {
    switch (code) {
      case 'not-supported':
        return 'Speech recognition is not supported in this browser. Please use keyboard search.';
      case 'permission-denied':
        return 'Microphone permission was denied. Please enable microphone access in your browser settings.';
      case 'no-speech':
        return 'No speech detected. Please tap the microphone and speak your query again.';
      case 'audio-capture':
        return 'No microphone was found on this device. Please connect a microphone.';
      case 'network':
        return 'Speech service network error. Please check your internet connection.';
      case 'aborted':
        return 'Speech recognition was stopped.';
      default:
        return 'An error occurred during voice recognition. You can type your search instead.';
    }
  };

  // Reset all state
  const reset = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
    }
    setState('idle');
    setTranscript('');
    setInterimTranscript('');
    setParsedQuery(null);
    setError(null);
    setErrorMessage(null);
  }, []);

  // Update transcript manually (when worker edits recognized text)
  const setTranscriptManual = useCallback((text: string) => {
    setTranscript(text);
    const parsed = parseVoiceQuery(text);
    setParsedQuery(parsed);
    setState(text.trim() ? 'recognized' : 'idle');
  }, []);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (state === 'listening' || state === 'requesting_permission') {
      setState(transcript.trim() ? 'recognized' : 'idle');
    }
  }, [state, transcript]);

  // Start speech recognition
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('not-supported');
      setErrorMessage(getHumanErrorMessage('not-supported'));
      setState('error');
      if (onError) onError('not-supported');
      return;
    }

    reset();
    setState('requesting_permission');

    try {
      // 1. Request microphone permission
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          // Stop the test tracks immediately
          stream.getTracks().forEach((track) => track.stop());
        } catch (permErr: any) {
          if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
            setError('permission-denied');
            setErrorMessage(getHumanErrorMessage('permission-denied'));
            setState('error');
            if (onError) onError('permission-denied');
            return;
          }
        }
      }

      // 2. Initialize Speech Recognition instance
      const langCode = getSpeechLanguageCode(language);
      const recognition = createSpeechRecognition(langCode);

      if (!recognition) {
        setError('not-supported');
        setErrorMessage(getHumanErrorMessage('not-supported'));
        setState('error');
        return;
      }

      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setState('listening');
        setError(null);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTrans += res[0].transcript;
          } else {
            interimTrans += res[0].transcript;
          }
        }

        if (interimTrans) {
          setInterimTranscript(interimTrans);
        }

        if (finalTrans) {
          setState('processing');
          setTranscript(finalTrans);
          setInterimTranscript('');

          // Extract intent
          const parsed = parseVoiceQuery(finalTrans);
          setParsedQuery(parsed);
          setState('recognized');

          if (onResult) {
            onResult(parsed);
          }
        }
      };

      recognition.onerror = (event: any) => {
        let errCode: SpeechErrorCode = 'unknown';
        if (event.error === 'not-allowed') errCode = 'permission-denied';
        else if (event.error === 'no-speech') errCode = 'no-speech';
        else if (event.error === 'audio-capture') errCode = 'audio-capture';
        else if (event.error === 'network') errCode = 'network';
        else if (event.error === 'aborted') errCode = 'aborted';

        if (errCode !== 'aborted') {
          setError(errCode);
          setErrorMessage(getHumanErrorMessage(errCode));
          setState('error');
          if (onError) onError(errCode);
        } else {
          setState('idle');
        }
      };

      recognition.onend = () => {
        if (state === 'listening') {
          setState((prevState) => (prevState === 'listening' ? (transcript ? 'recognized' : 'idle') : prevState));
        }
      };

      recognition.start();
    } catch (e: any) {
      setError('unknown');
      setErrorMessage('Could not initialize speech recognition. Please type your search.');
      setState('error');
      if (onError) onError('unknown');
    }
  }, [isSupported, language, onResult, onError, reset, state, transcript]);

  // Clean up on unmount or language switch
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [language]);

  return {
    state,
    transcript,
    interimTranscript,
    parsedQuery,
    error,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    reset,
    setTranscriptManual,
  };
};
