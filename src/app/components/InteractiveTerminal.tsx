import { useEffect, useState } from "react";

type CodeTab = {
  name: string;
  lang: string;
  lines: string[];
};

const CODE_TABS: CodeTab[] = [
  {
    name: "sehati_ssm.py",
    lang: "python",
    lines: [
      "# Load Sehati rPPG State-Space Model",
      "from sehati import StateSpaceModel",
      "import vision_edge as ve",
      "",
      "model = StateSpaceModel.load_weights('./rppg_ssm.bin')",
      "model.compile(backend='edge_tinyml')",
      "",
      "stream = ve.VideoStream(source=0) # Webcam",
      "for frame in stream.read_frames():",
      "    hr, confidence = model.predict(frame)",
      "    print(f'HeartRate: {hr} BPM | Conf: {confidence:.2%}')",
      "    # Target Local inference speed: 60 FPS stable",
    ],
  },
  {
    name: "agromind_iot.cpp",
    lang: "cpp",
    lines: [
      "#include <TinyML.h>",
      "#include <HiveMQ_Client.h>",
      "",
      "// ESP32 Irrigation logic",
      "TinyMLRegressor model;",
      "HiveMQClient mqtt;",
      "",
      "void setup() {",
      "  model.loadModel(weights_bin);",
      "  mqtt.connect('broker.hivemq.com');",
      "}",
      "void loop() {",
      "  float hum = readSensor();",
      "  float waterNeed = model.predict(hum);",
      "  mqtt.publish('agro/water', waterNeed);",
      "  delay(500); // 2Hz sample rate",
      "}",
    ],
  },
];

export function InteractiveTerminal() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  const activeTab = CODE_TABS[activeTabIdx];

  // Reset typewriter when tab changes
  useEffect(() => {
    setTypedLines(activeTab.lines.map(() => ""));
    setCurrentLineIdx(0);
    setCharIdx(0);
  }, [activeTabIdx]);

  // Typewriter effect
  useEffect(() => {
    if (currentLineIdx >= activeTab.lines.length) {
      // Loop back after 4 seconds
      const timeout = setTimeout(() => {
        setTypedLines(activeTab.lines.map(() => ""));
        setCurrentLineIdx(0);
        setCharIdx(0);
      }, 4000);
      return () => clearTimeout(timeout);
    }

    const currentTargetLine = activeTab.lines[currentLineIdx];
    
    // Handle blank lines instantly
    if (currentTargetLine === "") {
      setCurrentLineIdx((prev) => prev + 1);
      return;
    }

    const interval = setTimeout(() => {
      setTypedLines((prev) => {
        const next = [...prev];
        next[currentLineIdx] = currentTargetLine.slice(0, charIdx + 1);
        return next;
      });

      if (charIdx + 1 >= currentTargetLine.length) {
        setCurrentLineIdx((prev) => prev + 1);
        setCharIdx(0);
      } else {
        setCharIdx((prev) => prev + 1);
      }
    }, 15); // Adjust typing speed

    return () => clearTimeout(interval);
  }, [charIdx, currentLineIdx, activeTabIdx]);

  return (
    <div className="w-full bg-[#08080b]/90 border border-white/5 rounded-2xl overflow-hidden font-mono text-[9px] sm:text-[10px] text-slate-300 shadow-2xl flex flex-col h-[280px]">
      {/* Window Controls Header */}
      <div className="bg-[#0c0c10] px-4 py-2.5 flex items-center justify-between border-b border-white/5">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        <div className="flex gap-1.5">
          {CODE_TABS.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTabIdx(idx)}
              className={`px-3 py-1 text-[8px] rounded border transition-all cursor-pointer ${
                activeTabIdx === idx
                  ? "bg-white/[0.04] border-white/10 text-cyan-400 font-bold"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <span className="text-[7px] text-slate-600">IDE v1.0</span>
      </div>

      {/* Editor Body */}
      <div className="flex-1 p-4 overflow-y-auto flex gap-3.5 bg-black/40 leading-relaxed scrollbar-none">
        {/* Line numbers */}
        <div className="text-slate-600 select-none text-right flex flex-col pr-1 border-r border-white/5">
          {activeTab.lines.map((_, idx) => (
            <span key={idx}>{idx + 1}</span>
          ))}
        </div>

        {/* Code Content */}
        <div className="flex-1 flex flex-col text-left">
          {typedLines.map((line, idx) => {
            // Apply simple, performant syntax coloring
            let isComment = line.trim().startsWith("#") || line.trim().startsWith("//");
            let isKeyword = line.includes("import ") || line.includes("from ") || line.includes("for ") || line.includes("in ") || line.includes("void ") || line.includes("float ") || line.includes("delay");
            let isString = line.includes("'") || line.includes('"');

            let textColor = "text-slate-300";
            if (isComment) textColor = "text-slate-500 italic";
            else if (isKeyword) textColor = "text-blue-400";
            else if (isString) textColor = "text-emerald-400";

            return (
              <div key={idx} className={`${textColor} min-h-[1.5em] whitespace-pre`}>
                {line}
                {idx === currentLineIdx && charIdx < activeTab.lines[currentLineIdx]?.length && (
                  <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-0.5" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
