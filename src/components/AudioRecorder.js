import React, { useState, useRef, useEffect } from 'react';
import { SPEECH_CONFIG, AUDIO_CONFIG, MESSAGES } from '../constants';
import { showNotification } from '../utils/errorHandler';
import './AudioRecorder.css';

function AudioRecorder({ onAudioReady, disabled }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevels, setAudioLevels] = useState(Array(10).fill(0));
    const [transcript, setTranscript] = useState('');
    const [recordingComplete, setRecordingComplete] = useState(false);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);
    const speechRecognitionRef = useRef(null);
    const finalTranscriptRef = useRef('');

    useEffect(() => {
        return () => {
            // 컴포넌트 언마운트 시 모든 리소스 정리
            cleanupResources();
        };
    }, []);

    const cleanupResources = () => {
        if (speechRecognitionRef.current) {
            speechRecognitionRef.current.stop();
            speechRecognitionRef.current = null;
        }
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    const startRecording = async () => {
        try {
            console.log('Starting recording...');

            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) {
                showNotification(MESSAGES.ERRORS.MICROPHONE_NOT_SUPPORTED, 'error');
                return;
            }

            speechRecognitionRef.current = new SpeechRecognition();
            speechRecognitionRef.current.continuous = SPEECH_CONFIG.CONTINUOUS;
            speechRecognitionRef.current.interimResults = SPEECH_CONFIG.INTERIM_RESULTS;
            speechRecognitionRef.current.lang = SPEECH_CONFIG.LANGUAGE;

            console.log(
                'Speech recognition available, requesting microphone...',
            );

            if (!window.isSecureContext) {
                showNotification(MESSAGES.ERRORS.SECURE_CONTEXT_REQUIRED, 'error');
                return;
            }

            let stream;
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: AUDIO_CONFIG.ECHO_CANCELLATION,
                        noiseSuppression: AUDIO_CONFIG.NOISE_SUPPRESSION,
                        autoGainControl: AUDIO_CONFIG.AUTO_GAIN_CONTROL,
                    },
                });
                console.log('Microphone access granted');
            } catch (micError) {
                console.error('Microphone error details:', micError);
                let errorMessage = MESSAGES.ERRORS.MICROPHONE_ACCESS_DENIED + ' ';

                if (micError.name === 'NotAllowedError') {
                    errorMessage += '브라우저에서 마이크 권한을 허용해주세요.';
                } else if (micError.name === 'NotFoundError') {
                    errorMessage += '마이크가 연결되어 있지 않습니다.';
                } else if (micError.name === 'NotReadableError') {
                    errorMessage +=
                        '마이크가 다른 애플리케이션에서 사용 중입니다.';
                } else {
                    errorMessage += `오류: ${micError.message}`;
                }

                showNotification(errorMessage, 'error');
                return;
            }

            streamRef.current = stream;

            try {
                audioContextRef.current = new (window.AudioContext ||
                    window.webkitAudioContext)();

                if (audioContextRef.current.state === 'suspended') {
                    await audioContextRef.current.resume();
                }

                analyserRef.current = audioContextRef.current.createAnalyser();
                const source =
                    audioContextRef.current.createMediaStreamSource(stream);
                source.connect(analyserRef.current);
                analyserRef.current.fftSize = AUDIO_CONFIG.FFT_SIZE;
                console.log('Audio visualization setup complete');
            } catch (audioError) {
                console.error('Audio context error:', audioError);
            }

            speechRecognitionRef.current.onstart = () => {
                console.log('Speech recognition started');
                setTranscript(MESSAGES.LOADING.LISTENING);
            };

            speechRecognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    finalTranscriptRef.current += finalTranscript;
                    setTranscript(finalTranscriptRef.current);
                    setRecordingComplete(true);
                } else {
                    setTranscript(finalTranscriptRef.current + interimTranscript);
                }
            };

            speechRecognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                let errorMessage = '음성 인식 오류: ';

                switch (event.error) {
                    case 'no-speech':
                        errorMessage += '음성이 감지되지 않았습니다.';
                        break;
                    case 'audio-capture':
                        errorMessage += '마이크에 접근할 수 없습니다.';
                        break;
                    case 'not-allowed':
                        errorMessage += '마이크 권한이 거부되었습니다.';
                        break;
                    case 'network':
                        errorMessage += '네트워크 오류가 발생했습니다.';
                        break;
                    default:
                        errorMessage += event.error;
                }

                setTranscript(errorMessage);
                setTimeout(() => stopRecording(), 2000);
            };

            speechRecognitionRef.current.onend = () => {
                console.log('Speech recognition ended');
            };

            setIsRecording(true);
            setTranscript('');
            finalTranscriptRef.current = '';
            setRecordingComplete(false);

            try {
                speechRecognitionRef.current.start();
                console.log('Speech recognition started successfully');
            } catch (speechError) {
                console.error('Speech recognition start error:', speechError);
                throw speechError;
            }

            if (analyserRef.current) {
                visualizeAudio();
            }
        } catch (err) {
            console.error('Overall error in startRecording:', err);
            showNotification(`오류가 발생했습니다: ${err.message}`, 'error');
            stopRecording();
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        setAudioLevels(Array(10).fill(0));
        cleanupResources();
    };

    const handleCompleteAnswer = () => {
        const finalText = finalTranscriptRef.current.trim();
        if (finalText) {
            onAudioReady(finalText);
            
            // 상태 초기화
            setTranscript('');
            setRecordingComplete(false);
            setIsRecording(false);
            finalTranscriptRef.current = '';
            
            // 모든 리소스 정리
            cleanupResources();
        }
    };

    const visualizeAudio = () => {
        if (!analyserRef.current) return;

        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barCount = AUDIO_CONFIG.WAVE_BAR_COUNT;
        const barWidth = dataArray.length / barCount;
        const newLevels = [];

        for (let i = 0; i < barCount; i++) {
            const start = Math.floor(i * barWidth);
            const end = Math.floor((i + 1) * barWidth);
            const slice = dataArray.slice(start, end);
            const average = slice.reduce((a, b) => a + b) / slice.length;
            newLevels.push(average / 255);
        }

        setAudioLevels(newLevels);
        animationRef.current = requestAnimationFrame(visualizeAudio);
    };

    return (
        <div className="audio-recorder">
            <div className="input-options">
                <button
                    className={`record-btn ${isRecording ? 'recording' : ''}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={disabled || recordingComplete}
                >
                    {isRecording ? '음성 인식 중...' : '🎤 말하기'}
                </button>

                {recordingComplete && transcript && transcript.trim() !== '' && (
                    <button
                        className="complete-btn"
                        onClick={handleCompleteAnswer}
                        disabled={disabled}
                    >
                        답변완료
                    </button>
                )}
            </div>

            {isRecording && (
                <div className="recording-info">
                    <div className="waveform">
                        {audioLevels.map((level, index) => (
                            <div
                                key={index}
                                className="wave-bar"
                                style={{
                                    height: `${Math.max(level * 100, 5)}%`,
                                }}
                            />
                        ))}
                    </div>
                    {transcript && (
                        <div className="transcript-preview">{transcript}</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AudioRecorder;