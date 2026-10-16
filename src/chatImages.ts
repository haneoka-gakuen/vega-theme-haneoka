import { chatDefaultDataRoot, chatIconImagePath, isAdvChatIconAssetName } from "@haneoka/vega";
import { HANEOKA_CHAT_DATA_ROOT } from "./chatAssets.js";
import { resolveHaneokaSourceAsset, type HaneokaThemeAssetProvider } from "./host.js";

export function resolveHaneokaChatImage(
  host: HaneokaThemeAssetProvider | undefined,
  runtime: Parameters<typeof chatDefaultDataRoot>[0],
  value: unknown,
  kind: "icon" | "stamp",
  activeRoot: string,
): string {
  const source = String(value ?? "").trim();
  if (!source) return "";
  const provided = host?.resolveChatImage?.(source, kind);
  if (provided) return provided;
  if (/^(?:data:|blob:|https?:\/\/|\/)/iu.test(source)) return source;
  if (kind === "icon" && isAdvChatIconAssetName(source)) {
    return (
      chatIconImagePath(source, runtime) ||
      resolveHaneokaSourceAsset(host, `Assets/AddressableResources/Adv/Chat/Icon/${source.replace(/\.png$/u, "")}.png`)
    );
  }
  if (kind === "stamp" && !source.startsWith("Assets/") && !source.startsWith("runtime/") && !/^stamp(?:\.png)?$/iu.test(source)) {
    return resolveHaneokaSourceAsset(
      host,
      `Assets/AddressableResources/Adv/Chat/Stamp/${source.replace(/\.png$/u, "")}.png`,
    );
  }
  const file = source.endsWith(".png") ? source : `${source}.png`;
  const defaultRoot = chatDefaultDataRoot(runtime) || HANEOKA_CHAT_DATA_ROOT;
  const lineRoot = /\/ChatLINE$/iu.test(defaultRoot) ? defaultRoot : `${defaultRoot}/ChatLINE`;
  const path = source.includes("/")
    ? file
    : /^ADVChat/iu.test(source)
      ? `${lineRoot}/${file}`
      : /^(?:Icon|stamp)/iu.test(source)
        ? `${defaultRoot}/${file}`
        : `${activeRoot || defaultRoot}/${file}`;
  return resolveHaneokaSourceAsset(host, path);
}
