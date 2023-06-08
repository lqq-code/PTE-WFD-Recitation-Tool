import "./app.css";
import React, { useEffect, useState } from "react";
import {
  RecordVoiceOverOutlined,
  VoiceOverOff,
  SettingsOutlined,
} from "@mui/icons-material";
import { useSpeechSynthesis } from "react-speech-kit";
import Dialog from "./Dialog";
import { questionData } from "./questionData";
const App = () => {
  const [showSpeechSettings, setShowSpeechSettings] = useState(false);
  const [highlightedText, setHighlightedText] = useState("");
  const [voiceIndex, setVoiceIndex] = useState(null);
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);

  const onEnd = () => {
    setHighlightedText("");
  };

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  const voice = voices[voiceIndex] || null;

  const handleTextSet = () => {
    const text = window.getSelection().toString();
    if (text !== "") setHighlightedText(text);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSet);
    return () => {
      document.removeEventListener("mouseup", handleTextSet);
    };
  }, []);

  useEffect(() => {
    if (supported && speaking && highlightedText === "") {
      speak({ text: document.body.innerText, voice, rate, pitch });
    }
  }, [highlightedText, speak, supported, speaking, voice, rate, pitch]);



  return (
    <div className="app">
      <h1>Write From Dictation</h1>
      <span>
        6月全球预测
      </span>
      
      {supported && (
        <div className="speechMenu">
          {!speaking ? (
            <RecordVoiceOverOutlined
              onClick={() =>
                speak({
                  text: highlightedText || document.body.innerText,
                  voice,
                  rate,
                  pitch,
                })
              }
            />
          ) : (
            <VoiceOverOff onClick={cancel} />
          )}
          <SettingsOutlined onClick={() => setShowSpeechSettings(true)} />
        </div>
      )}
      <p>
        {questionData.map((question) => (
          <React.Fragment key={question.id}>
            <strong>{question.title}:</strong> {question.text}
            <br />
            {question.textEn}
            <br />
          </React.Fragment>
        ))}
      </p>


      <Dialog
        open={showSpeechSettings}
        onClose={() => setShowSpeechSettings(false)}
      >
        <div className="speechSettings">
          <select
            name="voice"
            value={voiceIndex || ""}
            onChange={(e) => {
              setVoiceIndex(e.target.value);
            }}
          >
            {voices.map((option, index) => (
              <option key={option.voiceURI} value={index}>
                {`${option.lang} - ${option.name} ${option.default ? "- Default" : ""
                  }`}
              </option>
            ))}
          </select>
          <div className="rangeContainer">
            <div>
              <label htmlFor="rate">Rate:</label>
              <span>{rate}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={(e) => {
                setRate(e.target.value);
              }}
            />
          </div>
          <div className="rangeContainer">
            <div>
              <label htmlFor="pitch">Pitch:</label>
              <span>{pitch}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={pitch}
              id="pitch"
              onChange={(event) => {
                setPitch(event.target.value);
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default App;
