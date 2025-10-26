interface SpeechBubbleProps {
  text: string;
}

export default function SpeechBubble({ text }: SpeechBubbleProps) {
  return (
    <div className="relative bg-white border-4 border-black rounded-3xl px-8 py-6 max-w-2xl mx-auto text-center mb-8 speech-bubble">
      <p className="text-lg md:text-xl">{text}</p>
    </div>
  );
}
