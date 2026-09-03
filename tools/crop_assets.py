from __future__ import annotations

from pathlib import Path
from shutil import copy2
from PIL import Image

ROOT = Path(r"D:\桌面\erbao")
PROJECT = ROOT / "how-i-see"
OUT = PROJECT / "public" / "assets"
DEV = PROJECT / "dev-references"

SOURCES = {
    "home": ROOT / "ChatGPT Image Sep 3, 2026, 04_10_53 PM (1).png",
    "cards": ROOT / "ChatGPT Image Sep 3, 2026, 04_10_54 PM (2).png",
    "about": ROOT / "ChatGPT Image Sep 3, 2026, 04_10_54 PM (3).png",
    "observe": ROOT / "ChatGPT Image Sep 3, 2026, 04_11_10 PM (1).png",
    "question": ROOT / "ChatGPT Image Sep 3, 2026, 04_11_11 PM (2).png",
    "make": ROOT / "ChatGPT Image Sep 3, 2026, 04_11_11 PM (3).png",
    "make-postcard": ROOT / "ChatGPT Image Sep 3, 2026, 04_11_12 PM (4).png",
    "notes": ROOT / "ChatGPT Image Sep 3, 2026, 04_11_12 PM (5).png",
    "unfinished": ROOT / "ChatGPT Image Sep 3, 2026, 04_11_13 PM (6).png",
}

CROPS = {
    "shared": {
        "logo": ("home", (28, 16, 150, 102)),
        "email": ("home", (1395, 24, 1612, 198)),
        "scroll": ("home", (38, 736, 292, 914)),
        "social": ("cards", (705, 792, 1036, 907)),
    },
    "home": {
        "flowers-top": ("home", (340, 86, 486, 292)),
        "collect-note": ("home", (479, 128, 609, 288)),
        "window-top": ("home", (605, 96, 790, 292)),
        "vase": ("home", (792, 93, 952, 281)),
        "portrait-top": ("home", (973, 123, 1129, 295)),
        "coast": ("home", (1114, 142, 1260, 264)),
        "fern": ("home", (1258, 110, 1392, 271)),
        "coffee": ("home", (153, 344, 311, 513)),
        "photo-booth": ("home", (314, 294, 496, 519)),
        "film": ("home", (505, 393, 621, 583)),
        "today-note": ("home", (1004, 315, 1168, 554)),
        "camera-shelf": ("home", (1164, 286, 1326, 425)),
        "field-frame": ("home", (1314, 259, 1490, 408)),
        "friend-strip": ("home", (1344, 399, 1462, 596)),
        "moment-note": ("home", (1414, 404, 1560, 592)),
        "little-note": ("home", (166, 530, 311, 663)),
        "market": ("home", (321, 530, 498, 668)),
        "camera": ("home", (277, 657, 399, 750)),
        "botanical-cat": ("home", (494, 584, 704, 769)),
        "ticket": ("home", (994, 580, 1148, 708)),
        "window-frame": ("home", (1164, 579, 1322, 824)),
        "memory-note": ("home", (1306, 638, 1470, 831)),
        "embroidery": ("home", (372, 713, 543, 915)),
        "stamp": ("home", (532, 735, 716, 920)),
        "landscape-wide": ("home", (690, 707, 986, 926)),
        "tram": ("home", (973, 746, 1149, 916)),
        "portrait-wreath": ("home", (676, 282, 1002, 590)),
    },
    "cards": {
        "card-observe": ("cards", (128, 271, 392, 683)),
        "card-question": ("cards", (434, 279, 689, 687)),
        "card-make": ("cards", (727, 279, 982, 688)),
        "card-notes": ("cards", (1028, 279, 1286, 693)),
        "card-unfinished": ("cards", (1325, 280, 1584, 695)),
        "pick": ("cards", (76, 710, 323, 824)),
    },
    "about": {
        "passport": ("about", (865, 0, 1672, 941)),
        "pronunciation": ("about", (149, 438, 482, 500)),
        "role-photographer": ("about", (103, 629, 319, 799)),
        "role-writer": ("about", (381, 631, 581, 821)),
        "role-researcher": ("about", (628, 598, 819, 808)),
    },
    "make": {
        "newspaper": ("make", (248, 107, 1387, 887)),
    },
    "make-postcard": {
        "postcard": ("make-postcard", (127, 140, 1194, 855)),
        "stamp-one": ("make-postcard", (1223, 265, 1384, 474)),
        "stamp-two": ("make-postcard", (1419, 297, 1577, 490)),
        "stamp-three": ("make-postcard", (1223, 495, 1408, 696)),
        "stamp-four": ("make-postcard", (1412, 516, 1580, 700)),
        "stamp-five": ("make-postcard", (1259, 700, 1494, 866)),
        "annotation": ("make-postcard", (1242, 167, 1537, 278)),
    },
    "notes": {
        "frame-heavy": ("notes", (90, 221, 458, 656)),
        "frame-outgrow": ("notes", (454, 224, 800, 657)),
        "frame-reminder": ("notes", (830, 222, 1134, 620)),
        "frame-remember": ("notes", (1182, 226, 1582, 663)),
    },
    "unfinished": {
        "tray": ("unfinished", (129, 348, 742, 897)),
        "loose-collage": ("unfinished", (850, 314, 1608, 926)),
        "subtitle": ("unfinished", (644, 186, 1028, 258)),
    },
    "question": {
        "keep-note": ("question", (106, 114, 319, 356)),
        "green-question": ("question", (318, 138, 472, 303)),
        "window": ("question", (36, 290, 190, 461)),
        "venn": ("question", (224, 353, 450, 579)),
        "research-log": ("question", (460, 314, 638, 558)),
        "field-note": ("question", (52, 487, 208, 675)),
        "landscape": ("question", (115, 572, 309, 749)),
        "portrait": ("question", (429, 564, 603, 765)),
        "small-question": ("question", (281, 673, 418, 832)),
        "big-question": ("question", (692, 395, 941, 594)),
        "stamp": ("question", (954, 386, 1051, 506)),
        "embroidery": ("question", (748, 603, 906, 787)),
        "filmstrip": ("question", (934, 556, 1041, 826)),
        "abstract": ("question", (584, 718, 876, 903)),
        "home-note": ("question", (1120, 108, 1305, 302)),
        "desk": ("question", (1317, 129, 1518, 318)),
        "unanswered": ("question", (1061, 317, 1289, 549)),
        "chart": ("question", (1283, 362, 1518, 576)),
        "flower": ("question", (1489, 324, 1638, 583)),
        "good-questions": ("question", (1059, 551, 1289, 722)),
        "progress": ("question", (1283, 620, 1410, 743)),
        "question-lab": ("question", (1406, 620, 1595, 849)),
        "meadow": ("question", (1066, 727, 1312, 907)),
    },
}

DEV_NAMES = {
    "home": "REF-01-HOME.png",
    "cards": "REF-02-CARDS.png",
    "unfinished": "REF-03-FINISHED-UNFINISHED.png",
    "notes": "REF-04-NOTES.png",
    "make": "REF-05-MAKE-NEWSPAPER.png",
    "make-postcard": "REF-06-MAKE-POSTCARD.png",
    "observe": "REF-07-OBSERVE.png",
    "question": "REF-08-QUESTION.png",
    "about": "REF-09-ABOUT.png",
}

def save_crop(group: str, name: str, source: str, box: tuple[int, int, int, int]) -> None:
    destination = OUT / group
    destination.mkdir(parents=True, exist_ok=True)
    with Image.open(SOURCES[source]).convert("RGB") as image:
        image.crop(box).save(destination / f"{name}.webp", "WEBP", quality=94, method=6)

def main() -> None:
    DEV.mkdir(parents=True, exist_ok=True)
    for key, source in SOURCES.items():
        copy2(source, DEV / DEV_NAMES[key])
    for group, values in CROPS.items():
        for name, (source, box) in values.items():
            save_crop(group, name, source, box)
    print(f"Generated {sum(len(v) for v in CROPS.values())} crops in {OUT}")

if __name__ == "__main__":
    main()
