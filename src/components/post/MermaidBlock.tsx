"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

interface MermaidBlockProps {
  code: string;
}

/**
 * Strip mermaid's auto-injected max-width and ensure the SVG fills
 * the container. We also remove the explicit width/height attributes
 * so the SVG scales to viewBox aspect ratio.
 */
function fitSvg(svg: string) {
  return svg
    // Drop inline max-width style mermaid injects
    .replace(/style="[^"]*max-width:[^;"]*;?[^"]*"/i, (m) =>
      m.replace(/max-width:[^;"]*;?/i, "").replace(/style="\s*"/, "")
    )
    // Remove explicit width attribute on the root svg
    .replace(/<svg([^>]*?)\swidth="[^"]*"/i, "<svg$1")
    // Remove explicit height attribute on the root svg
    .replace(/<svg([^>]*?)\sheight="[^"]*"/i, "<svg$1")
    // Inject width/height/styles
    .replace(
      /<svg([^>]*)>/i,
      '<svg$1 width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="display:block;width:100%;height:auto;max-width:100%;">'
    );
}

export function MermaidBlock({ code }: MermaidBlockProps) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        const isDark = resolvedTheme === "dark";
        mermaid.initialize({
          startOnLoad: false,
          theme: "base",
          fontFamily: "var(--font-body), Georgia, serif",
          securityLevel: "loose",
          // Let nodes scale up — useMaxWidth keeps responsive sizing
          flowchart: { useMaxWidth: true, htmlLabels: true, curve: "basis" },
          sequence: { useMaxWidth: true, actorMargin: 60, messageFontSize: 14 },
          gantt: { useMaxWidth: true, fontSize: 13, sectionFontSize: 14 },
          themeVariables: isDark
            ? {
                background: "transparent",
                primaryColor: "#1A1612",
                primaryTextColor: "#E8DFD2",
                primaryBorderColor: "#D4A574",
                lineColor: "#9C8E79",
                secondaryColor: "#261E18",
                tertiaryColor: "#14100C",
                noteBkgColor: "#261E18",
                noteTextColor: "#E8DFD2",
                edgeLabelBackground: "#14100C",
                clusterBkg: "#261E18",
                clusterBorder: "#40352A",
                titleColor: "#E8DFD2",
                fontSize: "15px",
              }
            : {
                background: "transparent",
                primaryColor: "#F5F0E6",
                primaryTextColor: "#16120E",
                primaryBorderColor: "#8B2635",
                lineColor: "#716452",
                secondaryColor: "#E8DFCF",
                tertiaryColor: "#F8F3E9",
                noteBkgColor: "#E8DFCF",
                noteTextColor: "#16120E",
                edgeLabelBackground: "#F5F0E6",
                clusterBkg: "#E8DFCF",
                clusterBorder: "#BFAF94",
                titleColor: "#16120E",
                fontSize: "15px",
              },
        });
        const renderId = `mmd-${id}-${Date.now()}`;
        const result = await mermaid.render(renderId, code.trim());
        if (!cancelled) {
          setSvg(fitSvg(result.svg));
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Mermaid render failed");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, resolvedTheme, id]);

  if (error) {
    return (
      <figure className="my-8 border border-rule bg-subtle/50 p-4">
        <p className="font-sans text-[10px] uppercase tracking-eyebrow text-accent">
          Mermaid render error
        </p>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-xs text-muted">
          {error}
          {"\n\n"}
          {code}
        </pre>
      </figure>
    );
  }

  return (
    <figure className="my-12 -mx-4 md:-mx-12 lg:-mx-20">
      <div className="not-prose w-full overflow-x-auto rounded-sm border border-rule bg-paper/50 px-6 py-8 md:px-10">
        {svg ? (
          <div
            className="mermaid-svg w-full"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="font-italic italic text-sm text-muted">
            Loading diagram…
          </div>
        )}
      </div>
      <figcaption className="mt-3 text-center font-italic italic text-xs text-muted">
        ✦ Diagram ✦
      </figcaption>
    </figure>
  );
}
