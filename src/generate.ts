/**
 * Theme Generator
 * Generates VS Code and Zed themes from the shared palette
 * Supports multiple theme variants from a single source
 */

import { writeFileSync } from "node:fs";
import { createVscodeColors } from "./vscode/ui";
import { createTokenColors } from "./vscode/tokenColors";
import { createSemanticTokenColors } from "./vscode/semantic";
import { createZedStyle, createZedPlayers } from "./zed/style";
import { createZedSyntax } from "./zed/syntax";
import { createItermColors } from "./iterm/colors";
import { generateItermPlist } from "./iterm/plist";
import { createWarpTheme } from "./warp/theme";
import { variants, mergeVariant, getFileSuffix } from "./variants";
import type { VSCodeTheme, ZedTheme, ZedStyle } from "./types";

// =============================================================================
// VS Code Theme Generation
// =============================================================================

function generateVSCodeThemes(): void {
	for (const variant of variants) {
		const semantic = mergeVariant(variant);
		const suffix = getFileSuffix(variant);

		const theme: VSCodeTheme = {
			name: variant.name,
			type: "dark",
			colors: createVscodeColors(semantic),
			tokenColors: createTokenColors(semantic),
			semanticHighlighting: true,
			semanticTokenColors: createSemanticTokenColors(semantic),
		};

		const filename = `./vscode/theme${suffix}.json`;
		writeFileSync(filename, JSON.stringify(theme, null, 3) + "\n");

		console.log(`✓ Generated: ${filename}`);
	}
}

// =============================================================================
// Zed Theme Generation
// =============================================================================

function generateZedThemes(): void {
	for (const variant of variants) {
		const semantic = mergeVariant(variant);
		const suffix = getFileSuffix(variant);

		// Build style object with players and syntax embedded
		const style: ZedStyle = {
			...createZedStyle(semantic),
			players: createZedPlayers(semantic),
			syntax: createZedSyntax(semantic),
		};

		const theme: ZedTheme = {
			$schema: "https://zed.dev/schema/themes/v0.1.0.json",
			name: variant.name,
			author: "Mehdi Hoseini <mhhhhp@proton.me>",
			type: "dark",
			themes: [
				{
					name: variant.name,
					appearance: "dark",
					style,
				},
			],
		};

		const filename = `./themes/zed${suffix}.json`;
		writeFileSync(filename, JSON.stringify(theme, null, "\t") + "\n");

		console.log(`✓ Generated: ${filename}`);
	}
}

// =============================================================================
// iTerm2 Theme Generation
// =============================================================================

function generateItermThemes(): void {
	for (const variant of variants) {
		const semantic = mergeVariant(variant);

		const colors = createItermColors(semantic);
		const plist = generateItermPlist(colors);

		const filename = `./src/iterm/${variant.name}.itermcolors`;
		writeFileSync(filename, plist);

		console.log(`✓ Generated: ${filename}`);
	}
}

// =============================================================================
// Warp Theme Generation
// =============================================================================

function generateWarpThemes(): void {
	for (const variant of variants) {
		const semantic = mergeVariant(variant);

		const yaml = createWarpTheme(semantic);

		const filename = `./src/warp/${variant.name}.yaml`;
		writeFileSync(filename, yaml);

		console.log(`✓ Generated: ${filename}`);
	}
}

// =============================================================================
// Main
// =============================================================================

console.log("\n🦒 Short Giraffe Theme Generator\n");
console.log(`Generating ${variants.length} theme variant(s)...\n`);

generateVSCodeThemes();
generateZedThemes();
generateItermThemes();
generateWarpThemes();

console.log("\n✨ Done!\n");
