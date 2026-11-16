export interface SkillGroup {
  
  id: string;
  title: string;
  emoji: string;
  accentColor: string; // e.g. "orange", "cyan", "lime", "pink"
  skills: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "software",
    title: "Software Engineering",
    emoji: "💻",
    accentColor: "cyan",
    skills: ["TypeScript / JavaScript", "Python", "Go", "React / Next.js", "Node.js / REST APIs", "PostgreSQL / Redis"]
  },
  {
    id: "embedded",
    title: "Embedded Systems",
    emoji: "🔌",
    accentColor: "orange",
    skills: ["C / C++", "Arduino / ESP32 / STM32", "Raspberry Pi", "FreeRTOS", "I2C / SPI / UART / CAN", "Firmware Development"]
  },
  {
    id: "hardware",
    title: "Hardware & PCB Design",
    emoji: "🔧",
    accentColor: "lime",
    skills: ["KiCad (Schematic + Layout)", "PCB Prototyping", "Signal Integrity", "Power Electronics", "Sensor Integration", "JTAG / SWD Debugging"]
  },
  {
    id: "devops",
    title: "DevOps & Tools",
    emoji: "☁️",
    accentColor: "pink",
    skills: ["Docker / Linux", "Git / CI-CD", "MQTT / WebSockets", "Wireshark / Logic Analyzers", "VS Code / PlatformIO", "Oscilloscope / Multimeter"]
  }
];
