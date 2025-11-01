import { createConfig } from "@gluestack-ui/themed";
// 1. Importe a configuração padrão completa
import { config as defaultConfig } from "@gluestack-ui/config";

export const config = createConfig({
  // 2. Comece com TODAS as configurações padrão
  ...defaultConfig,
  
  // 3. Adicione ou sobrescreva os tokens que você deseja
  tokens: {
    ...defaultConfig.tokens, // Herda todos os tokens padrão
    colors: {
      ...defaultConfig.tokens.colors, // Herda todas as cores padrão
      backgroundError: "#fee2e2",
      backgroundWarning: "#fef9c3",
      backgroundSuccess: "#dcfce7",
      backgroundInfo: "#e0f2fe",
      backgroundMuted: "#f1f5f9",
      
      error800: "#991b1b",
      warning800: "#854d0e",
      success800: "#166534",
      info800: "#075985",
      background800: "#1e293b",
    },
  },
  aliases: {},
  themes: {
    light: {
      colors: {
        backgroundError: "$backgroundError",
        backgroundWarning: "$backgroundWarning",
        backgroundSuccess: "$backgroundSuccess",
        backgroundInfo: "$backgroundInfo",
        backgroundMuted: "$backgroundMuted",

        error800: "$error800",
        warning800: "$warning800",
        success800: "$success800",
        info800: "$info800",
        background800: "$background800",
      },
    },
    dark: {
      colors: {
        backgroundError: "#7f1d1d",
        backgroundWarning: "#78350f",
        backgroundSuccess: "#14532d",
        backgroundInfo: "#0c4a6e",
        backgroundMuted: "#1e293b",

        error800: "#fecaca",
        warning800: "#fef08a",
        success800: "#bbf7d0",
        info800: "#bae6fd",
        background800: "#f1f5f9",
      },
    },
  },
});
