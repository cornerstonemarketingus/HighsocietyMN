export function BlogContent({ content }: { content: string }) {
  const blocks = content.replace(/<[^>]+>/g, "").split(/\n{2,}/).map(block => block.trim()).filter(Boolean);
  return (
    <div className="space-y-6 text-base leading-8 text-zinc-300">
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) return <h2 key={index} className="pt-5 text-2xl font-semibold text-white">{block.slice(3)}</h2>;
        const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
        if (lines.every(line => /^[-*] /.test(line))) {
          return <ul key={index} className="space-y-2 border-l border-[#e5a12b]/40 pl-5">{lines.map(line => <li key={line}>{line.slice(2)}</li>)}</ul>;
        }
        return <p key={index}>{block}</p>;
      })}
    </div>
  );
}
