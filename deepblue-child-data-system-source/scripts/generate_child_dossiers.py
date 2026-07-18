#!/usr/bin/env python3
"""Generate the 30-page fictional child dossier PDF used by the prop website."""

import csv
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "public" / "aid-applications-30.csv"
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_PATH = OUTPUT_DIR / "child-dossiers-30.pdf"
PUBLIC_PATH = ROOT / "public" / "child-dossiers-30.pdf"
FONT_PATH = Path(
    os.environ.get(
        "CJK_FONT_PATH",
        ROOT / "tmp" / "pdfs" / "fontpkg-sc" / "NotoSansCJKsc-Regular.otf",
    )
)

DPI = 150
PAGE_W, PAGE_H = 1240, 1754
S = PAGE_W / 210

NAVY = "#12213A"
BLUE = "#2368ED"
PALE_BLUE = "#EDF3FF"
GREEN = "#12956C"
PALE_GREEN = "#E7F7F1"
RED = "#D73B47"
PALE_RED = "#FDECEF"
TEXT = "#26334A"
MUTED = "#7D899B"
LINE = "#DDE3EB"
PAPER = "#FAFBFC"
WHITE = "#FFFFFF"


def mm(value):
    return round(value * S)


def font(size, bold=False):
    path = FONT_PATH
    if bold:
        candidate = path.with_name("NotoSansCJKsc-Bold.otf")
        if candidate.exists():
            path = candidate
    return ImageFont.truetype(str(path), round(size * DPI / 72))


def text(draw, xy, value, size, fill=TEXT, anchor=None, bold=False):
    draw.text(xy, str(value), font=font(size, bold), fill=fill, anchor=anchor)


def wrap_text(draw, value, max_width, text_font):
    lines, current = [], ""
    for char in str(value):
        trial = current + char
        if current and draw.textlength(trial, font=text_font) > max_width:
            lines.append(current)
            current = char
        else:
            current = trial
    if current:
        lines.append(current)
    return lines


def paragraph(draw, value, x, y, width, size=10, fill=TEXT, leading=1.55):
    fnt = font(size)
    line_height = round(size * DPI / 72 * leading)
    for line in wrap_text(draw, value, width, fnt):
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_height
    return y


def crop_photo(sheet_key, index):
    image = Image.open(ROOT / "public" / f"children-set-{sheet_key}.png").convert("RGB")
    cell_w, cell_h = image.width / 5, image.height / 2
    col, row, pad = index % 5, index // 5, 3
    return image.crop(
        (
            int(col * cell_w + pad),
            int(row * cell_h + pad),
            int((col + 1) * cell_w - pad),
            int((row + 1) * cell_h - pad),
        )
    )


def cover_image(image, width, height):
    source_ratio, target_ratio = image.width / image.height, width / height
    if source_ratio > target_ratio:
        crop_w = int(image.height * target_ratio)
        left = (image.width - crop_w) // 2
        image = image.crop((left, 0, left + crop_w, image.height))
    else:
        crop_h = int(image.width / target_ratio)
        top = (image.height - crop_h) // 2
        image = image.crop((0, top, image.width, top + crop_h))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def rounded(draw, box, radius, fill):
    draw.rounded_rectangle(box, radius=radius, fill=fill)


def field(draw, label, value, x, y, width, accent=False):
    height = mm(18)
    rounded(draw, (x, y, x + width, y + height), mm(3), PALE_BLUE if accent else WHITE)
    text(draw, (x + mm(4), y + mm(5)), label, 7.5, MUTED)
    text(draw, (x + mm(4), y + mm(13.5)), value, 10.5, TEXT, anchor="lm")


def render_page(record, page_number):
    page = Image.new("RGB", (PAGE_W, PAGE_H), PAPER)
    draw = ImageDraw.Draw(page)

    draw.rectangle((0, 0, PAGE_W, mm(34)), fill=NAVY)
    rounded(draw, (mm(17), mm(10), mm(29), mm(22)), mm(2.5), BLUE)
    text(draw, (mm(23), mm(16)), "援", 15, WHITE, anchor="mm", bold=True)
    text(draw, (mm(34), mm(14)), "助学金申请人档案", 17, WHITE, anchor="lm", bold=True)
    text(draw, (mm(34), mm(23)), "EDU-AID APPLICANT DOSSIER / TEST DATA", 7.5, "#9DACBF", anchor="lm")
    text(draw, (PAGE_W - mm(17), mm(14)), record["档案编号"], 10, WHITE, anchor="rm", bold=True)
    text(draw, (PAGE_W - mm(17), mm(23)), f"档案页 {page_number:02d} / 30", 7.5, "#9DACBF", anchor="rm")

    photo_x, photo_y, photo_w, photo_h = mm(17), mm(41), mm(70), mm(108)
    rounded(draw, (photo_x - mm(1.5), photo_y - mm(1.5), photo_x + photo_w + mm(1.5), photo_y + photo_h + mm(1.5)), mm(3), WHITE)
    sheet_key = "a" if page_number <= 10 else "b" if page_number <= 20 else "c"
    photo = cover_image(crop_photo(sheet_key, (page_number - 1) % 10), photo_w, photo_h)
    page.paste(photo, (photo_x, photo_y))
    text(draw, (photo_x, photo_y + photo_h + mm(5)), "现场资料照片 · 非证件照 · 系统资料库", 7.5, "#657286")

    info_x = mm(98)
    text(draw, (info_x, mm(53)), record["姓名"], 27, TEXT, anchor="lm", bold=True)
    text(draw, (info_x, mm(64)), f'{record["性别"]}  |  {record["年龄"]}岁  |  {record["年级"]}', 9, MUTED, anchor="lm")
    success = record["审核状态"] == "匹配成功"
    rounded(draw, (info_x, mm(71), info_x + mm(31), mm(79)), mm(4), PALE_GREEN if success else PALE_RED)
    text(draw, (info_x + mm(15.5), mm(75)), record["审核状态"], 8, GREEN if success else RED, anchor="mm")

    field(draw, "年人均收入", f'人民币 {int(record["年人均收入"]):,} 元', info_x, mm(91), mm(45), True)
    field(draw, "家庭劳动力", f'{record["家庭劳动力"]} 人', info_x + mm(49), mm(91), mm(45))
    field(draw, "在校成绩", record["成绩"], info_x, mm(113), mm(45))
    field(draw, "上学距离", record["上学距离"], info_x + mm(49), mm(113), mm(45))

    section_y = mm(162)
    draw.rectangle((mm(17), section_y, mm(20), section_y + mm(8)), fill=BLUE)
    text(draw, (mm(24), section_y + mm(5)), "家庭与就学情况", 13, TEXT, anchor="lm", bold=True)
    draw.line((mm(17), section_y + mm(13), PAGE_W - mm(17), section_y + mm(13)), fill=LINE, width=2)

    cursor_y = section_y + mm(23)
    for label, value in (("所在地", record["所在地"]), ("监护人", record["监护人"]), ("家庭情况", record["家庭情况"])):
        text(draw, (mm(19), cursor_y), label, 8, MUTED)
        next_y = paragraph(draw, value, mm(48), cursor_y - mm(1), mm(142), 10.5, TEXT, 1.45)
        cursor_y = max(cursor_y + mm(13), next_y + mm(3))

    assessment_y = mm(216)
    rounded(draw, (mm(17), assessment_y, PAGE_W - mm(17), assessment_y + mm(48)), mm(3), WHITE)
    text(draw, (mm(23), assessment_y + mm(10)), "系统综合评估", 12, TEXT, bold=True)
    if record["姓名"] == "李小雨":
        summary = "父母双亡，与奶奶共同生活，每天步行十一里上学，成绩年级前三。系统判定教育潜力与帮扶需求高度匹配。"
    else:
        summary = f'申请人家庭年人均收入低于帮扶标准，家庭劳动力数量为{record["家庭劳动力"]}人。系统复核认为申请材料符合资助条件，转入人工复审队列。'
    paragraph(draw, summary, mm(23), assessment_y + mm(17), PAGE_W - mm(46), 9.5, "#58657A", 1.5)
    rounded(draw, (mm(23), assessment_y + mm(32), mm(95), assessment_y + mm(41)), mm(4.5), PALE_BLUE)
    text(draw, (mm(59), assessment_y + mm(36.5)), "困难指数 91.4  /  教育潜力 94.2", 8, BLUE, anchor="mm")
    rounded(draw, (mm(104), assessment_y + mm(32), mm(171), assessment_y + mm(41)), mm(4.5), PALE_GREEN if success else PALE_RED)
    badge = f'匹配企业：{record["匹配企业"]}' if success else "规则异常：待人工复核"
    text(draw, (mm(137.5), assessment_y + mm(36.5)), badge, 8, GREEN if success else RED, anchor="mm")

    draw.line((mm(17), mm(270), PAGE_W - mm(17), mm(270)), fill=LINE, width=2)
    text(draw, (mm(17), mm(277)), "助学金智能匹配系统 · 测试资料 · 仅供内部审核", 7, MUTED)
    text(draw, (PAGE_W - mm(17), mm(277)), f"ARCHIVE {record['档案编号']} / PAGE {page_number:02d}", 7, MUTED, anchor="ra")
    return page


def main():
    if not FONT_PATH.exists():
        raise FileNotFoundError(f"Set CJK_FONT_PATH to a Simplified Chinese OTF/TTF font: {FONT_PATH}")
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        records = list(csv.DictReader(handle))
    if len(records) != 30:
        raise ValueError(f"Expected 30 records, found {len(records)}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pages = [render_page(record, page_number) for page_number, record in enumerate(records, start=1)]
    pages[0].save(
        OUTPUT_PATH,
        "PDF",
        resolution=DPI,
        save_all=True,
        append_images=pages[1:],
        quality=90,
        optimize=True,
    )
    PUBLIC_PATH.write_bytes(OUTPUT_PATH.read_bytes())
    print(f"generated={OUTPUT_PATH}")
    print(f"public={PUBLIC_PATH}")


if __name__ == "__main__":
    main()
