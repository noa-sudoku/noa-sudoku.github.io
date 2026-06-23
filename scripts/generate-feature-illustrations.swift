import AppKit
import CoreGraphics
import Foundation

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath)
let sourceDir = CommandLine.arguments.dropFirst().first
  ?? root
    .appendingPathComponent("scripts")
    .appendingPathComponent("feature-illustration-bases")
    .path
let outputRoot = root
  .appendingPathComponent("public")
  .appendingPathComponent("assets")
  .appendingPathComponent("feature-illustrations")

let outputSize = CGSize(width: 1600, height: 900)

enum Lang: String, CaseIterable {
  case ko
  case en
  case ja
}

enum Feature: String, CaseIterable {
  case noAds
  case difficulty
  case records
  case help
  case notification
  case icloud

  var fileName: String {
    switch self {
    case .noAds: return "01-no-ads.png"
    case .difficulty: return "02-difficulty.png"
    case .records: return "03-records.png"
    case .help: return "04-help.png"
    case .notification: return "05-notification.png"
    case .icloud: return "06-icloud.png"
    }
  }

  var sourceName: String {
    switch self {
    case .noAds: return "01-no-ads-base.png"
    case .difficulty: return "02-difficulty-base.png"
    case .records: return "03-records-base.png"
    case .help: return "04-help-base.png"
    case .notification: return "05-notification-base.png"
    case .icloud: return "06-icloud-base.png"
    }
  }
}

struct Label {
  let lines: [String]
  let rect: CGRect
  let color: NSColor
  let size: CGFloat
  let alignment: NSTextAlignment
}

let red = NSColor(calibratedRed: 1.0, green: 0.08, blue: 0.05, alpha: 1)
let orange = NSColor(calibratedRed: 1.0, green: 0.43, blue: 0.0, alpha: 1)
let blue = NSColor(calibratedRed: 0.04, green: 0.42, blue: 1.0, alpha: 1)
let black = NSColor(calibratedWhite: 0.04, alpha: 1)

let sourceURL = URL(fileURLWithPath: sourceDir)

for lang in Lang.allCases {
  let langDir = outputRoot.appendingPathComponent(lang.rawValue)
  try FileManager.default.createDirectory(at: langDir, withIntermediateDirectories: true)

  for feature in Feature.allCases {
    let sourceImageURL = sourceURL.appendingPathComponent(feature.sourceName)
    guard let sourceImage = makeTransparentImage(from: sourceImageURL, targetSize: outputSize) else {
      fputs("Could not load source image: \(sourceImageURL.path)\n", stderr)
      exit(1)
    }

    guard let output = drawFeature(sourceImage: sourceImage, feature: feature, lang: lang) else {
      fputs("Could not draw feature: \(feature.rawValue) \(lang.rawValue)\n", stderr)
      exit(1)
    }

    let destination = langDir.appendingPathComponent(feature.fileName)
    try output.write(to: destination)
  }
}

print("Generated \(Feature.allCases.count * Lang.allCases.count) PNG feature illustrations in \(outputRoot.path)")

func makeTransparentImage(from url: URL, targetSize: CGSize) -> NSImage? {
  guard
    let image = NSImage(contentsOf: url),
    let cgImage = image.cgImage(forProposedRect: nil, context: nil, hints: nil),
    let transparent = whiteToAlpha(cgImage)
  else {
    return nil
  }

  return NSImage(cgImage: transparent, size: targetSize)
}

func whiteToAlpha(_ image: CGImage) -> CGImage? {
  let width = image.width
  let height = image.height
  let bytesPerRow = width * 4
  var data = [UInt8](repeating: 0, count: height * bytesPerRow)
  let colorSpace = CGColorSpaceCreateDeviceRGB()

  guard let context = CGContext(
    data: &data,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
    return nil
  }

  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

  for index in stride(from: 0, to: data.count, by: 4) {
    let r = Double(data[index])
    let g = Double(data[index + 1])
    let b = Double(data[index + 2])
    let alphaDistance = max(255 - r, 255 - g, 255 - b)

    if alphaDistance < 7 {
      data[index] = 0
      data[index + 1] = 0
      data[index + 2] = 0
      data[index + 3] = 0
      continue
    }

    let alpha = min(255, alphaDistance * 1.05)
    let a = alpha / 255
    let unmatteR = clamp((r - 255 * (1 - a)) / a)
    let unmatteG = clamp((g - 255 * (1 - a)) / a)
    let unmatteB = clamp((b - 255 * (1 - a)) / a)

    data[index] = UInt8(clamping: Int(round(unmatteR * a)))
    data[index + 1] = UInt8(clamping: Int(round(unmatteG * a)))
    data[index + 2] = UInt8(clamping: Int(round(unmatteB * a)))
    data[index + 3] = UInt8(clamping: Int(round(alpha)))
  }

  guard let provider = CGDataProvider(data: Data(data) as CFData) else {
    return nil
  }

  return CGImage(
    width: width,
    height: height,
    bitsPerComponent: 8,
    bitsPerPixel: 32,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.premultipliedLast.rawValue),
    provider: provider,
    decode: nil,
    shouldInterpolate: true,
    intent: .defaultIntent
  )
}

func clamp(_ value: Double) -> Double {
  min(255, max(0, value))
}

func drawFeature(sourceImage: NSImage, feature: Feature, lang: Lang) -> Data? {
  guard
    let rep = NSBitmapImageRep(
      bitmapDataPlanes: nil,
      pixelsWide: Int(outputSize.width),
      pixelsHigh: Int(outputSize.height),
      bitsPerSample: 8,
      samplesPerPixel: 4,
      hasAlpha: true,
      isPlanar: false,
      colorSpaceName: .deviceRGB,
      bytesPerRow: 0,
      bitsPerPixel: 0
    ),
    let graphicsContext = NSGraphicsContext(bitmapImageRep: rep)
  else {
    return nil
  }

  rep.size = outputSize
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = graphicsContext
  graphicsContext.imageInterpolation = .high
  NSColor.clear.setFill()
  NSRect(origin: .zero, size: outputSize).fill()
  sourceImage.draw(in: NSRect(origin: .zero, size: outputSize), from: .zero, operation: .sourceOver, fraction: 1)

  guard NSGraphicsContext.current?.cgContext != nil else {
    NSGraphicsContext.restoreGraphicsState()
    return nil
  }

  for label in labels(for: feature, lang: lang) {
    draw(label)
  }

  NSGraphicsContext.restoreGraphicsState()

  return rep.representation(using: .png, properties: [.compressionFactor: 0.92])
}

func toCanvas(_ topLeftRect: CGRect) -> CGRect {
  CGRect(
    x: topLeftRect.minX,
    y: outputSize.height - topLeftRect.maxY,
    width: topLeftRect.width,
    height: topLeftRect.height
  )
}

func draw(_ label: Label) {
  let paragraph = NSMutableParagraphStyle()
  paragraph.alignment = label.alignment
  paragraph.lineSpacing = -2

  let font = preferredFont(size: label.size)
  let shadow = NSShadow()
  shadow.shadowColor = NSColor.clear
  shadow.shadowBlurRadius = 0

  let outlineAttributes: [NSAttributedString.Key: Any] = [
    .font: font,
    .foregroundColor: label.color,
    .strokeColor: NSColor.white.withAlphaComponent(0.96),
    .strokeWidth: -8.0,
    .paragraphStyle: paragraph,
    .shadow: shadow
  ]

  let fillAttributes: [NSAttributedString.Key: Any] = [
    .font: font,
    .foregroundColor: label.color,
    .paragraphStyle: paragraph,
    .shadow: shadow
  ]

  let value = label.lines.joined(separator: "\n")
  let canvasRect = toCanvas(label.rect)
  value.draw(in: canvasRect, withAttributes: outlineAttributes)
  value.draw(in: canvasRect, withAttributes: fillAttributes)
}

func preferredFont(size: CGFloat) -> NSFont {
  for name in ["Nanum Pen Script", "Comic Sans MS", "Chalkboard SE", "Apple SD Gothic Neo"] {
    if let font = NSFont(name: name, size: size) {
      return font
    }
  }
  return NSFont.systemFont(ofSize: size, weight: .semibold)
}

func labels(for feature: Feature, lang: Lang) -> [Label] {
  switch feature {
  case .noAds:
    return [
      Label(lines: text(lang, ko: ["광고", "없음"], en: ["no ads"], ja: ["広告", "なし"]), rect: CGRect(x: 102, y: 536, width: 160, height: 96), color: red, size: 47, alignment: .left),
      Label(lines: text(lang, ko: ["집중"], en: ["focus"], ja: ["集中"]), rect: CGRect(x: 554, y: 232, width: 170, height: 64), color: orange, size: 50, alignment: .center),
      Label(lines: text(lang, ko: ["조용한", "보드"], en: ["quiet", "board"], ja: ["静かな", "盤面"]), rect: CGRect(x: 1400, y: 322, width: 178, height: 112), color: blue, size: 43, alignment: .left)
    ]
  case .difficulty:
    return [
      Label(lines: text(lang, ko: ["하나", "고르기"], en: ["pick one"], ja: ["ひとつ", "選ぶ"]), rect: CGRect(x: 122, y: 506, width: 190, height: 100), color: orange, size: 44, alignment: .left),
      Label(lines: [level(lang, index: 0)], rect: CGRect(x: 492, y: 392, width: 140, height: 56), color: black, size: levelSize(lang, index: 0), alignment: .center),
      Label(lines: [level(lang, index: 1)], rect: CGRect(x: 710, y: 333, width: 180, height: 56), color: black, size: levelSize(lang, index: 1), alignment: .center),
      Label(lines: [level(lang, index: 2)], rect: CGRect(x: 978, y: 283, width: 150, height: 56), color: black, size: levelSize(lang, index: 2), alignment: .center),
      Label(lines: [level(lang, index: 3)], rect: CGRect(x: 1262, y: 190, width: 170, height: 58), color: black, size: levelSize(lang, index: 3), alignment: .center),
      Label(lines: text(lang, ko: ["오늘의", "선택"], en: ["today's", "choice"], ja: ["今日の", "選択"]), rect: CGRect(x: 955, y: 672, width: 200, height: 110), color: blue, size: 39, alignment: .left)
    ]
  case .records:
    return [
      Label(lines: text(lang, ko: ["최고", "기록"], en: ["best"], ja: ["ベスト"]), rect: CGRect(x: 228, y: 344, width: 136, height: 92), color: orange, size: 42, alignment: .center),
      Label(lines: text(lang, ko: ["오늘"], en: ["today"], ja: ["今日"]), rect: CGRect(x: 1286, y: 316, width: 180, height: 64), color: red, size: 44, alignment: .left),
      Label(lines: text(lang, ko: ["저장됨"], en: ["saved"], ja: ["保存済み"]), rect: CGRect(x: 1082, y: 674, width: 210, height: 90), color: blue, size: 42, alignment: .left)
    ]
  case .help:
    return [
      Label(lines: text(lang, ko: ["힌트"], en: ["hint"], ja: ["ヒント"]), rect: CGRect(x: 966, y: 686, width: 150, height: 78), color: orange, size: 43, alignment: .center),
      Label(lines: text(lang, ko: ["되돌리기"], en: ["undo"], ja: ["元に戻す"]), rect: CGRect(x: 1052, y: 622, width: 175, height: 72), color: black, size: helpSize(lang), alignment: .left),
      Label(lines: text(lang, ko: ["메모"], en: ["notes"], ja: ["メモ"]), rect: CGRect(x: 1305, y: 612, width: 158, height: 76), color: blue, size: 40, alignment: .left),
      Label(lines: text(lang, ko: ["필요할 때만"], en: ["only when needed"], ja: ["必要なときだけ"]), rect: CGRect(x: 1135, y: 706, width: 330, height: 95), color: orange, size: onlySize(lang), alignment: .left)
    ]
  case .notification:
    return [
      Label(lines: text(lang, ko: ["오늘"], en: ["today"], ja: ["今日"]), rect: CGRect(x: 154, y: 520, width: 150, height: 70), color: orange, size: 43, alignment: .left),
      Label(lines: text(lang, ko: ["가벼운", "알림"], en: ["gentle", "nudge"], ja: ["やさしい", "通知"]), rect: CGRect(x: 710, y: 336, width: 220, height: 120), color: orange, size: 40, alignment: .left),
      Label(lines: text(lang, ko: ["1문제"], en: ["1 puzzle"], ja: ["1問"]), rect: CGRect(x: 1225, y: 342, width: 140, height: 58), color: blue, size: 34, alignment: .center),
      Label(lines: text(lang, ko: ["오늘"], en: ["today"], ja: ["今日"]), rect: CGRect(x: 1284, y: 512, width: 135, height: 58), color: blue, size: 34, alignment: .left),
      Label(lines: text(lang, ko: ["위젯"], en: ["widget"], ja: ["ウィジェット"]), rect: CGRect(x: 1436, y: 400, width: 162, height: 82), color: blue, size: widgetSize(lang), alignment: .left)
    ]
  case .icloud:
    return [
      Label(lines: text(lang, ko: ["기록"], en: ["record"], ja: ["記録"]), rect: CGRect(x: 188, y: 372, width: 130, height: 64), color: black, size: 35, alignment: .center),
      Label(lines: text(lang, ko: ["기록"], en: ["record"], ja: ["記録"]), rect: CGRect(x: 710, y: 405, width: 158, height: 70), color: black, size: 31, alignment: .center),
      Label(lines: text(lang, ko: ["기록"], en: ["record"], ja: ["記録"]), rect: CGRect(x: 980, y: 425, width: 158, height: 70), color: black, size: 31, alignment: .center),
      Label(lines: text(lang, ko: ["기록"], en: ["record"], ja: ["記録"]), rect: CGRect(x: 1344, y: 368, width: 142, height: 66), color: black, size: 35, alignment: .center),
      Label(lines: text(lang, ko: ["비공개"], en: ["private"], ja: ["非公開"]), rect: CGRect(x: 840, y: 636, width: 210, height: 86), color: blue, size: 44, alignment: .left),
      Label(lines: text(lang, ko: ["동기화"], en: ["sync"], ja: ["同期"]), rect: CGRect(x: 1340, y: 702, width: 210, height: 84), color: red, size: 47, alignment: .left)
    ]
  }
}

func text(_ lang: Lang, ko: [String], en: [String], ja: [String]) -> [String] {
  switch lang {
  case .ko: return ko
  case .en: return en
  case .ja: return ja
  }
}

func level(_ lang: Lang, index: Int) -> String {
  switch lang {
  case .ko: return ["쉬움", "보통", "어려움", "마스터"][index]
  case .en: return ["easy", "normal", "hard", "master"][index]
  case .ja: return ["かんたん", "ふつう", "むずかしい", "マスター"][index]
  }
}

func levelSize(_ lang: Lang, index: Int) -> CGFloat {
  if lang == .ja && index == 2 {
    return 35
  }
  return lang == .ko ? 39 : 42
}

func helpSize(_ lang: Lang) -> CGFloat {
  lang == .ko || lang == .ja ? 36 : 41
}

func onlySize(_ lang: Lang) -> CGFloat {
  switch lang {
  case .ko: return 40
  case .en: return 40
  case .ja: return 36
  }
}

func widgetSize(_ lang: Lang) -> CGFloat {
  switch lang {
  case .ko: return 39
  case .en: return 39
  case .ja: return 32
  }
}
